from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import get_settings
from backend.database.connection import engine, Base
from backend.api import generate_sql, explain, impact, validate, execute, history, database

# Create database tables (For dev/sqlite. Use Alembic for prod)
Base.metadata.create_all(bind=engine)

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend architecture for AI SQL Assistant",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Should be restricted in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(database.router, prefix="/api/database", tags=["Database Management"])
app.include_router(generate_sql.router, prefix="/api", tags=["SQL Generation"])
app.include_router(explain.router, prefix="/api", tags=["SQL Explanations"])
app.include_router(impact.router, prefix="/api", tags=["Query Impact"])
app.include_router(validate.router, prefix="/api", tags=["Validation"])
app.include_router(execute.router, prefix="/api", tags=["Execution"])
app.include_router(history.router, prefix="/api", tags=["History"])

@app.get("/")
def read_root():
    return {"message": "AI SQL Assistant API is running."}
