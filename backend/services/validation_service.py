from typing import List, Tuple
from backend.utils.helpers import is_safe_query

def validate_sql(sql_query: str) -> Tuple[bool, List[str]]:
    """
    Validates SQL syntax and safety.
    """
    errors = []
    
    if not is_safe_query(sql_query):
        errors.append("Unsafe query detected. Only SELECT statements are permitted in this mode.")
        
    if not sql_query.strip():
        errors.append("Query is empty.")
        
    is_valid = len(errors) == 0
    return is_valid, errors
