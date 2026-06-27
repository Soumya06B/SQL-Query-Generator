from sqlalchemy.engine import Engine
from sqlalchemy import text
from typing import Dict, Any, List, Tuple
from backend.utils.logger import logger
import time

def execute_sql(engine: Engine, sql_query: str, max_rows: int = 100) -> Tuple[List[str], List[Dict[str, Any]], float]:
    """Executes a validated query against the database safely."""
    start_time = time.time()
    try:
        with engine.connect() as conn:
            result = conn.execute(text(sql_query))
            columns = list(result.keys())
            
            rows = []
            for row in result.fetchmany(max_rows):
                # Convert row mapping to dict safely
                rows.append(dict(zip(columns, row)))
                
        exec_time_ms = (time.time() - start_time) * 1000
        return columns, rows, exec_time_ms
    except Exception as e:
        logger.error(f"SQL Execution Error: {str(e)}")
        raise e
