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

@router.post("/generate-sql", response_model=GenerateSQLResponse)
def generate_sql(request: GenerateSQLRequest, db: Session = Depends(get_db)):
    try:
        raw_schema = db_connector.get_schema(request.db_type)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch schema for {request.db_type}: {str(e)}")

    schema_context = format_schema_for_llm(raw_schema)
    raw_json_response = generate_sql_from_prompt(request.prompt, schema_context)
    
    try:
        parsed_response = json.loads(raw_json_response)
        generated_sql = parsed_response.get("sql", "")
        alternatives = parsed_response.get("alternatives", [])
        explanation = parsed_response.get("explanation", "")
        tables = parsed_response.get("tables", [])
        columns = parsed_response.get("columns", [])
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail="Failed to parse LLM response into structured JSON.")
    
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
