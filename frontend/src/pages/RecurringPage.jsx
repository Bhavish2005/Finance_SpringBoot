// import { useState, useEffect } from 'react'
// import { transactionApi } from '../api/transactionApi'
// import toast from 'react-hot-toast'

// const TYPE_COLORS = {
//   INCOME:   'bg-green-100 text-green-700',
//   EXPENSE:  'bg-red-100 text-red-700',
//   TRANSFER: 'bg-blue-100 text-blue-700',
// }

// export default function RecurringPage() {
//   const [transactions, setTransactions] = useState([])
//   const [loading, setLoading]           = useState(true)

//   useEffect(() => { fetchRecurring() }, [])

//   const fetchRecurring = async () => {
//     try {
//       const res = await transactionApi.getRecurring()
//       setTransactions(res.data)
//     } catch {
//       toast.error('Failed to load recurring transactions')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Group by category
//   const grouped = transactions.reduce((acc, tx) => {
//     if (!acc[tx.category]) acc[tx.category] = []
//     acc[tx.category].push(tx)
//     return acc
//   }, {})

//   // Total recurring expenses per month
//   const monthlyTotal = transactions
//     .filter(tx => tx.type === 'EXPENSE')
//     .reduce((sum, tx) => sum + Number(tx.amount), 0)

//   if (loading) return (
//     <div className="flex items-center justify-center h-64">
//       <p className="text-gray-400">Loading...</p>
//     </div>
//   )

//   return (
//     <div>
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">
//           🔁 Recurring Transactions
//         </h1>
//         <p className="text-sm text-gray-500 mt-1">
//           Auto-detected + manually marked recurring transactions
//         </p>
//       </div>

//       {/* Summary card */}
//       {transactions.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="bg-white rounded-2xl border border-gray-200 p-5">
//             <p className="text-sm text-gray-500 mb-1">Total Recurring</p>
//             <p className="text-2xl font-bold text-gray-900">
//               {transactions.length}
//             </p>
//           </div>
//           <div className="bg-white rounded-2xl border border-gray-200 p-5">
//             <p className="text-sm text-gray-500 mb-1">Monthly Expense</p>
//             <p className="text-2xl font-bold text-red-600">
//               ₹{monthlyTotal.toLocaleString('en-IN')}
//             </p>
//           </div>
//           <div className="bg-white rounded-2xl border border-gray-200 p-5">
//             <p className="text-sm text-gray-500 mb-1">Categories</p>
//             <p className="text-2xl font-bold text-blue-600">
//               {Object.keys(grouped).length}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Empty state */}
//       {transactions.length === 0 && (
//         <div className="text-center py-20 text-gray-400">
//           <p className="text-4xl mb-3">🔁</p>
//           <p className="font-medium">No recurring transactions yet</p>
//           <p className="text-sm mt-1">
//             Mark transactions as recurring or add the same
//             transaction two months in a row
//           </p>
//         </div>
//       )}

//       {/* Grouped by category */}
//       <div className="space-y-4">
//         {Object.entries(grouped).map(([category, txs]) => (
//           <div
//             key={category}
//             className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
//           >
//             {/* Category header */}
//             <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
//               <p className="font-semibold text-gray-800">{category}</p>
//               <p className="text-sm text-gray-500">
//                 {txs.length} transaction{txs.length > 1 ? 's' : ''}
//               </p>
//             </div>

//             {/* Transactions */}
//             <div className="divide-y divide-gray-50">
//               {txs.map(tx => (
//                 <div
//                   key={tx.id}
//                   className="flex items-center justify-between px-5 py-3"
//                 >
//                   <div>
//                     <p className="text-sm font-medium text-gray-800">
//                       {tx.description || tx.category}
//                     </p>
//                     <p className="text-xs text-gray-400 mt-0.5">
//                       {tx.date}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <span className={`text-xs px-2 py-1 rounded-full font-medium ${TYPE_COLORS[tx.type]}`}>
//                       {tx.type}
//                     </span>
//                     <p className={`text-sm font-semibold ${
//                       tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
//                     }`}>
//                       {tx.type === 'INCOME' ? '+' : '-'}
//                       ₹{Number(tx.amount).toLocaleString('en-IN')}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }







