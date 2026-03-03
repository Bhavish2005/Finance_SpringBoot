import { useState, useEffect } from 'react'
import api from '../api/axiosConfig'
import { useTheme } from '../context/ThemeContext'
import { card, text, subtext, input, select, btn, modal,iconBox } from '../utils/cn'
import toast from 'react-hot-toast'
import {
  MdAdd, MdEdit, MdDelete, MdClose, MdCheck,
  MdWarning, MdError, MdCheckCircle, MdTrackChanges
} from 'react-icons/md'

const CATEGORIES = [
  'Food & Dining','Groceries','Transport','Shopping',
  'Entertainment','Healthcare','Utilities','Housing',
  'Education','Travel','Other'
]

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const emptyForm = {
  category: 'Food & Dining', amount: '',
  month: new Date().getMonth() + 1,
  year:  new Date().getFullYear(),
}

function ProgressBar({ percentage, dark }) {
  const color =
    percentage >= 100 ? 'bg-red-500' :
    percentage >= 80  ? 'bg-yellow-500' : 'bg-green-500'
  return (
    <div className={`w-full rounded-full h-2 ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <div className={`h-2 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min(percentage, 100)}%` }} />
    </div>
  )
}

export default function BudgetPage() {
  const { dark } = useTheme()
  const [budgets, setBudgets]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [editing, setEditing]       = useState(null)
  const [form, setForm]             = useState(emptyForm)
  const [saving, setSaving]         = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear]   = useState(new Date().getFullYear())

  useEffect(() => { fetchBudgets() }, [selectedMonth, selectedYear])

  const fetchBudgets = async () => {
    setLoading(true)
    try {
      const res = await api.get('/budgets', {
        params: { month: selectedMonth, year: selectedYear }
      })
      setBudgets(res.data)
    } catch { toast.error('Failed to load budgets') }
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, month: selectedMonth, year: selectedYear })
    setShowModal(true)
  }

  const openEdit = (b) => {
    setEditing(b)
    setForm({ category: b.category, amount: b.amount, month: b.month, year: b.year })
    setShowModal(true)
  }

  const closeModal = () => { setShowModal(false); setEditing(null) }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { ...form, amount: parseFloat(form.amount) }
      editing
        ? await api.put(`/budgets/${editing.id}`, payload)
        : await api.post('/budgets', payload)
      toast.success(editing ? 'Budget updated!' : 'Budget created!')
      closeModal(); fetchBudgets()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong')
    } finally { setSaving(false) }
  }

  const handleDelete = async (b) => {
    if (!confirm(`Delete budget for "${b.category}"?`)) return
    try {
      await api.delete(`/budgets/${b.id}`)
      toast.success('Budget deleted')
      fetchBudgets()
    } catch { toast.error('Failed to delete') }
  }

  const totalBudget = budgets.reduce((s, b) => s + Number(b.amount), 0)
  const totalSpent  = budgets.reduce((s, b) => s + Number(b.spent),  0)

  return (
    <div>
     <div className="flex items-center justify-between mb-6">
  <div className="flex items-center gap-3">
    <div className={`w-8 h-8 ${iconBox(dark)}`}>
      <MdTrackChanges className={`text-[15px] ${dark ? 'text-[#555]' : 'text-[#AAA]'}`} />
    </div>
    <div>
      <h1 className={`text-[15px] font-semibold leading-none ${text(dark)}`}>Budget</h1>
      <p className={`text-[11px] mt-0.5 ${subtext(dark)}`}>
        ₹{totalSpent.toLocaleString('en-IN')} of ₹{totalBudget.toLocaleString('en-IN')} spent
      </p>
    </div>
  </div>
  <button onClick={openCreate}
    className={`flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors
      ${dark ? 'bg-white text-[#111] hover:bg-[#F0F0F0]' : 'bg-[#111] text-white hover:bg-[#222]'}`}>
    <MdAdd className="text-sm" /> Add Budget
  </button>
</div>

      {/* Month selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {MONTHS.map((m, i) => (
          <button key={i} onClick={() => setSelectedMonth(i + 1)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${selectedMonth === i + 1
                ? 'bg-black text-white'
                :
                 dark
                  ? 'bg--800 text-gray-400 hover:bg-gray-700'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
            {m}
          </button>
        ))}
      </div>

      {/* Empty */}
      {!loading && budgets.length === 0 && (
        <div className={`text-center py-20 ${subtext(dark)}`}>
          <MdTrackChanges className="text-5xl mx-auto mb-3 opacity-30" />
          <p className="font-medium">No budgets for this month</p>
          <p className="text-sm mt-1">Click "Add Budget" to set spending limits</p>
        </div>
      )}

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {budgets.map(budget => (
          <div key={budget.id} className={`${card(dark)} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <p className={`font-semibold ${text(dark)}`}>{budget.category}</p>
              <div className="flex gap-1">
                <button onClick={() => openEdit(budget)}
                  className={`p-1.5 rounded-lg transition-colors ${dark ? 'text-gray-500 hover:text-blue-400 hover:bg-gray-800' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}>
                  <MdEdit className="text-base" />
                </button>
                <button onClick={() => handleDelete(budget)}
                  className={`p-1.5 rounded-lg transition-colors ${dark ? 'text-gray-500 hover:text-red-400 hover:bg-gray-800' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}>
                  <MdDelete className="text-base" />
                </button>
              </div>
            </div>

            <ProgressBar percentage={budget.percentage} dark={dark} />

            <div className="flex justify-between mt-3 text-sm">
              <div>
                <p className={`text-xs ${subtext(dark)}`}>Spent</p>
                <p className={`font-semibold ${
                  budget.percentage >= 100 ? 'text-red-500' :
                  budget.percentage >= 80  ? 'text-yellow-500' : text(dark)
                }`}>
                  ₹{Number(budget.spent).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-xs ${subtext(dark)}`}>Budget</p>
                <p className={`font-semibold ${text(dark)}`}>
                  ₹{Number(budget.amount).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div className="mt-3">
              {budget.percentage >= 100 ? (
                <div className="flex items-center gap-1.5 text-xs bg-red-100 text-red-700 px-2.5 py-1.5 rounded-full w-fit">
                  <MdError className="text-sm" />
                  Over by ₹{Math.abs(Number(budget.remaining)).toLocaleString('en-IN')}
                </div>
              ) : budget.percentage >= 80 ? (
                <div className="flex items-center gap-1.5 text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1.5 rounded-full w-fit">
                  <MdWarning className="text-sm" />
                  {budget.percentage.toFixed(0)}% used
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs bg-green-100 text-green-700 px-2.5 py-1.5 rounded-full w-fit">
                  <MdCheckCircle className="text-sm" />
                  ₹{Number(budget.remaining).toLocaleString('en-IN')} remaining
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className={`${modal(dark)} w-full max-w-md p-6`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${text(dark)}`}>
                {editing ? 'Edit Budget' : 'New Budget'}
              </h2>
              <button onClick={closeModal}
                className={`p-1.5 rounded-lg ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}>
                <MdClose className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${text(dark)}`}>Category</label>
                <select name="category" value={form.category}
                  onChange={handleChange} disabled={!!editing}
                  className={`w-full ${select(dark)} disabled:opacity-60`}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${text(dark)}`}>Amount (₹)</label>
                <input type="number" name="amount" value={form.amount}
                  onChange={handleChange} required min="1" step="0.01" placeholder="e.g. 5000"
                  className={`w-full ${input(dark)}`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${text(dark)}`}>Month</label>
                  <select name="month" value={form.month}
                    onChange={handleChange} className={`w-full ${select(dark)}`}>
                    {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${text(dark)}`}>Year</label>
                  <input type="number" name="year" value={form.year}
                    onChange={handleChange} className={`w-full ${input(dark)}`} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className={`flex-1 py-2 text-sm font-medium ${btn.secondary(dark)}`}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className={`flex-1 py-2 text-sm ${btn.primary} disabled:opacity-50 flex items-center justify-center gap-2`}>
                  {saving ? 'Saving...' : <><MdCheck className="text-base" />{editing ? 'Update' : 'Create'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}