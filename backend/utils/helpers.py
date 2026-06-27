import re
from backend.config import get_settings

def clean_sql_query(raw_query: str) -> str:
    """Removes markdown backticks and extra whitespace from generated SQL."""
    cleaned = raw_query.replace("```sql", "").replace("```", "").strip()
    return cleaned

def is_safe_query(query: str) -> bool:
    """Basic sanity check to prevent destructive queries based on configured ALLOWED_SQL_ACTIONS."""
    settings = get_settings()
    upper_query = query.upper()
    
    # Base destructive keywords that are usually always blocked in AI generators
    destructive_keywords = ["DROP", "ALTER", "TRUNCATE", "CREATE", "GRANT", "REVOKE"]
    
    allowed_actions = [action.upper() for action in settings.ALLOWED_SQL_ACTIONS]
    
    if "DELETE" not in allowed_actions:
        destructive_keywords.append("DELETE")
    if "UPDATE" not in allowed_actions:
        destructive_keywords.append("UPDATE")
    if "INSERT" not in allowed_actions:
        destructive_keywords.append("INSERT")
        
    for keyword in destructive_keywords:
        # Use regex to check for word boundaries, so we don't accidentally match 
        # a column name like 'last_update_date' or 'drop_location'.
        if re.search(rf'\b{keyword}\b', upper_query):
            return False
            
    # Enforce WHERE clause on UPDATE or DELETE to prevent bulk table modifications
    if re.search(r'\bUPDATE\b', upper_query) or re.search(r'\bDELETE\b', upper_query):
        if not re.search(r'\bWHERE\b', upper_query):
            return False
            
    return True