import { useState, useEffect } from 'react'
import { transactionApi } from '../api/transactionApi'
import { useTheme } from '../context/ThemeContext'
import { card, text, subtext } from '../utils/cn'
import toast from 'react-hot-toast'
import {
  MdRepeat, MdArrowDownward, MdArrowUpward,
  MdSwapHoriz, MdAttachMoney
} from 'react-icons/md'

const TYPE_CONFIG = {
  INCOME:   { icon: MdArrowDownward, badge: 'bg-green-100 text-green-700', amount: 'text-green-500' },
  EXPENSE:  { icon: MdArrowUpward,   badge: 'bg-red-100 text-red-700',     amount: 'text-red-500' },
  TRANSFER: { icon: MdSwapHoriz,     badge: 'bg-blue-100 text-blue-700',   amount: 'text-blue-500' },
}

export default function RecurringPage() {
  const { dark } = useTheme()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => { fetchRecurring() }, [])

  const fetchRecurring = async () => {
    try {
      const res = await transactionApi.getRecurring()
      setTransactions(res.data)
    } catch { toast.error('Failed to load recurring transactions') }
    finally { setLoading(false) }
  }

  const grouped = transactions.reduce((acc, tx) => {
    if (!acc[tx.category]) acc[tx.category] = []
    acc[tx.category].push(tx)
    return acc
  }, {})

  const monthlyExpenses = transactions
    .filter(tx => tx.type === 'EXPENSE')
    .reduce((s, tx) => s + Number(tx.amount), 0)

  const monthlyIncome = transactions
    .filter(tx => tx.type === 'INCOME')
    .reduce((s, tx) => s + Number(tx.amount), 0)

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className={subtext(dark)}>Loading...</p>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${text(dark)}`}>Recurring Transactions</h1>
        <p className={`text-sm mt-1 ${subtext(dark)}`}>
          Auto-detected and manually marked recurring transactions
        </p>
      </div>

      {/* Summary */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Recurring', value: transactions.length, suffix: '', color: text(dark), icon: MdRepeat },
            { label: 'Monthly Expenses', value: `₹${monthlyExpenses.toLocaleString('en-IN')}`, suffix: '', color: 'text-red-500', icon: MdArrowUpward },
            { label: 'Monthly Income',   value: `₹${monthlyIncome.toLocaleString('en-IN')}`,   suffix: '', color: 'text-green-500', icon: MdArrowDownward },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className={`${card(dark)} p-5`}>
              <div className="flex items-center justify-between mb-2">
                <p className={`text-sm ${subtext(dark)}`}>{label}</p>
                <Icon className={`text-lg ${subtext(dark)}`} />
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {transactions.length === 0 && (
        <div className={`text-center py-20 ${subtext(dark)}`}>
          <MdRepeat className="text-5xl mx-auto mb-3 opacity-30" />
          <p className="font-medium">No recurring transactions yet</p>
          <p className="text-sm mt-1">
            Mark transactions as recurring or add the same
            transaction two months in a row
          </p>
        </div>
      )}

      {/* Grouped */}
      <div className="space-y-4">
        {Object.entries(grouped).map(([category, txs]) => (
          <div key={category} className={`${card(dark)} overflow-hidden`}>
            <div className={`flex items-center justify-between px-5 py-3 border-b
              ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex items-center gap-2">
                <MdAttachMoney className={`text-base ${subtext(dark)}`} />
                <p className={`font-semibold ${text(dark)}`}>{category}</p>
              </div>
              <p className={`text-sm ${subtext(dark)}`}>
                {txs.length} transaction{txs.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className={`divide-y ${dark ? 'divide-gray-800' : 'divide-gray-50'}`}>
              {txs.map(tx => {
                const cfg  = TYPE_CONFIG[tx.type]
                const Icon = cfg.icon
                return (
                  <div key={tx.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center
                        ${tx.type === 'INCOME' ? 'bg-green-100' : tx.type === 'EXPENSE' ? 'bg-red-100' : 'bg-blue-100'}`}>
                        <Icon className={`text-sm ${cfg.amount}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${text(dark)}`}>
                          {tx.description || tx.category}
                        </p>
                        <p className={`text-xs ${subtext(dark)}`}>{tx.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${cfg.badge}`}>
                        {tx.type}
                      </span>
                      <p className={`text-sm font-semibold ${cfg.amount}`}>
                        {tx.type === 'INCOME' ? '+' : '-'}
                        ₹{Number(tx.amount).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}