from sqlalchemy import create_engine, inspect
from backend.config import get_settings
from typing import Dict, Any, List

settings = get_settings()

class DatabaseConnector:
    def __init__(self):
        self.engines = {}
        
        if settings.POSTGRES_URL:
            self.engines["postgres"] = create_engine(settings.POSTGRES_URL)
            
        if settings.MYSQL_URL:
            self.engines["mysql"] = create_engine(settings.MYSQL_URL)

    def get_engine(self, db_type: str):
        engine = self.engines.get(db_type)
        if not engine:
            raise ValueError(f"Database of type '{db_type}' is not configured or unsupported.")
        return engine

    def test_connection(self, db_type: str) -> bool:
        engine = self.get_engine(db_type)
        try:
            with engine.connect() as conn:
                return True
        except Exception as e:
            raise RuntimeError(f"Failed to connect to {db_type}: {str(e)}")

    def get_tables(self, db_type: str) -> List[str]:
        engine = self.get_engine(db_type)
        inspector = inspect(engine)
        return inspector.get_table_names()

    def get_schema(self, db_type: str) -> Dict[str, Any]:
        engine = self.get_engine(db_type)
        inspector = inspect(engine)
        
        schema = {}
        for table_name in inspector.get_table_names():
            pk_constraint = inspector.get_pk_constraint(table_name)
            pk_columns = pk_constraint.get("constrained_columns", []) if pk_constraint else []
            
            columns = []
            for col in inspector.get_columns(table_name):
                columns.append({
                    "name": col["name"],
                    "type": str(col["type"]),
                    "primary_key": col["name"] in pk_columns
                })
            
            foreign_keys = inspector.get_foreign_keys(table_name)
            
            schema[table_name] = {
                "columns": columns,
                "foreign_keys": foreign_keys
            }
            
        return schema

# Singleton instance
db_connector = DatabaseConnector()
