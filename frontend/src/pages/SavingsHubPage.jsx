// import { useState, useEffect } from 'react';
// import api from '../api/axiosConfig';
// import { useTheme } from '../context/ThemeContext';
// import { card, text, subtext } from '../utils/cn';
// import { MdTrendingDown, MdTrendingUp, MdSavings, MdOutlineShield } from 'react-icons/md';

// export default function SavingsHubPage() {
//   const { dark } = useTheme();
//   const [anomalies, setAnomalies] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.get('/dashboard/anomalies')
//       .then(res => setAnomalies(res.data))
//       .finally(() => setLoading(false));
//   }, []);

//   // Calculate Total Saved based on Drops
//   const totalSaved = anomalies
//     .filter(a => a.type === 'DROP')
//     .reduce((acc, curr) => acc + (curr.oldPrice - curr.newPrice), 0);

//   if (loading) return <div className="p-10 text-center">Scanning database...</div>;

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       <div className="flex items-center gap-3 mb-6">
//         <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-500 flex items-center justify-center text-2xl">
//           <MdOutlineShield />
//         </div>
//         <div>
//           <h1 className={`text-2xl font-bold ${text(dark)}`}>Subscription Sentinel Hub</h1>
//           <p className={`text-sm ${subtext(dark)}`}>Autonomous anomaly detection history.</p>
//         </div>
//       </div>

//       {/* Metric Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div className={`${card(dark)} p-6 border-l-4 border-l-teal-500`}>
//           <p className={`text-sm font-bold uppercase ${subtext(dark)} mb-1`}><MdSavings className="inline mr-1"/> Total Saved This Year</p>
//           <p className="text-3xl font-black text-teal-500">₹{totalSaved.toFixed(2)}</p>
//         </div>
//         <div className={`${card(dark)} p-6 border-l-4 border-l-blue-500`}>
//           <p className={`text-sm font-bold uppercase ${subtext(dark)} mb-1`}>Anomalies Detected</p>
//           <p className={`text-3xl font-black ${text(dark)}`}>{anomalies.length}</p>
//         </div>
//       </div>

