import { Play, Table as TableIcon } from "lucide-react";
import { useState } from "react";

export function QueryExecution({ sql }) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState(null);

  const handleExecute = () => {
    setIsExecuting(true);
    // Mock execution delay
    setTimeout(() => {
      setResults({
        columns: ["user_id", "name", "email", "signup_date", "total_orders"],
        rows: [
          [1042, "Alex Chen", "alex@example.com", "2023-09-12", 5],
          [2091, "Sarah Smith", "sarah.s@example.com", "2023-09-15", 4],
          [3105, "Jordan Lee", "jlee88@example.com", "2023-09-18", 7],
          [4420, "Taylor Swift", "taylor@example.com", "2023-09-21", 3],
          [5199, "Casey Jones", "casey.j@example.com", "2023-09-25", 6],
        ],
        time: "124ms",
        rowCount: 5
      });
      setIsExecuting(false);
    }, 1500);
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
          className="btn-primary bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30"
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
                        {cell}
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
