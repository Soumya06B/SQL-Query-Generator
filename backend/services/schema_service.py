from typing import Dict, Any
import json

def format_schema_for_llm(schema_metadata: Dict[str, Any]) -> str:
    """
    Formats dictionary schema metadata into a plain text representation
    so the LLM understands table structures without direct DB access.
    """
    if not schema_metadata:
        return "No schema provided."
    
    try:
        lines = []
        for table_name, table_info in schema_metadata.items():
            if isinstance(table_info, dict) and "columns" in table_info:
                cols = []
                for col in table_info["columns"]:
                    if isinstance(col, dict):
                        col_name = col.get("name", "")
                        col_type = col.get("type", "")
                        cols.append(f"{col_name} ({col_type})")
                    elif isinstance(col, str):
                        cols.append(col)
                lines.append(f"Table {table_name}: " + ", ".join(cols))
            else:
                lines.append(f"Table {table_name}: {table_info}")
        
        if lines:
            return "\n".join(lines)
    except Exception:
        pass # fallback to json below

    # Fallback if structure is unknown
    return json.dumps(schema_metadata, separators=(',', ':'))