//       {/* Historical List */}
//       <div className={`${card(dark)} p-6 mt-6`}>
//         <h2 className={`text-sm font-bold uppercase tracking-wider mb-4 ${subtext(dark)}`}>Detection Ledger</h2>
//         {anomalies.length === 0 ? (
//           <p className={subtext(dark)}>No anomalies have been recorded yet.</p>
//         ) : (
//           <div className="space-y-3">
//             {anomalies.map((anomaly, idx) => {
//               const isDrop = anomaly.type === 'DROP';
//               return (
//                 <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between ${dark ? 'bg-[#141414] border-[#2A2A2A]' : 'bg-gray-50 border-gray-100'}`}>
//                   <div>
//                     <h3 className={`font-bold ${text(dark)}`}>{anomaly.merchant}</h3>
//                     <p className={`text-xs ${subtext(dark)}`}>Detected on: {new Date(anomaly.detectedDate).toLocaleDateString()}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className={`text-sm font-bold flex items-center gap-1 ${isDrop ? 'text-teal-500' : 'text-red-500'}`}>
//                       {isDrop ? <MdTrendingDown /> : <MdTrendingUp />} 
//                       ₹{anomaly.newPrice} <span className={`text-xs line-through ml-2 ${subtext(dark)}`}>₹{anomaly.oldPrice}</span>
//                     </p>
//                     <p className={`text-xs font-semibold ${isDrop ? 'text-teal-600' : 'text-red-600'}`}>{isDrop ? 'PRICE DROP' : 'STEALTH HIKE'}</p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useTheme } from '../context/ThemeContext';
import { card, text, subtext } from '../utils/cn';
import { MdTrendingDown, MdTrendingUp, MdSavings, MdOutlineShield, MdWarning } from 'react-icons/md';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SavingsHubPage() {
  const { dark } = useTheme();
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch the data
    api.get('/dashboard/anomalies')
      .then(res => {
        setAnomalies(res.data);
        // 2. The second the data loads, tell the backend to clear the red notification bell!
        if (res.data.some(a => !a.read)) {
            api.put('/dashboard/anomalies/mark-read').catch(err => console.error("Failed to mark read", err));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // --- Data Calculations for Analytics ---
  const totalSaved = anomalies
    .filter(a => a.type === 'DROP')
    .reduce((acc, curr) => acc + (curr.oldPrice - curr.newPrice), 0);

  const totalHikes = anomalies
    .filter(a => a.type === 'HIKE')
    .reduce((acc, curr) => acc + (curr.newPrice - curr.oldPrice), 0);

  // Group data by Month for the Bar Chart
  // const processChartData = () => {
  //   const monthlyData = {};
    
  //   anomalies.forEach(anomaly => {
  //       const date = new Date(anomaly.dateDetected);
  //       const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' }); // e.g., "May 24"
        
  //       if (!monthlyData[monthYear]) {
  //           monthlyData[monthYear] = { name: monthYear, Saved: 0, Hiked: 0 };
  //       }
        
  //       if (anomaly.type === 'DROP') {
  //           monthlyData[monthYear].Saved += (anomaly.oldPrice - anomaly.newPrice);
  //       } else {
  //           monthlyData[monthYear].Hiked += (anomaly.newPrice - anomaly.oldPrice);
  //       }
  //   });

  //   // Convert object to array and reverse so oldest is on the left, newest on the right
  //   return Object.values(monthlyData).reverse();
  // };
  // Group data by Month for the Bar Chart
  const processChartData = () => {
    const monthlyData = {};
    
    anomalies.forEach(anomaly => {
        
        // ---> THE INDESTRUCTIBLE DATE PARSER <---
        let date;
        const rawDate = anomaly.detectedDate; 
        
        if (Array.isArray(rawDate)) {
            // If Java sends a weird array: [2026, 6, 24]
            date = new Date(rawDate[0], rawDate[1] - 1, rawDate[2]);
        } else if (typeof rawDate === 'string') {
            // If Java sends a normal string: "2026-06-24"
            date = new Date(rawDate);
        } else {
            // Fallback for missing dates
            date = new Date(); 
        }
        
        const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' }); 
        
        if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = { name: monthYear, Saved: 0, Hiked: 0 };
        }
        
        if (anomaly.type === 'DROP') {
            monthlyData[monthYear].Saved += (anomaly.oldPrice - anomaly.newPrice);
        } else {
            monthlyData[monthYear].Hiked += (anomaly.newPrice - anomaly.oldPrice);
        }
    });

    return Object.values(monthlyData).reverse();
  };

  const chartData = processChartData();

  if (loading) return <div className={`p-10 text-center font-bold animate-pulse ${text(dark)}`}>Scanning Sentinel Database...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center text-3xl shadow-lg shadow-teal-500/30">
          <MdOutlineShield />
        </div>
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${text(dark)}`}>Sentinel Hub</h1>
          <p className={`text-sm font-medium ${subtext(dark)}`}>Your autonomous AI price monitor</p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${card(dark)} p-6 border-b-4 border-b-teal-500 relative overflow-hidden`}>
          <MdSavings className="absolute -right-4 -bottom-4 text-8xl opacity-5 text-teal-500" />
          <p className={`text-xs font-bold uppercase tracking-wider ${subtext(dark)} mb-1`}>Total Money Saved</p>
          <p className="text-4xl font-black text-teal-500">₹{totalSaved.toFixed(2)}</p>
        </div>
        
        <div className={`${card(dark)} p-6 border-b-4 border-b-red-500 relative overflow-hidden`}>
          <MdWarning className="absolute -right-4 -bottom-4 text-8xl opacity-5 text-red-500" />
          <p className={`text-xs font-bold uppercase tracking-wider ${subtext(dark)} mb-1`}>Stealth Hikes Detected</p>
          <p className="text-4xl font-black text-red-500">₹{totalHikes.toFixed(2)}</p>
        </div>

        <div className={`${card(dark)} p-6 border-b-4 border-b-blue-500`}>
          <p className={`text-xs font-bold uppercase tracking-wider ${subtext(dark)} mb-1`}>Active Alerts</p>
          <p className={`text-4xl font-black ${text(dark)}`}>{anomalies.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
        {/* Visual Analytics Chart */}
        <div className={`lg:col-span-2 ${card(dark)} p-6`}>
            <h2 className={`text-sm font-bold uppercase tracking-wider mb-6 ${subtext(dark)}`}>Monthly Analytics</h2>
            {chartData.length === 0 ? (
                <div className={`h-64 flex items-center justify-center ${subtext(dark)}`}>Not enough data to graph yet.</div>
            ) : (
                <div className="w-full h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#333' : '#eee'} vertical={false} />
                            <XAxis dataKey="name" stroke={dark ? '#888' : '#aaa'} fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke={dark ? '#888' : '#aaa'} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                            <Tooltip 
                                cursor={{ fill: dark ? '#222' : '#f5f5f5' }}
                                contentStyle={{ backgroundColor: dark ? '#1A1A1A' : '#fff', border: dark ? '1px solid #333' : 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                            <Bar dataKey="Saved" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            <Bar dataKey="Hiked" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>

        {/* Historical Ledger List */}
        <div className={`${card(dark)} p-6 flex flex-col`}>
          <h2 className={`text-sm font-bold uppercase tracking-wider mb-4 ${subtext(dark)}`}>Detection Ledger</h2>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 max-h-[300px]">
            {anomalies.length === 0 ? (
              <p className={`text-center py-10 ${subtext(dark)}`}>No anomalies recorded.</p>
            ) : (
              anomalies.map((anomaly, idx) => {
                const isDrop = anomaly.type === 'DROP';
                return (
                  <div key={idx} className={`p-4 rounded-xl border transition-all hover:shadow-md flex items-center justify-between ${dark ? 'bg-[#141414] border-[#2A2A2A] hover:border-gray-700' : 'bg-gray-50 border-gray-100 hover:border-gray-300'}`}>
                    <div>
                      <h3 className={`font-bold text-sm ${text(dark)}`}>{anomaly.merchant}</h3>
                      <p className={`text-[10px] uppercase font-bold mt-1 ${isDrop ? 'text-teal-500' : 'text-red-500'}`}>
                        {isDrop ? 'PRICE DROP' : 'STEALTH HIKE'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold flex items-center justify-end gap-1 ${isDrop ? 'text-teal-500' : 'text-red-500'}`}>
                        {isDrop ? <MdTrendingDown /> : <MdTrendingUp />} 
                        ₹{anomaly.newPrice} 
                      </p>
                      <p className={`text-xs line-through mt-0.5 ${subtext(dark)}`}>₹{anomaly.oldPrice}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}