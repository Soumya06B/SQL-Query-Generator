import { CheckCircle2, ChevronRight, Code2 } from "lucide-react";

export function QueryAlternatives({ alternatives, selectedId, onSelect }) {
  if (!alternatives || alternatives.length === 0) return null;

  return (
    <div className="glass-panel rounded-xl p-6 mb-6">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Code2 className="w-5 h-5 text-indigo-400" />
        Alternative Approaches
      </h3>
      
      <div className="space-y-3">
        {alternatives.map((alt) => {
          const isSelected = alt.id === selectedId;
          
          return (
            <button
              key={alt.id}
              onClick={() => onSelect(alt.id)}
              className={`w-full text-left transition-all duration-200 border rounded-xl p-4 flex gap-4 ${
                isSelected 
                  ? "bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]" 
                  : "bg-gray-900/40 border-gray-800 hover:border-gray-700 hover:bg-gray-800/40"
              }`}
            >
              <div className="pt-1">
                {isSelected ? (
                  <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-600 group-hover:border-gray-500" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-medium ${isSelected ? "text-indigo-300" : "text-gray-300"}`}>
                    {alt.title}
                  </h4>
                  <span className="text-xs font-mono text-gray-500 bg-gray-900 px-2 py-1 rounded">
                    Cost: {alt.cost}
                  </span>
                </div>
                
                <p className="text-sm text-gray-400 mb-3">
                  {alt.description}
                </p>
                
                <div className="bg-[#0d1117] rounded-lg p-3 overflow-x-auto">
                  <pre className="text-gray-300 font-mono text-xs">
                    <code>{alt.sql}</code>
                  </pre>
                </div>
              </div>
              
              <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
