import { Sparkles, Trash2 } from "lucide-react";

export function QueryInput({ prompt, setPrompt, onGenerate, isLoading }) {
  return (
    <div className="glass-panel rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          Natural Language Prompt
        </h2>
      </div>
      
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Find all users who signed up last month and ordered more than 3 items..."
          className="input-field min-h-[120px] mb-4"
        />
        
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => setPrompt("")}
            className="btn-ghost"
            disabled={isLoading || !prompt}
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
          
          <button 
            onClick={onGenerate}
            className="btn-primary"
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate SQL
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
