import { useState, useEffect } from 'react'
import { transactionApi } from '../api/transactionApi'
import { useTheme } from '../context/ThemeContext'
import { card, text, subtext,iconBox } from '../utils/cn'
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
      

<div className="mb-6">
  <div className="flex items-center gap-3">
    <div className={`w-8 h-8 ${iconBox(dark)}`}>
      <MdRepeat className={`text-[15px] ${dark ? 'text-[#555]' : 'text-[#AAA]'}`} />
    </div>
    <div>
      <h1 className={`text-[25px] font-bold leading-none ${text(dark)}`}>Recurring</h1>
      <p className={`text-[15px] mt-0.5 ${subtext(dark)}`}>Auto-detected recurring transactions</p>
    </div>
  </div>
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