import { Clock, MessageSquare } from "lucide-react";

export function QueryHistory({ history, onSelect }) {
  if (!history || history.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-6 h-full flex flex-col items-center justify-center text-gray-500">
        <Clock className="w-12 h-12 mb-3 opacity-20" />
        <p>No query history yet</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl p-0 h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-800 bg-gray-900/50">
        <h3 className="font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" />
          History
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {history.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(item)}
            className="w-full text-left p-3 rounded-lg hover:bg-gray-800/50 transition-colors group flex gap-3 items-start"
          >
            <MessageSquare className="w-4 h-4 text-gray-500 mt-1 shrink-0 group-hover:text-purple-400 transition-colors" />
            <div className="overflow-hidden">
              <p className="text-sm text-gray-300 truncate mb-1">
                {item.prompt}
              </p>
              <p className="text-xs text-gray-500 font-mono truncate">
                {item.generated_sql || item.sql}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
