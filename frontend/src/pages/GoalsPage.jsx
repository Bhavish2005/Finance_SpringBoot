import { useState, useEffect } from 'react'
import api from '../api/axiosConfig'
import toast from 'react-hot-toast'

const emptyForm = {
  name:         '',
  targetAmount: '',
  targetDate:   '',
}

function ProgressBar({ percentage, completed }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-3">
      <div
        className={`h-3 rounded-full transition-all duration-700
          ${completed ? 'bg-green-500' : 'bg-blue-500'}`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  )
}

function daysRemaining(targetDate) {
  if (!targetDate) return null
  const diff = Math.ceil(
    (new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24)
  )
  return diff
}

export default function GoalsPage() {
  const [goals, setGoals]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showContribute, setShowContribute] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [selected, setSelected]   = useState(null)
  const [form, setForm]           = useState(emptyForm)
  const [contribution, setContribution] = useState('')
  const [saving, setSaving]       = useState(false)

  useEffect(() => { fetchGoals() }, [])

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals')
      setGoals(res.data)
    } catch {
      toast.error('Failed to load goals')
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (goal) => {
    setEditing(goal)
    setForm({
      name:         goal.name,
      targetAmount: goal.targetAmount,
      targetDate:   goal.targetDate || '',
    })
    setShowModal(true)
  }

  const openContribute = (goal) => {
    setSelected(goal)
    setContribution('')
    setShowContribute(true)
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
      const payload = {
        ...form,
        targetAmount: parseFloat(form.targetAmount),
        targetDate:   form.targetDate || null,
      }
      if (editing) {
        await api.put(`/goals/${editing.id}`, payload)
        toast.success('Goal updated!')
      } else {
        await api.post('/goals', payload)
        toast.success('Goal created! 🎯')
      }
      closeModal()
      fetchGoals()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleContribute = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put(`/goals/${selected.id}/contribute`, {
        amount: parseFloat(contribution)
      })
      toast.success('Contribution added! 💪')
      setShowContribute(false)
      fetchGoals()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (goal) => {
    if (!confirm(`Delete goal "${goal.name}"?`)) return
    try {
      await api.delete(`/goals/${goal.id}`)
      toast.success('Goal deleted')
      fetchGoals()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const activeGoals    = goals.filter(g => g.status === 'ACTIVE')
  const completedGoals = goals.filter(g => g.status === 'COMPLETED')

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-400">Loading goals...</p>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Goals</h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeGoals.length} active · {completedGoals.length} completed
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl"
        >
          + New Goal
        </button>
      </div>

      {/* Empty state */}
      {goals.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">⭐</p>
          <p className="font-medium">No goals yet</p>
          <p className="text-sm mt-1">Set a savings goal to get started</p>
        </div>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
            Active
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
            {activeGoals.map((goal) => {
              const days = daysRemaining(goal.targetDate)
              return (
                <div
                  key={goal.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5"
                >
                  {/* Top */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold text-gray-900">{goal.name}</p>
                      {goal.targetDate && (
                        <p className={`text-xs mt-0.5 ${
                          days < 0    ? 'text-red-500' :
                          days < 30   ? 'text-yellow-600' :
                          'text-gray-400'
                        }`}>
                          {days < 0
                            ? `${Math.abs(days)} days overdue`
                            : days === 0
                            ? 'Due today!'
                            : `${days} days left`
                          }
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(goal)}
                        className="text-gray-400 hover:text-blue-600 p-1 transition-colors"
                      >✏️</button>
                      <button
                        onClick={() => handleDelete(goal)}
                        className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                      >🗑️</button>
                    </div>
                  </div>

                  {/* Progress */}
                  <ProgressBar
                    percentage={goal.percentage}
                    completed={false}
                  />

                  {/* Amounts */}
                  <div className="flex justify-between mt-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">Saved</p>
                      <p className="font-semibold text-blue-600">
                        ₹{Number(goal.currentAmount).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Progress</p>
                      <p className="font-semibold text-gray-700">
                        {goal.percentage.toFixed(0)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Target</p>
                      <p className="font-semibold text-gray-800">
                        ₹{Number(goal.targetAmount).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Contribute button */}
                  <button
                    onClick={() => openContribute(goal)}
                    className="w-full mt-4 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-semibold py-2 rounded-xl transition-colors"
                  >
                    + Add Money
                  </button>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
            Completed 🎉
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {completedGoals.map((goal) => (
              <div
                key={goal.id}
                className="bg-green-50 rounded-2xl border border-green-200 p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-gray-900">{goal.name}</p>
                  <span className="text-lg">✅</span>
                </div>
                <ProgressBar percentage={100} completed={true} />
                <p className="text-sm text-green-700 font-semibold mt-3">
                  ₹{Number(goal.targetAmount).toLocaleString('en-IN')} — Goal reached!
                </p>
                <button
                  onClick={() => handleDelete(goal)}
                  className="mt-3 text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              {editing ? 'Edit Goal' : 'New Goal'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Emergency Fund, New Laptop"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Amount (₹)
                </label>
                <input
                  type="number"
                  name="targetAmount"
                  value={form.targetAmount}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.01"
                  placeholder="e.g. 100000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Date (optional)
                </label>
                <input
                  type="date"
                  name="targetDate"
                  value={form.targetDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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

      {/* Contribute Modal */}
      {showContribute && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Add Money
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Contributing to: <span className="font-medium text-gray-800">{selected.name}</span>
            </p>

            <form onSubmit={handleContribute} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={contribution}
                  onChange={(e) => setContribution(e.target.value)}
                  required
                  min="1"
                  step="0.01"
                  placeholder="How much to add?"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div className="bg-blue-50 rounded-xl p-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Current</span>
                  <span>₹{Number(selected.currentAmount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600 mt-1">
                  <span>Target</span>
                  <span>₹{Number(selected.targetAmount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-blue-700 font-semibold mt-1 pt-1 border-t border-blue-100">
                  <span>Remaining</span>
                  <span>₹{Number(selected.remaining).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowContribute(false)}
                  className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-xl"
                >
                  {saving ? 'Adding...' : 'Add Money 💪'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}