from typing import Tuple, List

def analyze_query_impact(sql_query: str) -> Tuple[int, str, List[str]]:
    """
    Stub for EXPLAIN/EXPLAIN ANALYZE logic.
    Returns: estimated_rows, cost_estimate, warnings
    """
    warnings = []
    
    if "SELECT *" in sql_query.upper():
        warnings.append("Consider specifying columns instead of using SELECT *")
        
    if "JOIN" not in sql_query.upper() and "WHERE" not in sql_query.upper():
        warnings.append("Full table scan likely without a WHERE clause.")
        
    return 1000, "Medium", warnings
