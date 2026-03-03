import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axiosConfig'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'
import { iconBox } from '../utils/cn'
import { card, text, subtext } from '../utils/cn'
import {
  MdTrendingUp, MdTrendingDown, MdSavings,
  MdAccountBalance, MdAdd, MdEmail,
  MdArrowUpward, MdArrowDownward,
  MdDashboard
} from 'react-icons/md'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie,
  Cell, Legend
} from 'recharts'

const PIE_COLORS = [
  '#3B82F6','#EF4444','#10B981','#F59E0B',
  '#8B5CF6','#EC4899','#06B6D4','#84CC16'
]

function StatCard({ label, value, color, icon: Icon, dark }) {
  return (
    <div className={`${card(dark)} p-5`}>
      <div className="flex items-center justify-between mb-3">
        <p className={`text-sm font-medium ${subtext(dark)}`}>{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color.bg}`}>
          <Icon className={`text-lg ${color.icon}`} />
        </div>
      </div>
      <p className={`text-2xl font-bold ${color.text}`}>
        ₹{Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </p>
    </div>
  )
}

export default function DashboardPage() {
  const { user }    = useAuth()
  const { dark }    = useTheme()
  const [summary, setSummary]           = useState(null)
  const [categoryData, setCategoryData] = useState([])
  const [trendData, setTrendData]       = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [s, c, t] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/dashboard/category-breakdown'),
        api.get('/dashboard/monthly-trend'),
      ])
      setSummary(s.data)
      setCategoryData(c.data)
      setTrendData(t.data)
    } catch {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className={subtext(dark)}>Loading dashboard...</p>
    </div>
  )

  const statCards = [
    { label: 'Monthly Income',   value: summary?.monthlyIncome,
      icon: MdTrendingUp,
      color: { bg: 'bg-green-100', icon: 'text-green-600', text: 'text-green-300' }},
    { label: 'Monthly Expenses', value: summary?.monthlyExpenses,
      icon: MdTrendingDown,
      color: { bg: 'bg-red-100', icon: 'text-red-400', text: 'text-red-400' }},
    { label: 'Monthly Savings',  value: summary?.monthlySavings,
      icon: MdSavings,
      color: {
        bg: Number(summary?.monthlySavings) >= 0 ? 'bg-green-50' : 'bg-red-100',
        icon: Number(summary?.monthlySavings) >= 0 ? 'text-green-300' : 'text-red-400',
        text: Number(summary?.monthlySavings) >= 0 ? 'text-green-300' : 'text-red-400'
      }},
    { label: 'Net Worth',        value: summary?.netWorth,
      icon: MdAccountBalance,
      color: { bg: 'bg-blue-50', icon: 'text-black', text: dark ? 'text-white' : 'text-gray-900' }},
  ]

  const tooltipStyle = {
    backgroundColor: dark ? '#1F2937' : '#fff',
    border: `1px solid ${dark ? '#374151' : '#E5E7EB'}`,
    borderRadius: '8px',
    color: dark ? '#fff' : '#111'
  }

  return (
    <div className="space-y-6">
    {/* Standard page header */}
<div className="mb-6 flex items-center justify-between">
  <div className="flex items-center gap-3">
    <div className={`w-8 h-8 ${iconBox(dark)}`}>
      <MdDashboard className={`text-base ${dark ? 'text-[#555]' : 'text-[#999]'}`} />
    </div>
    <div>
      <h1 className={`text-xl font-bold ${text(dark)}`}>Dashboard</h1>
    </div>
  </div>
  {/* action buttons here */}
</div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${text(dark)}`}>
            Good {getGreeting()}, {user?.name?.split(' ')[0]}
          </h1>
          <p className={`text-sm mt-1 ${subtext(dark)}`}>
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={async () => {
            const now = new Date()
            try {
              await api.post('/dashboard/send-report', null, {
                params: { month: now.getMonth() + 1, year: now.getFullYear() }
              })
              toast.success('Monthly report sent! ')
            } catch { toast.error('Failed to send report') }
          }}
          className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border transition-colors
            ${dark
              ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
              : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
        >
          <MdEmail className="text-base" />
          Email Report
        </button>
      </div>

      {/* New user welcome */}
      {!summary?.monthlyIncome && !summary?.monthlyExpenses && (
        <div className={`rounded-2xl p-5 flex items-start gap-4 border
          ${dark ? 'bg-blue-950 border-blue-900' : 'bg-blue-50 border-blue-100'}`}>
          <MdAdd className="text-blue-600 text-2xl mt-0.5 flex-shrink-0" />
          <div>
            <p className={`font-semibold ${dark ? 'text-blue-300' : 'text-blue-900'}`}>
              Welcome to PocketTrack!
            </p>
            <p className={`text-sm mt-1 ${dark ? 'text-blue-400' : 'text-blue-700'}`}>
              Start by creating an account then add your first transaction.
            </p>
            <div className="flex gap-3 mt-3">
              <Link to="/accounts"
                className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700">
                Create Account
              </Link>
              <Link to="/scan-receipt"
                className={`text-sm border px-3 py-1.5 rounded-lg font-medium
                  ${dark ? 'border-blue-700 text-blue-400' : 'border-blue-300 text-blue-700'}`}>
                Scan Receipt
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(c => (
          <StatCard key={c.label} {...c} dark={dark} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Line Chart */}
        <div className={`${card(dark)} p-5`}>
          <h2 className={`text-base font-semibold mb-4 ${text(dark)}`}>
            Income vs Expenses (6 months)
          </h2>
          {trendData.length === 0 ? (
            <div className={`flex items-center justify-center h-48 text-sm ${subtext(dark)}`}>
              No data yet — add some transactions
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3"
                  stroke={dark ? '#374151' : '#F3F4F6'} />
                <XAxis dataKey="month"
                  tick={{ fontSize: 12, fill: dark ? '#9CA3AF' : '#6B7280' }} />
                <YAxis
                  tick={{ fontSize: 12, fill: dark ? '#9CA3AF' : '#6B7280' }}
                  tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={v => [`₹${Number(v).toLocaleString('en-IN')}`, '']} />
                <Line type="monotone" dataKey="income"
                  stroke="#10B981" strokeWidth={2}
                  dot={{ fill: '#10B981', r: 4 }} name="Income" />
                <Line type="monotone" dataKey="expenses"
                  stroke="#EF4444" strokeWidth={2}
                  dot={{ fill: '#EF4444', r: 4 }} name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div className={`${card(dark)} p-5`}>
          <h2 className={`text-base font-semibold mb-4 ${text(dark)}`}>
            Spending by Category (this month)
          </h2>
          {categoryData.length === 0 ? (
            <div className={`flex items-center justify-center h-48 text-sm ${subtext(dark)}`}>
              No expenses this month yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} dataKey="amount"
                  nameKey="category" cx="50%" cy="50%" outerRadius={80}
                  label={({ category, percent }) =>
                    `${category} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={v => [`₹${Number(v).toLocaleString('en-IN')}`, '']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions dark={dark} />
    </div>
  )
}

function RecentTransactions({ dark }) {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    api.get('/transactions', { params: { page: 0, size: 5 } })
      .then(res => setTransactions(res.data.content))
      .catch(() => {})
  }, [])

  if (transactions.length === 0) return null

  return (
    <div className={`${card(dark)} p-5`}>
      <h2 className={`text-base font-semibold mb-4 ${text(dark)}`}>
        Recent Transactions
      </h2>
      <div className="space-y-3">
        {transactions.map(tx => (
          <div key={tx.id}
            className={`flex items-center justify-between py-2 border-b last:border-0
              ${dark ? 'border-gray-800' : 'border-gray-50'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center
                ${tx.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'}`}>
                {tx.type === 'INCOME'
                  ? <MdArrowDownward className="text-green-600 text-sm" />
                  : <MdArrowUpward className="text-red-600 text-sm" />
                }
              </div>
              <div>
                <p className={`text-sm font-medium ${text(dark)}`}>
                  {tx.description || tx.category}
                </p>
                <p className={`text-xs ${subtext(dark)}`}>
                  {tx.category} · {tx.date}
                </p>
              </div>
            </div>
            <p className={`text-sm font-semibold ${
              tx.type === 'INCOME' ? 'text-green-600' :
              tx.type === 'EXPENSE' ? 'text-red-600' : 'text-blue-600'
            }`}>
              {tx.type === 'INCOME' ? '+' : '-'}
              ₹{Number(tx.amount).toLocaleString('en-IN')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}



// import { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import api from '../api/axiosConfig'
// import { useAuth } from '../context/AuthContext'
// import { useTheme } from '../context/ThemeContext'
// import { card, text, subtext, iconBox } from '../utils/cn'
// import toast from 'react-hot-toast'
// import {
//   MdDashboard, MdEmail, MdArrowUpward, MdArrowDownward,
//   MdAccountBalance, MdAdd, MdTrendingUp, MdTrendingDown,
//   MdSwapHoriz
// } from 'react-icons/md'
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid,
//   Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
// } from 'recharts'

// const PIE_COLORS = ['#3B82F6','#6366F1','#8B5CF6','#A78BFA','#C4B5FD','#DDD6FE','#60A5FA','#93C5FD']

// function StatCard({ label, value, sub, icon: Icon, dark }) {
//   return (
//     <div className={`${card(dark)} p-4`}>
//       <div className="flex items-start justify-between mb-3">
//         <p className={`text-[11px] font-medium uppercase tracking-wider ${dark ? 'text-[#444]' : 'text-[#BBB]'}`}>
//           {label}
//         </p>
//         <div className={`w-7 h-7 ${iconBox(dark)}`}>
//           <Icon className={`text-sm ${dark ? 'text-[#444]' : 'text-[#BBB]'}`} />
//         </div>
//       </div>
//       <p className={`text-xl font-semibold tracking-tight ${text(dark)}`}>
//         ₹{Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
//       </p>
//       {sub && <p className={`text-[11px] mt-1 ${dark ? 'text-[#444]' : 'text-[#BBB]'}`}>{sub}</p>}
//     </div>
//   )
// }

// function RecentTx({ tx, dark }) {
//   const Icon = tx.type === 'INCOME' ? MdArrowDownward
//              : tx.type === 'EXPENSE' ? MdArrowUpward : MdSwapHoriz

//   const sign = tx.type === 'INCOME' ? '+' : tx.type === 'EXPENSE' ? '−' : ''

//   return (
//     <div className={`flex items-center gap-3 py-2.5 border-b last:border-0 ${dark ? 'border-[#1A1A1A]' : 'border-[#F5F5F5]'}`}>
//       <div className={`w-7 h-7 flex-shrink-0 ${iconBox(dark)}`}>
//         <Icon className={`text-sm ${dark ? 'text-[#444]' : 'text-[#BBB]'}`} />
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className={`text-[13px] font-medium truncate ${text(dark)}`}>
//           {tx.description || tx.category}
//         </p>
//         <p className={`text-[11px] ${dark ? 'text-[#444]' : 'text-[#BBB]'}`}>
//           {tx.category} · {tx.date}
//         </p>
//       </div>
//       <p className={`text-[13px] font-medium flex-shrink-0 ${text(dark)}`}>
//         {sign}₹{Number(tx.amount).toLocaleString('en-IN')}
//       </p>
//     </div>
//   )
// }

// export default function DashboardPage() {
//   const { user }   = useAuth()
//   const { dark }   = useTheme()
//   const [summary, setSummary]         = useState(null)
//   const [categoryData, setCategoryData] = useState([])
//   const [trendData, setTrendData]     = useState([])
//   const [recentTx, setRecentTx]       = useState([])
//   const [loading, setLoading]         = useState(true)

//   useEffect(() => { fetchAll() }, [])

//   const fetchAll = async () => {
//     try {
//       const [s, c, t, tx] = await Promise.all([
//         api.get('/dashboard/summary'),
//         api.get('/dashboard/category-breakdown'),
//         api.get('/dashboard/monthly-trend'),
//         api.get('/transactions', { params: { page: 0, size: 6 } }),
//       ])
//       setSummary(s.data)
//       setCategoryData(c.data)
//       setTrendData(t.data)
//       setRecentTx(tx.data.content || [])
//     } catch { toast.error('Failed to load dashboard') }
//     finally  { setLoading(false) }
//   }

//   const sendReport = async () => {
//     const now = new Date()
//     try {
//       await api.post('/dashboard/send-report', null, {
//         params: { month: now.getMonth() + 1, year: now.getFullYear() }
//       })
//       toast.success('Monthly report sent!')
//     } catch { toast.error('Failed to send report') }
//   }

//   if (loading) return (
//     <div className="flex items-center justify-center h-64">
//       <p className={`text-sm ${dark ? 'text-[#444]' : 'text-[#CCC]'}`}>Loading...</p>
//     </div>
//   )

//   const savings = Number(summary?.monthlySavings || 0)
//   const tooltipStyle = {
//     backgroundColor: dark ? '#141414' : '#fff',
//     border: `1px solid ${dark ? '#262626' : '#E5E5E5'}`,
//     borderRadius: '8px', fontSize: '12px',
//     color: dark ? '#FAFAFA' : '#111',
//   }

//   return (
//     <div className="space-y-5">

//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className={`w-8 h-8 ${iconBox(dark)}`}>
//             <MdDashboard className={`text-[15px] ${dark ? 'text-[#444]' : 'text-[#BBB]'}`} />
//           </div>
//           <div>
//             <h1 className={`text-[15px] font-semibold leading-none ${text(dark)}`}>
//               {getGreeting()}, {user?.name?.split(' ')[0]}
//             </h1>
//             <p className={`text-[11px] mt-0.5 ${dark ? 'text-[#444]' : 'text-[#BBB]'}`}>
//               {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
//             </p>
//           </div>
//         </div>
//         <button onClick={sendReport}
//           className={`flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors
//             ${dark ? 'border-[#262626] text-[#555] hover:bg-[#141414] hover:text-[#888]'
//                    : 'border-[#E5E5E5] text-[#BBB] hover:bg-[#F5F5F5] hover:text-[#666]'}`}>
//           <MdEmail className="text-sm" /> Email Report
//         </button>
//       </div>

//       {/* Welcome state */}
//       {!summary?.monthlyIncome && !summary?.monthlyExpenses && (
//         <div className={`rounded-xl border p-4 ${card(dark)}`}>
//           <div className="flex items-start gap-3">
//             <div className={`w-7 h-7 flex-shrink-0 ${iconBox(dark)}`}>
//               <MdAdd className={`text-sm ${dark ? 'text-[#444]' : 'text-[#BBB]'}`} />
//             </div>
//             <div>
//               <p className={`text-[13px] font-semibold ${text(dark)}`}>Welcome to FinanceVUE</p>
//               <p className={`text-[12px] mt-0.5 ${dark ? 'text-[#444]' : 'text-[#BBB]'}`}>
//                 Create an account and add your first transaction to get started.
//               </p>
//               <div className="flex gap-2 mt-2.5">
//                 <Link to="/accounts"
//                   className={`text-[12px] font-medium px-2.5 py-1 rounded-md transition-colors
//                     ${dark ? 'bg-white text-[#111] hover:bg-[#F0F0F0]' : 'bg-[#111] text-white hover:bg-[#222]'}`}>
//                   Create Account
//                 </Link>
//                 <Link to="/scan-receipt"
//                   className={`text-[12px] font-medium px-2.5 py-1 rounded-md border transition-colors
//                     ${dark ? 'border-[#262626] text-[#555] hover:bg-[#141414]'
//                            : 'border-[#E5E5E5] text-[#888] hover:bg-[#F5F5F5]'}`}>
//                   Scan Receipt
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Stat Cards */}
//       <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
//         <StatCard label="Income"   value={summary?.monthlyIncome}   icon={MdArrowDownward} dark={dark}
//           sub="This month" />
//         <StatCard label="Expenses" value={summary?.monthlyExpenses} icon={MdArrowUpward}   dark={dark}
//           sub="This month" />
//         <StatCard label="Saved"    value={Math.abs(savings)}        icon={savings >= 0 ? MdTrendingUp : MdTrendingDown} dark={dark}
//           sub={savings < 0 ? 'Overspent this month' : 'Net savings'} />
//         <StatCard label="Net Worth" value={summary?.netWorth}       icon={MdAccountBalance} dark={dark}
//           sub="All accounts" />
//       </div>

//       {/* Charts row */}
//       <div className="grid grid-cols-1 xl:grid-cols-5 gap-3">

//         {/* Trend — wider */}
//         <div className={`${card(dark)} p-4 xl:col-span-3`}>
//           <p className={`text-[12px] font-semibold mb-4 ${dark ? 'text-[#555]' : 'text-[#AAA]'}`}>
//             INCOME VS EXPENSES — 6 months
//           </p>
//           {trendData.length === 0 ? (
//             <div className={`flex items-center justify-center h-40 text-[12px] ${dark ? 'text-[#333]' : 'text-[#CCC]'}`}>
//               No data yet
//             </div>
//           ) : (
//             <ResponsiveContainer width="100%" height={200}>
//               <LineChart data={trendData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1A1A1A' : '#F0F0F0'} />
//                 <XAxis dataKey="month" tick={{ fontSize: 11, fill: dark ? '#444' : '#CCC' }} axisLine={false} tickLine={false} />
//                 <YAxis tick={{ fontSize: 11, fill: dark ? '#444' : '#CCC' }} axisLine={false} tickLine={false}
//                   tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
//                 <Tooltip contentStyle={tooltipStyle}
//                   formatter={v => [`₹${Number(v).toLocaleString('en-IN')}`, '']} />
//                 <Line type="monotone" dataKey="income"   stroke={dark ? '#4A8FFF' : '#3B82F6'} strokeWidth={1.5}
//                   dot={{ r: 3, fill: dark ? '#4A8FFF' : '#3B82F6' }} name="Income" />
//                 <Line type="monotone" dataKey="expenses" stroke={dark ? '#555' : '#CCC'} strokeWidth={1.5}
//                   dot={{ r: 3, fill: dark ? '#555' : '#CCC' }} name="Expenses" />
//               </LineChart>
//             </ResponsiveContainer>
//           )}
//         </div>

//         {/* Pie — narrower */}
//         <div className={`${card(dark)} p-4 xl:col-span-2`}>
//           <p className={`text-[12px] font-semibold mb-4 ${dark ? 'text-[#555]' : 'text-[#AAA]'}`}>
//             SPENDING BREAKDOWN
//           </p>
//           {categoryData.length === 0 ? (
//             <div className={`flex items-center justify-center h-40 text-[12px] ${dark ? 'text-[#333]' : 'text-[#CCC]'}`}>
//               No expenses this month
//             </div>
//           ) : (
//             <ResponsiveContainer width="100%" height={200}>
//               <PieChart>
//                 <Pie data={categoryData} dataKey="amount" nameKey="category"
//                   cx="50%" cy="50%" outerRadius={70} innerRadius={35}>
//                   {categoryData.map((_, i) => (
//                     <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip contentStyle={tooltipStyle}
//                   formatter={v => [`₹${Number(v).toLocaleString('en-IN')}`, '']} />
//                 <Legend iconSize={8} iconType="circle"
//                   formatter={v => <span style={{ fontSize: 11, color: dark ? '#555' : '#AAA' }}>{v}</span>} />
//               </PieChart>
//             </ResponsiveContainer>
//           )}
//         </div>
//       </div>

//       {/* Recent Transactions */}
//       {recentTx.length > 0 && (
//         <div className={`${card(dark)} p-4`}>
//           <div className="flex items-center justify-between mb-3">
//             <p className={`text-[12px] font-semibold ${dark ? 'text-[#555]' : 'text-[#AAA]'}`}>
//               RECENT TRANSACTIONS
//             </p>
//             <Link to="/transactions"
//               className={`text-[11px] transition-colors ${dark ? 'text-[#444] hover:text-[#888]' : 'text-[#CCC] hover:text-[#666]'}`}>
//               View all →
//             </Link>
//           </div>
//           {recentTx.map(tx => <RecentTx key={tx.id} tx={tx} dark={dark} />)}
//         </div>
//       )}
//     </div>
//   )
// }

// function getGreeting() {
//   const h = new Date().getHours()
//   return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
// }