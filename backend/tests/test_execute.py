from sqlalchemy import create_engine
from backend.services.execution_service import execute_sql

def test_execute_sql():
    engine = create_engine("sqlite:///:memory:")
    # Setup test fixture
    with engine.connect() as conn:
        conn.execute(from_sqlalchemy_text("CREATE TABLE test (id int, name varchar)"))
        conn.execute(from_sqlalchemy_text("INSERT INTO test VALUES (1, 'Alice'), (2, 'Bob')"))
        conn.commit()

    columns, rows, time_ms = execute_sql(engine, "SELECT * FROM test", "sqlite")
    
    assert columns == ["id", "name"]
    assert len(rows) == 2
    assert rows[0]["name"] == "Alice"
    assert time_ms >= 0

from sqlalchemy import text as from_sqlalchemy_text
