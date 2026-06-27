from sqlalchemy.engine import Engine
from sqlalchemy import text
from typing import Dict, Any, List, Tuple
from backend.utils.logger import logger
from backend.config import get_settings
import time

def execute_sql(engine: Engine, sql_query: str, db_type: str, max_rows: int = 100) -> Tuple[List[str], List[Dict[str, Any]], float]:
    """Executes a validated query against the database safely."""
    settings = get_settings()
    timeout_ms = settings.QUERY_TIMEOUT_MS
    
    start_time = time.time()
    try:
        with engine.connect() as conn:
            # Set session-level timeout before executing the query
            if db_type == "postgres":
                conn.execute(text(f"SET statement_timeout = {timeout_ms}"))
            elif db_type == "mysql":
                conn.execute(text(f"SET SESSION max_execution_time={timeout_ms}"))
                
            result = conn.execute(text(sql_query))
            
            # If it's a mutating query, there might be no rows to fetch
            if not result.returns_rows:
                conn.commit()
                exec_time_ms = (time.time() - start_time) * 1000
                return ["Status"], [{"Status": "Success (Mutating Query)"}], exec_time_ms

            columns = list(result.keys())
            rows = []
            
            # Safe chunked fetching
            for row in result.fetchmany(max_rows):
                rows.append(dict(zip(columns, row)))
                
        exec_time_ms = (time.time() - start_time) * 1000
        return columns, rows, exec_time_ms
    except Exception as e:
        logger.error(f"SQL Execution Error: {str(e)}")
        raise e
