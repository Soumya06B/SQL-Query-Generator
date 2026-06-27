from fastapi import APIRouter, HTTPException, Query
from backend.services.db_connector import db_connector

router = APIRouter()

@router.get("/connect")
def test_database_connection(db_type: str = Query("postgres", description="Type of database (postgres, mysql)")):
    """Test connection to the specified target database."""
    try:
        success = db_connector.test_connection(db_type)
        if success:
            return {"status": "success", "message": f"Successfully connected to {db_type}"}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except RuntimeError as re:
        raise HTTPException(status_code=503, detail=str(re))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@router.get("/tables")
def list_database_tables(db_type: str = Query("postgres", description="Type of database (postgres, mysql)")):
    """List all tables in the specified target database."""
    try:
        tables = db_connector.get_tables(db_type)
        return {"tables": tables}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/schema")
def get_database_schema(db_type: str = Query("postgres", description="Type of database (postgres, mysql)")):
    """Get the full schema metadata for the specified target database."""
    try:
        schema = db_connector.get_schema(db_type)
        return {"schema": schema}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
