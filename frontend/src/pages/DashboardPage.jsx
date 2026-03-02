// import { useState, useEffect } from 'react'
// import api from '../api/axiosConfig'
// import { useAuth } from '../context/AuthContext'
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid,
//   Tooltip, ResponsiveContainer, PieChart, Pie,
//   Cell, Legend
// } from 'recharts'
// import toast from 'react-hot-toast'
// const PIE_COLORS = [
//   '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
//   '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
// ]

// function StatCard({ label, value, color, icon }) {
//   return (
//     <div className="bg-white rounded-2xl border border-gray-200 p-5">
//       <div className="flex items-center justify-between mb-3">
//         <p className="text-sm text-gray-500 font-medium">{label}</p>
//         <span className="text-xl">{icon}</span>
//       </div>
//       <p className={`text-2xl font-bold ${color}`}>
//         ₹{Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//       </p>
//     </div>
//   )
// }

// export default function DashboardPage() {
//   const { user }                          = useAuth()
//   const [summary, setSummary]             = useState(null)
//   const [categoryData, setCategoryData]   = useState([])
//   const [trendData, setTrendData]         = useState([])
//   const [loading, setLoading]             = useState(true)

//   useEffect(() => {
//     fetchAll()
//   }, [])

//   const fetchAll = async () => {
//     try {
//       const [summaryRes, categoryRes, trendRes] = await Promise.all([
//         api.get('/dashboard/summary'),
//         api.get('/dashboard/category-breakdown'),
//         api.get('/dashboard/monthly-trend'),
//       ])
//       setSummary(summaryRes.data)
//       setCategoryData(categoryRes.data)
//       setTrendData(trendRes.data)
//     } catch (err) {
//       console.error('Dashboard error:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (loading) return (
//     <div className="flex items-center justify-center h-64">
//       <p className="text-gray-400">Loading dashboard...</p>
//     </div>
//   )

//   return (
//     <div className="space-y-6">

//       {/* Welcome */}
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">
//           Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
//         </h1>
//         <p className="text-sm text-gray-500 mt-1">
//           Here's your financial summary for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
//         </p>
//   <button
//    onClick={async () => {
//     const now = new Date()
//     try {
//         await api.post('/dashboard/send-report', null, {
//             params: {
//                 month: now.getMonth() + 1,
//                 year:  now.getFullYear()
//             }
//         })
//         toast.success('Monthly report sent to your email! 📧')
//     } catch {
//         toast.error('Failed to send report')
//     }
// }}
//     className="border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
//   >
//     📧 Email Report
//   </button>
//       </div>

//       {/* New user welcome */}
// {!summary?.monthlyIncome && !summary?.monthlyExpenses && (
//   <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
//     <span className="text-2xl">👋</span>
//     <div>
//       <p className="font-semibold text-blue-900">Welcome to PocketTrack!</p>
//       <p className="text-sm text-blue-700 mt-1">
//         Start by creating an account, then add your first transaction.
//         Your dashboard will come alive with charts and insights.
//       </p>
//       <div className="flex gap-3 mt-3">
//         <a href="/accounts"
//           className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700">
//           + Create Account
//         </a>
//         <a href="/scan-receipt"
//           className="text-sm border border-blue-300 text-blue-700 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-50">
//           📷 Scan Receipt
//         </a>
//       </div>
//     </div>
//   </div>
// )}

//       {/* Stat Cards */}
//       <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
//         <StatCard
//           label="Monthly Income"
//           value={summary?.monthlyIncome}
//           color="text-green-600"
//           icon="💚"
//         />
//         <StatCard
//           label="Monthly Expenses"
//           value={summary?.monthlyExpenses}
//           color="text-red-600"
//           icon="❤️"
//         />
//         <StatCard
//           label="Monthly Savings"
//           value={summary?.monthlySavings}
//           color={Number(summary?.monthlySavings) >= 0 ? 'text-blue-600' : 'text-red-600'}
//           icon="💙"
//         />
//         <StatCard
//           label="Net Worth"
//           value={summary?.netWorth}
//           color={Number(summary?.netWorth) >= 0 ? 'text-gray-900' : 'text-red-600'}
//           icon="🏦"
//         />
//       </div>

//       {/* Charts Row */}
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

