import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.schemas.request import GenerateSQLRequest
from backend.schemas.response import GenerateSQLResponse
from backend.services.schema_service import format_schema_for_llm
from backend.services.llm_service import generate_sql_from_prompt
from backend.services.db_connector import db_connector
from backend.database.session import get_db
from backend.models.history import QueryHistory

router = APIRouter()

import re
from backend.utils.logger import logger

def clean_json_response(raw: str) -> str:
    """Attempt to extract JSON from markdown or raw text."""
    raw = raw.strip()
    if raw.startswith("```json"):
        raw = raw[7:]
    elif raw.startswith("```"):
        raw = raw[3:]
        
    if raw.endswith("```"):
        raw = raw[:-3]
        
    # Sometimes LLMs wrap it in extra text, try to find the outermost braces
    start_idx = raw.find("{")
    end_idx = raw.rfind("}")
    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
        raw = raw[start_idx:end_idx+1]
        
    return raw.strip()

def normalize_alternatives(alts):
    if not isinstance(alts, list):
        return []
    normalized = []
    for idx, alt in enumerate(alts):
        if isinstance(alt, str):
            normalized.append({
                "id": str(idx + 1),
                "title": f"Alternative {idx + 1}",
                "description": "",
                "sql": alt,
                "cost": "Unknown"
            })
        elif isinstance(alt, dict):
            normalized.append({
                "id": str(alt.get("id", idx + 1)),
                "title": str(alt.get("title", f"Alternative {idx + 1}")),
                "description": str(alt.get("description", "")),
                "sql": str(alt.get("sql", "")),
                "cost": str(alt.get("cost", "Unknown"))
            })
    return normalized

@router.post("/generate-sql", response_model=GenerateSQLResponse)
def generate_sql(request: GenerateSQLRequest, db: Session = Depends(get_db)):
    try:
        raw_schema = db_connector.get_schema(request.db_type)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch schema for {request.db_type}: {str(e)}")

    schema_context = format_schema_for_llm(raw_schema)
    
    max_retries = 2
    parsed_response = None
    
    for attempt in range(max_retries):
        prompt_to_send = request.prompt
        if attempt > 0:
            prompt_to_send += "\n\nCRITICAL: YOUR PREVIOUS OUTPUT WAS INVALID JSON. YOU MUST RETURN ONLY RAW VALID JSON WITHOUT ANY MARKDOWN FORMATTING OR EXTRA TEXT."
            
        raw_json_response = generate_sql_from_prompt(prompt_to_send, schema_context)
        cleaned_json = clean_json_response(raw_json_response)
        
        try:
            parsed_response = json.loads(cleaned_json)
            if not isinstance(parsed_response, dict) or "sql" not in parsed_response:
                raise ValueError("Response is missing the root 'sql' key.")
            break
        except (json.JSONDecodeError, ValueError) as e:
            logger.warning(f"Attempt {attempt+1} failed to parse LLM response: {str(e)}")
            if attempt == max_retries - 1:
                raise HTTPException(status_code=500, detail="Failed to parse LLM response into structured JSON after multiple attempts.")
    
    generated_sql = parsed_response.get("sql", "")
    alternatives = normalize_alternatives(parsed_response.get("alternatives", []))
    explanation = parsed_response.get("explanation", "")
    tables = parsed_response.get("tables", [])
    columns = parsed_response.get("columns", [])
    
    # Save to history
    history_entry = QueryHistory(
        prompt=request.prompt,
        generated_sql=generated_sql,
        status="generated"
    )
    db.add(history_entry)
    db.commit()
    
    return GenerateSQLResponse(
        sql=generated_sql,
        alternatives=alternatives,
        explanation=explanation,
        tables=tables,
        columns=columns
    )
