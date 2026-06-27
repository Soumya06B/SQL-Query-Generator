import { Database, Table, Key, Type, ChevronRight, Search } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../services/api";

export function SchemaExplorer({ dbType = 'postgres' }) {
  const [schemas, setSchemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTable, setExpandedTable] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        setLoading(true);
        const data = await api.getDatabaseSchema(dbType);
        
        // Transform the backend { schema: { "table_name": { columns: [], foreign_keys: [] } } } format
        // into the format expected by our UI: { name: "database_name", tables: [ { name, columns: [] } ] }
        const backendSchema = data.schema || {};
        const tables = Object.keys(backendSchema).map(tableName => {
          const tableInfo = backendSchema[tableName];
          
          const fkColumns = new Set();
          if (tableInfo.foreign_keys) {
            tableInfo.foreign_keys.forEach(fk => {
              fk.constrained_columns.forEach(col => fkColumns.add(col));
            });
          }

          return {
            name: tableName,
            rows: "N/A",
            size: "N/A",
            columns: tableInfo.columns.map(c => ({
              name: c.name,
              type: c.type,
              isPrimary: c.primary_key,
              isForeign: fkColumns.has(c.name)
            }))
          };
        });

        setSchemas([{
          name: "postgres", // Just a display name
          tables: tables
        }]);

        if (tables.length > 0) {
          setExpandedTable(tables[0].name);
        }
      } catch (err) {
        console.error("Failed to load schema:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchema();
  }, [dbType]);

  return (
    <div className="flex gap-6 h-full">
      {/* Sidebar for Schemas & Tables */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text"
            placeholder="Search tables..."
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto glass-panel rounded-xl p-4 border border-gray-800 space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
          ) : schemas.map((schema) => (
            <div key={schema.name} className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                <Database className="w-4 h-4 text-indigo-400" />
                {schema.name}
              </div>
              <div className="space-y-1 pl-2 border-l border-gray-800 ml-2">
                {schema.tables
                  .filter(t => t.name.includes(searchQuery.toLowerCase()))
                  .map((table) => (
                  <button
                    key={table.name}
                    onClick={() => setExpandedTable(table.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                      expandedTable === table.name
                        ? "bg-indigo-500/10 text-indigo-300 font-medium"
                        : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Table className="w-4 h-4" />
                      {table.name}
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${expandedTable === table.name ? "rotate-90 text-indigo-400" : ""}`} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Area for Columns */}
      <div className="flex-1 glass-panel rounded-xl border border-gray-800 p-6 flex flex-col">
        {expandedTable ? (() => {
          const table = schemas.flatMap(s => s.tables).find(t => t.name === expandedTable);
          if(!table) return null;
          
          return (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Table className="w-8 h-8 text-indigo-400" />
                    {table.name}
                  </h2>
                  <p className="text-gray-400 mt-2 text-sm flex items-center gap-4">
                    <span>Rows: <strong className="text-gray-200">{table.rows}</strong></span>
                    <span>Size: <strong className="text-gray-200">{table.size}</strong></span>
                  </p>
                </div>
                <button className="btn-secondary text-sm">
                  Query this table
                </button>
              </div>

              <div className="border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold w-1/3">Column Name</th>
                      <th className="p-4 font-semibold w-1/3">Type</th>
                      <th className="p-4 font-semibold w-1/3">Constraints</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {table.columns.map((col) => (
                      <tr key={col.name} className="hover:bg-gray-800/30 transition-colors group">
                        <td className="p-4 text-sm font-medium text-gray-200 flex items-center gap-2">
                          {col.isPrimary ? (
                            <Key className="w-4 h-4 text-yellow-500" />
                          ) : (
                            <Type className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                          )}
                          {col.name}
                        </td>
                        <td className="p-4 text-sm font-mono text-indigo-300/80">
                          {col.type}
                        </td>
                        <td className="p-4 text-sm">
                          <div className="flex gap-2">
                            {col.isPrimary && (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                PRIMARY KEY
                              </span>
                            )}
                            {col.isForeign && (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                FOREIGN KEY
                              </span>
                            )}
                            {!col.isPrimary && !col.isForeign && (
                              <span className="text-gray-600 italic">-</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })() : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a table to view its schema
          </div>
        )}
      </div>
    </div>
  );
}
