import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Activity, CheckCircle2, AlertCircle, 
  Clock, Database, ArrowRight, Server, Zap
} from 'lucide-react';

const statsData = [
  { title: "Total Queries", value: "24,593", change: "+12.5%", isPositive: true, icon: Database, color: "text-blue-400", bg: "bg-blue-500/10" },
  { title: "Queries Executed", value: "18,241", change: "+8.2%", isPositive: true, icon: Activity, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { title: "Avg Response Time", value: "245ms", change: "-14ms", isPositive: true, icon: Clock, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { title: "Optimizations", value: "1,204", change: "+3.1%", isPositive: true, icon: Zap, color: "text-purple-400", bg: "bg-purple-500/10" },
];

const dailyActivityData = [
  { name: 'Mon', queries: 4000, optimized: 2400 },
  { name: 'Tue', queries: 3000, optimized: 1398 },
  { name: 'Wed', queries: 2000, optimized: 9800 },
  { name: 'Thu', queries: 2780, optimized: 3908 },
  { name: 'Fri', queries: 1890, optimized: 4800 },
  { name: 'Sat', queries: 2390, optimized: 3800 },
  { name: 'Sun', queries: 3490, optimized: 4300 },
];

const queryTypeData = [
  { name: 'SELECT', value: 65 },
  { name: 'INSERT', value: 15 },
  { name: 'UPDATE', value: 12 },
  { name: 'DELETE', value: 8 },
];

const recentActivity = [
  { id: 1, type: "optimization", message: "Query optimized automatically saving 45ms", time: "2 mins ago", icon: Zap, color: "text-yellow-400" },
  { id: 2, type: "execution", message: "Large analytical query completed successfully", time: "15 mins ago", icon: CheckCircle2, color: "text-emerald-400" },
  { id: 3, type: "error", message: "Failed to parse syntax near 'GROUP BY'", time: "1 hour ago", icon: AlertCircle, color: "text-red-400" },
  { id: 4, type: "system", message: "Database schema synced successfully", time: "3 hours ago", icon: Server, color: "text-blue-400" },
];

const recentQueries = [
  { id: "q-1", user: "Sarah Jenkins", sql: "SELECT * FROM users WHERE active = true", duration: "120ms", status: "success", date: "Today, 10:23 AM" },
  { id: "q-2", user: "Mike Ross", sql: "UPDATE inventory SET stock = stock - 1", duration: "45ms", status: "success", date: "Today, 09:45 AM" },
  { id: "q-3", user: "System Worker", sql: "DELETE FROM sessions WHERE expires_at < NOW()", duration: "890ms", status: "success", date: "Today, 04:00 AM" },
  { id: "q-4", user: "Alex Chen", sql: "SELECT u.id, SUM(o.total) FROM users u JOIN...", duration: "3.2s", status: "warning", date: "Yesterday, 14:20 PM" },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`text-xs font-semibold flex items-center gap-1 ${stat.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stat.change}
                  <TrendingUp className="w-3 h-3" />
                </span>
              </div>
              <div>
                <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-100 mt-1">{stat.value}</p>
              </div>
              <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon className="w-24 h-24" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-gray-800">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              Daily Query Activity
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
                  <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1d24', borderColor: '#374151', borderRadius: '0.5rem', color: '#f3f4f6' }}
                    itemStyle={{ color: '#e5e7eb' }}
                  />
                  <Area type="monotone" dataKey="queries" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorQueries)" />
                  <Area type="monotone" dataKey="optimized" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorOptimized)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Queries Table */}
          <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/30">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                Recent Queries
              </h3>
              <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">User</th>
                    <th className="p-4 font-semibold">Query Snippet</th>
                    <th className="p-4 font-semibold">Duration</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {recentQueries.map((query) => (
                    <tr key={query.id} className="hover:bg-gray-800/20 transition-colors group">
                      <td className="p-4 text-sm font-medium text-gray-200">{query.user}</td>
                      <td className="p-4 text-sm font-mono text-gray-400 truncate max-w-[200px]">{query.sql}</td>
                      <td className="p-4 text-sm text-gray-300">{query.duration}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          query.status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}>
                          {query.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">{query.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (Activity & Chart) */}
        <div className="space-y-6">
          
          {/* Query Types Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800">
            <h3 className="text-lg font-semibold mb-6">Query Distribution</h3>
            <div className="h-[200px] w-full flex items-end justify-between gap-2 px-2">
               {queryTypeData.map((item, index) => (
                  <div key={item.name} className="flex flex-col items-center gap-2 flex-1 group">
                    <div className="w-full bg-gray-800 rounded-t-sm flex items-end justify-center relative overflow-hidden" style={{ height: '140px' }}>
                       <div 
                         className="w-full rounded-t-sm transition-all duration-700 ease-out group-hover:brightness-110 group-hover:opacity-100 opacity-90"
                         style={{ 
                           height: `${item.value}%`, 
                           background: `linear-gradient(to top, var(--color-background), ${
                             index === 0 ? '#6366f1' : index === 1 ? '#8b5cf6' : index === 2 ? '#10b981' : '#f59e0b'
                           })` 
                         }}
                       ></div>
                       <span className="absolute bottom-2 text-xs font-bold text-white drop-shadow-md">{item.value}%</span>
                    </div>
                    <span className="text-xs font-medium text-gray-400">{item.name}</span>
                  </div>
               ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800">
            <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {recentActivity.map((activity, i) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex gap-4 relative">
                    {i !== recentActivity.length - 1 && (
                      <span className="absolute left-4 top-10 bottom-[-24px] w-[1px] bg-gray-800"></span>
                    )}
                    <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-200">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
