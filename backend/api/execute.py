from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.schemas.request import ExecuteQueryRequest
from backend.schemas.response import ExecuteQueryResponse
from backend.services.execution_service import execute_sql
from backend.services.validation_service import validate_sql
from backend.database.session import get_db
from backend.config import get_settings
from backend.services.db_connector import db_connector

router = APIRouter()
settings = get_settings()

@router.post("/execute-query", response_model=ExecuteQueryResponse)
def execute_query(request: ExecuteQueryRequest, db: Session = Depends(get_db)):
    if not settings.ALLOW_EXECUTION:
        raise HTTPException(status_code=403, detail="Query execution is disabled globally.")
        
    # Double-check validation before execution
    is_valid, errors = validate_sql(request.sql_query)
    if not is_valid:
        raise HTTPException(status_code=400, detail=f"Query failed validation before execution: {errors}")
        
    try:
        engine = db_connector.get_engine(request.db_type)
        columns, rows, exec_time = execute_sql(engine, request.sql_query, settings.MAX_ROWS_RETURNED)
        return ExecuteQueryResponse(
            status="success",
            columns=columns,
            rows=rows,
            execution_time_ms=exec_time
        )
    except Exception as e:
        return ExecuteQueryResponse(
            status="error",
            error=str(e)
        )
