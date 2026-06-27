from backend.services.llm_service import query_ollama

def explain_sql(sql_query: str, db_type: str = "postgres") -> str:
    """Uses LLM to explain a SQL query."""
    prompt = f"Explain the following {db_type.upper()} query in simple terms for a non-technical user:\n\n{sql_query}"
    return query_ollama(prompt)
