from typing import List, Tuple
from backend.utils.helpers import is_safe_query
from backend.config import get_settings

def validate_sql(sql_query: str) -> Tuple[bool, List[str]]:
    """
    Validates SQL syntax and safety.
    """
    errors = []
    
    if not is_safe_query(sql_query):
        settings = get_settings()
        allowed = ", ".join(settings.ALLOWED_SQL_ACTIONS)
        errors.append(f"Unsafe query detected. Only {allowed} statements are permitted. UPDATE and DELETE must include a WHERE clause.")
        
    if not sql_query.strip():
        errors.append("Query is empty.")
        
    is_valid = len(errors) == 0
    return is_valid, errors
