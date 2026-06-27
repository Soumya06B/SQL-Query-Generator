from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class GenerateSQLRequest(BaseModel):
    prompt: str = Field(..., description="Natural language prompt for query generation")
    db_type: str = Field("postgres", description="Target database type (e.g. postgres, mysql)")

class ExplainQueryRequest(BaseModel):
    sql_query: str = Field(..., description="The SQL query to explain")

class ValidateQueryRequest(BaseModel):
    sql_query: str = Field(..., description="The SQL query to validate against syntax and schema")
    db_type: str = Field("postgres", description="Target database type (e.g. postgres, mysql)")

class AnalyzeImpactRequest(BaseModel):
    sql_query: str = Field(..., description="The SQL query to analyze")

class ExecuteQueryRequest(BaseModel):
    sql_query: str = Field(..., description="The fully validated SQL query to execute")
    db_type: str = Field("postgres", description="Target database type (e.g. postgres, mysql)")
