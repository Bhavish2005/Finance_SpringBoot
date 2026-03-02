import { useState, useEffect } from 'react'
import api from '../api/axiosConfig'
import toast from 'react-hot-toast'

const CATEGORIES = [
  'Food & Dining', 'Groceries', 'Transport', 'Shopping',
  'Entertainment', 'Healthcare', 'Utilities', 'Housing',
  'Education', 'Travel', 'Other'
]

const emptyForm = {
  category: 'Food & Dining',
  amount: '',
  month: new Date().getMonth() + 1,
  year:  new Date().getFullYear(),
}

function ProgressBar({ percentage }) {
  const color =
    percentage >= 100 ? 'bg-red-500' :
    percentage >= 80  ? 'bg-yellow-500' :
    'bg-green-500'

  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  )
}

export default function BudgetPage() {
  const [budgets, setBudgets]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(emptyForm)
  const [saving, setSaving]       = useState(false)

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear,  setSelectedYear]  = useState(new Date().getFullYear())

  useEffect(() => {
    fetchBudgets()
  }, [selectedMonth, selectedYear])

  const fetchBudgets = async () => {
    setLoading(true)
    try {
      const res = await api.get('/budgets', {
        params: { month: selectedMonth, year: selectedYear }
      })
      setBudgets(res.data)
    } catch {
      toast.error('Failed to load budgets')
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, month: selectedMonth, year: selectedYear })
    setShowModal(true)
  }

  const openEdit = (budget) => {
    setEditing(budget)
    setForm({
      category: budget.category,
      amount:   budget.amount,
      month:    budget.month,
      year:     budget.year,
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditing(null)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, amount: parseFloat(form.amount) }
      if (editing) {
        await api.put(`/budgets/${editing.id}`, payload)
        toast.success('Budget updated!')
      } else {
        await api.post('/budgets', payload)
        toast.success('Budget created!')
      }
      closeModal()
      fetchBudgets()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (budget) => {
    if (!confirm(`Delete budget for "${budget.category}"?`)) return
    try {
      await api.delete(`/budgets/${budget.id}`)
      toast.success('Budget deleted')
      fetchBudgets()
    } catch {
      toast.error('Failed to delete')
    }
  }

  // Total budget vs total spent
  const totalBudget = budgets.reduce((s, b) => s + Number(b.amount), 0)
  const totalSpent  = budgets.reduce((s, b) => s + Number(b.spent),  0)

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec']

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget</h1>
          <p className="text-sm text-gray-500 mt-1">
            ₹{totalSpent.toLocaleString('en-IN')} spent of ₹{totalBudget.toLocaleString('en-IN')} budgeted
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl"
        >
          + Add Budget
        </button>
      </div>

      {/* Month selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {MONTHS.map((m, i) => (
          <button
            key={i}
            onClick={() => setSelectedMonth(i + 1)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${selectedMonth === i + 1
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {!loading && budgets.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🎯</p>
          <p className="font-medium">No budgets for this month</p>
          <p className="text-sm mt-1">Click "Add Budget" to set spending limits</p>
        </div>
      )}

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {budgets.map((budget) => (
          <div
            key={budget.id}
            className="bg-white rounded-2xl border border-gray-200 p-5"
          >
            {/* Top row */}
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-gray-900">{budget.category}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(budget)}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >✏️</button>
                <button
                  onClick={() => handleDelete(budget)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >🗑️</button>
              </div>
            </div>

            {/* Progress bar */}
            <ProgressBar percentage={budget.percentage} />

            {/* Amounts */}
            <div className="flex justify-between mt-3 text-sm">
              <div>
                <p className="text-gray-400 text-xs">Spent</p>
                <p className={`font-semibold ${
                  budget.percentage >= 100 ? 'text-red-600' :
                  budget.percentage >= 80  ? 'text-yellow-600' :
                  'text-gray-800'
                }`}>
                  ₹{Number(budget.spent).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">Budget</p>
                <p className="font-semibold text-gray-800">
                  ₹{Number(budget.amount).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Status badge */}
            <div className="mt-3">
              {budget.percentage >= 100 ? (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                  🚨 Over budget by ₹{Math.abs(Number(budget.remaining)).toLocaleString('en-IN')}
                </span>
              ) : budget.percentage >= 80 ? (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                  ⚠️ {budget.percentage.toFixed(0)}% used — running low
                </span>
              ) : (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  ✅ ₹{Number(budget.remaining).toLocaleString('en-IN')} remaining
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              {editing ? 'Edit Budget' : 'New Budget'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  disabled={!!editing}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Budget Amount (₹)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.01"
                  placeholder="e.g. 5000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                  <select
                    name="month"
                    value={form.month}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {MONTHS.map((m, i) => (
                      <option key={i} value={i + 1}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-xl"
                >
                  {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}