//         {/* Line Chart — Monthly Trend */}
//         <div className="bg-white rounded-2xl border border-gray-200 p-5">
//           <h2 className="text-base font-semibold text-gray-800 mb-4">
//             📈 Income vs Expenses (6 months)
//           </h2>
//           {trendData.length === 0 ? (
//             <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
//               No data yet — add some transactions
//             </div>
//           ) : (
//             <ResponsiveContainer width="100%" height={220}>
//               <LineChart data={trendData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
//                 <XAxis
//                   dataKey="month"
//                   tick={{ fontSize: 12, fill: '#9CA3AF' }}
//                 />
//                 <YAxis
//                   tick={{ fontSize: 12, fill: '#9CA3AF' }}
//                   tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`}
//                 />
//                 <Tooltip
//                   formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="income"
//                   stroke="#10B981"
//                   strokeWidth={2}
//                   dot={{ fill: '#10B981', r: 4 }}
//                   name="Income"
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="expenses"
//                   stroke="#EF4444"
//                   strokeWidth={2}
//                   dot={{ fill: '#EF4444', r: 4 }}
//                   name="Expenses"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           )}
//         </div>

//         {/* Pie Chart — Category Breakdown */}
//         <div className="bg-white rounded-2xl border border-gray-200 p-5">
//           <h2 className="text-base font-semibold text-gray-800 mb-4">
//             🥧 Spending by Category (this month)
//           </h2>
//           {categoryData.length === 0 ? (
//             <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
//               No expenses this month yet
//             </div>
//           ) : (
//             <ResponsiveContainer width="100%" height={220}>
//               <PieChart>
//                 <Pie
//                   data={categoryData}
//                   dataKey="amount"
//                   nameKey="category"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={80}
//                   label={({ category, percent }) =>
//                     `${category} ${(percent * 100).toFixed(0)}%`
//                   }
//                   labelLine={false}
//                 >
//                   {categoryData.map((_, index) => (
//                     <Cell
//                       key={index}
//                       fill={PIE_COLORS[index % PIE_COLORS.length]}
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
//                 />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           )}
//         </div>
//       </div>

//       {/* Recent Transactions */}
//       <RecentTransactions />
//     </div>
//   )
// }

// // ---- Recent Transactions Component ----
// function RecentTransactions() {
//   const [transactions, setTransactions] = useState([])

//   useEffect(() => {
//     api.get('/transactions', { params: { page: 0, size: 5 } })
//       .then(res => setTransactions(res.data.content))
//       .catch(() => {})
//   }, [])

//   if (transactions.length === 0) return null

//   return (
//     <div className="bg-white rounded-2xl border border-gray-200 p-5">
//       <h2 className="text-base font-semibold text-gray-800 mb-4">
//         🕐 Recent Transactions
//       </h2>
//       <div className="space-y-3">
//         {transactions.map(tx => (
//           <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
//             <div>
//               <p className="text-sm font-medium text-gray-800">
//                 {tx.description || tx.category}
//               </p>
//               <p className="text-xs text-gray-400">{tx.category} · {tx.date}</p>
//             </div>
//             <p className={`text-sm font-semibold ${
//               tx.type === 'INCOME' ? 'text-green-600' :
//               tx.type === 'EXPENSE' ? 'text-red-600' : 'text-blue-600'
//             }`}>
//               {tx.type === 'INCOME' ? '+' : '-'}
//               ₹{Number(tx.amount).toLocaleString('en-IN')}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// // ---- Helper ----
// function getGreeting() {
//   const h = new Date().getHours()
//   if (h < 12) return 'morning'
//   if (h < 17) return 'afternoon'
//   return 'evening'
// }


import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axiosConfig'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'
import { card, text, subtext } from '../utils/cn'
import {
  MdTrendingUp, MdTrendingDown, MdSavings,
  MdAccountBalance, MdAdd, MdEmail,
  MdArrowUpward, MdArrowDownward
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
      color: { bg: 'bg-green-100', icon: 'text-green-600', text: 'text-green-600' }},
    { label: 'Monthly Expenses', value: summary?.monthlyExpenses,
      icon: MdTrendingDown,
      color: { bg: 'bg-red-100', icon: 'text-red-600', text: 'text-red-600' }},
    { label: 'Monthly Savings',  value: summary?.monthlySavings,
      icon: MdSavings,
      color: {
        bg: Number(summary?.monthlySavings) >= 0 ? 'bg-blue-100' : 'bg-red-100',
        icon: Number(summary?.monthlySavings) >= 0 ? 'text-blue-600' : 'text-red-600',
        text: Number(summary?.monthlySavings) >= 0 ? 'text-blue-600' : 'text-red-600'
      }},
    { label: 'Net Worth',        value: summary?.netWorth,
      icon: MdAccountBalance,
      color: { bg: 'bg-purple-100', icon: 'text-purple-600', text: dark ? 'text-white' : 'text-gray-900' }},
  ]

  const tooltipStyle = {
    backgroundColor: dark ? '#1F2937' : '#fff',
    border: `1px solid ${dark ? '#374151' : '#E5E7EB'}`,
    borderRadius: '8px',
    color: dark ? '#fff' : '#111'
  }

  return (
    <div className="space-y-6">

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
              toast.success('Monthly report sent! 📧')
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