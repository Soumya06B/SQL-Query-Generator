import time
import requests
from fastapi import HTTPException
from backend.config import get_settings
from backend.utils.logger import logger

settings = get_settings()


def query_ollama(prompt: str) -> str:
    """Send a prompt to local Ollama API."""
    try:
        logger.info(f"Ollama Request - Prompt length: {len(prompt)} chars")

        start_time = time.time()

        response = requests.post(
            settings.OLLAMA_API_URL,
            json={
                "model": settings.OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False
            },
            timeout=120
        )

        duration = time.time() - start_time
        logger.info(f"Ollama Response - Duration: {duration:.2f} seconds")

        print("Status:", response.status_code)

        if response.status_code == 200:
            raw_text = response.text
            logger.info(f"Raw Ollama response length: {len(raw_text)}")
            print("Raw Response:", raw_text[:1000])

        response.raise_for_status()

        return response.json().get("response", "")

    except requests.exceptions.ConnectionError:
        logger.error("Ollama API Error: Connection refused")
        raise HTTPException(
            status_code=503,
            detail="Ollama is not running."
        )

    except requests.exceptions.Timeout:
        logger.error("Ollama API Error: Request timed out")
        raise HTTPException(
            status_code=504,
            detail="Ollama request timed out."
        )

    except Exception as e:
        logger.error(f"Ollama API Error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"LLM processing failed: {str(e)}"
        )


def generate_sql_from_prompt(prompt: str, schema_context: str) -> str:
    """
    Generate SQL from natural language.
    Must return JSON string.
    """

    system_prompt = f"""
You are an expert SQL developer.

Convert the user's request into SQL.

Return ONLY valid JSON.

Example:

{{
  "sql": "SELECT * FROM students WHERE marks > 80;",
  "alternatives": [],
  "explanation": "Shows students with marks above 80.",
  "tables": ["students"],
  "columns": ["marks"]
}}

Rules:
1. Return JSON only.
2. No markdown.
3. No ```json blocks.
4. No extra text.
5. The response must be parseable by json.loads().

Schema Context:
{schema_context}

User Request:
{prompt}
"""

    return query_ollama(system_prompt)