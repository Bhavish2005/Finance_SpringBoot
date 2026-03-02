import { useState, useEffect } from 'react'
import { transactionApi } from '../api/transactionApi'
import toast from 'react-hot-toast'

const TYPE_COLORS = {
  INCOME:   'bg-green-100 text-green-700',
  EXPENSE:  'bg-red-100 text-red-700',
  TRANSFER: 'bg-blue-100 text-blue-700',
}

export default function RecurringPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => { fetchRecurring() }, [])

  const fetchRecurring = async () => {
    try {
      const res = await transactionApi.getRecurring()
      setTransactions(res.data)
    } catch {
      toast.error('Failed to load recurring transactions')
    } finally {
      setLoading(false)
    }
  }

  // Group by category
  const grouped = transactions.reduce((acc, tx) => {
    if (!acc[tx.category]) acc[tx.category] = []
    acc[tx.category].push(tx)
    return acc
  }, {})

  // Total recurring expenses per month
  const monthlyTotal = transactions
    .filter(tx => tx.type === 'EXPENSE')
    .reduce((sum, tx) => sum + Number(tx.amount), 0)

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          🔁 Recurring Transactions
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Auto-detected + manually marked recurring transactions
        </p>
      </div>

      {/* Summary card */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 mb-1">Total Recurring</p>
            <p className="text-2xl font-bold text-gray-900">
              {transactions.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 mb-1">Monthly Expense</p>
            <p className="text-2xl font-bold text-red-600">
              ₹{monthlyTotal.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 mb-1">Categories</p>
            <p className="text-2xl font-bold text-blue-600">
              {Object.keys(grouped).length}
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {transactions.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🔁</p>
          <p className="font-medium">No recurring transactions yet</p>
          <p className="text-sm mt-1">
            Mark transactions as recurring or add the same
            transaction two months in a row
          </p>
        </div>
      )}

      {/* Grouped by category */}
      <div className="space-y-4">
        {Object.entries(grouped).map(([category, txs]) => (
          <div
            key={category}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
          >
            {/* Category header */}
            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
              <p className="font-semibold text-gray-800">{category}</p>
              <p className="text-sm text-gray-500">
                {txs.length} transaction{txs.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* Transactions */}
            <div className="divide-y divide-gray-50">
              {txs.map(tx => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {tx.description || tx.category}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {tx.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${TYPE_COLORS[tx.type]}`}>
                      {tx.type}
                    </span>
                    <p className={`text-sm font-semibold ${
                      tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.type === 'INCOME' ? '+' : '-'}
                      ₹{Number(tx.amount).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}