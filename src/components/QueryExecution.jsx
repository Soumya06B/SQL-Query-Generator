import { Play, Table as TableIcon, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../services/api";

export function QueryExecution({ sql, dbType = 'postgres' }) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset execution state if the active SQL query changes (like clicking an alternative)
    setResults(null);
    setError(null);
  }, [sql]);

  const handleExecute = async () => {
    setIsExecuting(true);
    setError(null);
    setResults(null);
    try {
      const response = await api.executeQuery(sql, dbType);
      
      if (response.status === 'success') {
        setResults({
          columns: response.columns,
          // Backend returns rows as array of objects, map to array of arrays for rendering
          rows: response.rows.map(rowObj => response.columns.map(col => rowObj[col])),
          time: `${response.execution_time_ms.toFixed(2)}ms`,
          rowCount: response.rows.length
        });
      } else {
        setError(response.error || "Query execution failed.");
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "An unexpected error occurred.");
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="glass-panel rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Play className="w-5 h-5 text-emerald-400" />
          Execution Engine
        </h3>
        <button
          onClick={handleExecute}
          disabled={isExecuting || !sql}
          className="btn-primary bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExecuting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Running Query...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Execute Query
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold mb-1">Execution Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {results && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <TableIcon className="w-4 h-4" />
              Results ({results.rowCount} rows)
            </span>
            <span>Execution time: {results.time}</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900/80 border-b border-gray-800">
                  {results.columns.map((col, idx) => (
                    <th key={idx} className="p-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-gray-900/30">
                {results.rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-gray-800/50 transition-colors">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="p-3 text-sm text-gray-300 whitespace-nowrap">
                        {cell !== null && cell !== undefined ? String(cell) : <span className="text-gray-500 italic">null</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
