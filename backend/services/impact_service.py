import json
from typing import Tuple, List
from sqlalchemy import text
from backend.services.db_connector import db_connector
from backend.utils.logger import logger

def analyze_query_impact(sql_query: str, db_type: str = "postgres") -> Tuple[int, str, List[str]]:
    """
    Real EXPLAIN logic.
    Returns: estimated_rows, cost_estimate, warnings
    """
    warnings = []
    
    # Basic static checks
    if "SELECT *" in sql_query.upper():
        warnings.append("Consider specifying columns instead of using SELECT *")
        
    if "JOIN" not in sql_query.upper() and "WHERE" not in sql_query.upper():
        warnings.append("Full table scan likely without a WHERE clause.")
        
    estimated_rows = 0
    cost_estimate = "Unknown"
        
    try:
        engine = db_connector.get_engine(db_type)
        
        # Prepare EXPLAIN query based on dialect
        if db_type == "postgres":
            explain_query = f"EXPLAIN (FORMAT JSON) {sql_query}"
        elif db_type == "mysql":
            explain_query = f"EXPLAIN FORMAT=JSON {sql_query}"
        else:
            explain_query = f"EXPLAIN {sql_query}"
            
        with engine.connect() as conn:
            result = conn.execute(text(explain_query))
            row = result.fetchone()
            
            if not row:
                return estimated_rows, cost_estimate, warnings
                
            explain_output = row[0]
            
            # For MySQL, EXPLAIN FORMAT=JSON returns a string, while Postgres might return a dict or string
            if isinstance(explain_output, str):
                try:
                    plan_json = json.loads(explain_output)
                except json.JSONDecodeError:
                    plan_json = None
            else:
                plan_json = explain_output
                
            if not plan_json:
                return estimated_rows, cost_estimate, warnings
                
            if db_type == "postgres":
                # Postgres JSON structure: [{"Plan": {"Total Cost": 12.34, "Plan Rows": 100, ...}}]
                if isinstance(plan_json, list) and len(plan_json) > 0:
                    plan = plan_json[0].get("Plan", {})
                    estimated_rows = int(plan.get("Plan Rows", 0))
                    total_cost = float(plan.get("Total Cost", 0))
                    cost_estimate = f"{total_cost:.2f}"
                    
                    # Detect Seq Scan
                    if plan.get("Node Type") == "Seq Scan":
                        if "Sequential Scan detected" not in str(warnings):
                            warnings.append("Sequential Scan detected. Index may be missing.")
            
            elif db_type == "mysql":
                # MySQL JSON structure: {"query_block": {"cost_info": {"query_cost": "10.00"}, "table": {"rows_examined_per_scan": 1000, "access_type": "ALL"}}}
                if isinstance(plan_json, dict) and "query_block" in plan_json:
                    query_block = plan_json["query_block"]
                    
                    cost_info = query_block.get("cost_info", {})
                    cost_estimate = cost_info.get("query_cost", "Unknown")
                    
                    table_info = query_block.get("table", {})
                    if "rows_examined_per_scan" in table_info:
                        estimated_rows = int(table_info["rows_examined_per_scan"])
                        
                    # Detect full table scan in MySQL (access_type = ALL)
                    if table_info.get("access_type") == "ALL":
                        if "Full table scan detected (type: ALL)" not in str(warnings):
                            warnings.append("Full table scan detected (type: ALL). Index may be missing.")

    except Exception as e:
        logger.error(f"Error executing EXPLAIN: {str(e)}")
        warnings.append(f"Could not generate query plan: {str(e)}")
        
    return estimated_rows, str(cost_estimate), warnings
