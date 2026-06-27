import { Check, Copy, Database, Info, Lightbulb, Zap, CheckCircle2, AlertTriangle } from "lucide-react";
import { useState } from "react";

export function QueryResults({ result }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900/80 border-b border-gray-800">
          <h3 className="font-mono text-sm text-indigo-400 flex items-center gap-2">
            <Database className="w-4 h-4" />
            Generated SQL
          </h3>
          <button 
            onClick={handleCopy}
            className="text-gray-400 hover:text-white transition-colors p-1.5 rounded hover:bg-gray-800"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <div className="p-4 bg-[#0d1117] overflow-x-auto">
          <pre className="text-gray-300 font-mono text-sm leading-relaxed">
            <code>{result.sql}</code>
          </pre>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-xl p-5">
          <h4 className="flex items-center gap-2 text-gray-200 font-semibold mb-3">
            <Info className="w-4 h-4 text-blue-400" />
            Query Explanation
          </h4>
          <p className="text-gray-400 text-sm leading-relaxed">
            {result.explanation}
          </p>
        </div>

        <div className="glass-panel rounded-xl p-5">
          <h4 className="flex items-center gap-2 text-gray-200 font-semibold mb-3">
            <Database className="w-4 h-4 text-purple-400" />
            Tables Involved
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.tables.map((table, idx) => (
              <span key={idx} className="px-3 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full text-xs font-mono">
                {table}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-xl p-5">
          <h4 className="flex items-center gap-2 text-gray-200 font-semibold mb-3">
            <Zap className="w-4 h-4 text-amber-400" />
            Impact Analysis
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Estimated Cost:</span>
              <span className="text-amber-300 font-mono">{result.impact.cost}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Rows Examined:</span>
              <span className="text-gray-200 font-mono">~{result.impact.rows}</span>
            </div>
            <div className="mt-3 p-3 bg-gray-900/50 rounded-lg text-xs text-gray-400">
              {result.impact.description}
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-5">
          <h4 className="flex items-center gap-2 text-gray-200 font-semibold mb-3">
            <Lightbulb className="w-4 h-4 text-emerald-400" />
            Optimization Suggestions
          </h4>
          <ul className="space-y-2">
            {result.optimizations.map((opt, idx) => (
              <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span>{opt}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="glass-panel rounded-xl p-5 md:col-span-2">
          <h4 className="flex items-center gap-2 text-gray-200 font-semibold mb-3">
            {result.validation?.is_valid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            )}
            Validation Results
          </h4>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <span className="text-gray-400 mr-2">Status:</span>
              {result.validation?.is_valid ? (
                <span className="text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded">Valid Query</span>
              ) : (
                <span className="text-red-400 font-medium bg-red-500/10 px-2 py-0.5 rounded">Invalid Query</span>
              )}
            </div>
            {!result.validation?.is_valid && result.validation?.errors?.length > 0 && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
                <ul className="list-disc list-inside space-y-1">
                  {result.validation.errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
