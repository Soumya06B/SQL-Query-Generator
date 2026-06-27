def clean_sql_query(raw_query: str) -> str:
    """Removes markdown backticks and extra whitespace from generated SQL."""
    cleaned = raw_query.replace("```sql", "").replace("```", "").strip()
    return cleaned

def is_safe_query(query: str) -> bool:
    """Basic sanity check to prevent destructive queries if only SELECT is allowed."""
    upper_query = query.upper()
    destructive_keywords = ["DROP", "DELETE", "UPDATE", "INSERT", "ALTER", "TRUNCATE"]
    for keyword in destructive_keywords:
        if keyword in upper_query:
            return False
    return True
