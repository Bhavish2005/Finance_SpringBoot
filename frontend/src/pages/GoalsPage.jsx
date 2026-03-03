import { useState, useEffect } from 'react'
import api from '../api/axiosConfig'
import { useTheme } from '../context/ThemeContext'
import { card, text, subtext, input, btn, modal, iconBox } from '../utils/cn'
import toast from 'react-hot-toast'
import {
  MdAdd, MdEdit, MdDelete, MdClose, MdCheck,
  MdStar, MdCheckCircle, MdAddCircle, MdCalendarToday
} from 'react-icons/md'

const emptyForm = { name: '', targetAmount: '', targetDate: '' }

function ProgressBar({ percentage, completed, dark }) {
  return (
    <div className={`w-full rounded-full h-3 ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
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
  return Math.ceil((new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24))
}

export default function GoalsPage() {
  const { dark } = useTheme()
  const [goals, setGoals]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [showModal, setShowModal]       = useState(false)
  const [showContribute, setShowContribute] = useState(false)
  const [editing, setEditing]           = useState(null)
  const [selected, setSelected]         = useState(null)
  const [form, setForm]                 = useState(emptyForm)
  const [contribution, setContribution] = useState('')
  const [saving, setSaving]             = useState(false)

  useEffect(() => { fetchGoals() }, [])

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals')
      setGoals(res.data)
    } catch { toast.error('Failed to load goals') }
    finally { setLoading(false) }
  }

  const openCreate    = () => { setEditing(null); setForm(emptyForm); setShowModal(true) }
  const openEdit      = (g) => {
    setEditing(g)
    setForm({ name: g.name, targetAmount: g.targetAmount, targetDate: g.targetDate || '' })
    setShowModal(true)
  }
  const openContribute = (g) => { setSelected(g); setContribution(''); setShowContribute(true) }
  const closeModal    = () => { setShowModal(false); setEditing(null) }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { ...form, targetAmount: parseFloat(form.targetAmount), targetDate: form.targetDate || null }
      editing
        ? await api.put(`/goals/${editing.id}`, payload)
        : await api.post('/goals', payload)
      toast.success(editing ? 'Goal updated!' : 'Goal created!')
      closeModal(); fetchGoals()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong')
    } finally { setSaving(false) }
  }

  const handleContribute = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await api.put(`/goals/${selected.id}/contribute`, { amount: parseFloat(contribution) })
      toast.success('Contribution added!')
      setShowContribute(false); fetchGoals()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong')
    } finally { setSaving(false) }
  }

  const handleDelete = async (g) => {
    if (!confirm(`Delete goal "${g.name}"?`)) return
    try {
      await api.delete(`/goals/${g.id}`)
      toast.success('Goal deleted'); fetchGoals()
    } catch { toast.error('Failed to delete') }
  }

  const activeGoals    = goals.filter(g => g.status === 'ACTIVE')
  const completedGoals = goals.filter(g => g.status === 'COMPLETED')

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className={subtext(dark)}>Loading goals...</p>
    </div>
  )

  return (
    <div>
   <div className="flex items-center justify-between mb-6">
  <div className="flex items-center gap-3">
    <div className={`w-8 h-8 ${iconBox(dark)}`}>
      <MdStar className={`text-[15px] ${dark ? 'text-[#555]' : 'text-[#AAA]'}`} />
    </div>
    <div>
      <h1 className={`text-[15px] font-semibold leading-none ${text(dark)}`}>Goals</h1>
      <p className={`text-[11px] mt-0.5 ${subtext(dark)}`}>
        {activeGoals.length} active · {completedGoals.length} completed
      </p>
    </div>
  </div>
  <button onClick={openCreate}
    className={`flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors
      ${dark ? 'bg-white text-[#111] hover:bg-[#F0F0F0]' : 'bg-[#111] text-white hover:bg-[#222]'}`}>
    <MdAdd className="text-sm" /> New Goal
  </button>
</div>

      {/* Empty */}
      {goals.length === 0 && (
        <div className={`text-center py-20 ${subtext(dark)}`}>
          <MdStar className="text-5xl mx-auto mb-3 opacity-30" />
          <p className="font-medium">No goals yet</p>
          <p className="text-sm mt-1">Set a savings goal to get started</p>
        </div>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${subtext(dark)}`}>
            Active
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
            {activeGoals.map(goal => {
              const days = daysRemaining(goal.targetDate)
              return (
                <div key={goal.id} className={`${card(dark)} p-5`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className={`font-semibold ${text(dark)}`}>{goal.name}</p>
                      {goal.targetDate && (
                        <p className={`text-xs mt-0.5 flex items-center gap-1
                          ${days < 0 ? 'text-red-500' : days < 30 ? 'text-yellow-500' : subtext(dark)}`}>
                          <MdCalendarToday className="text-xs" />
                          {days < 0 ? `${Math.abs(days)}d overdue` :
                           days === 0 ? 'Due today!' : `${days}d left`}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(goal)}
                        className={`p-1.5 rounded-lg transition-colors ${dark ? 'text-gray-500 hover:text-blue-400 hover:bg-gray-800' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}>
                        <MdEdit className="text-base" />
                      </button>
                      <button onClick={() => handleDelete(goal)}
                        className={`p-1.5 rounded-lg transition-colors ${dark ? 'text-gray-500 hover:text-red-400 hover:bg-gray-800' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}>
                        <MdDelete className="text-base" />
                      </button>
                    </div>
                  </div>

                  <ProgressBar percentage={goal.percentage} completed={false} dark={dark} />

                  <div className="flex justify-between mt-3 text-sm">
                    <div>
                      <p className={`text-xs ${subtext(dark)}`}>Saved</p>
                      <p className="font-semibold text-blue-500">
                        ₹{Number(goal.currentAmount).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className={`text-xs ${subtext(dark)}`}>Progress</p>
                      <p className={`font-semibold ${text(dark)}`}>{goal.percentage.toFixed(0)}%</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs ${subtext(dark)}`}>Target</p>
                      <p className={`font-semibold ${text(dark)}`}>
                        ₹{Number(goal.targetAmount).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <button onClick={() => openContribute(goal)}
                    className={`w-full mt-4 flex items-center justify-center gap-2 text-sm font-semibold py-2 rounded-xl transition-colors
                      ${dark ? 'bg-blue-900/40 hover:bg-blue-900/60 text-blue-400' : 'bg-blue-50 hover:bg-blue-100 text-blue-700'}`}>
                    <MdAddCircle className="text-base" /> Add Money
                  </button>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Completed */}
      {completedGoals.length > 0 && (
        <>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${subtext(dark)}`}>
            Completed
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {completedGoals.map(goal => (
              <div key={goal.id}
                className={`rounded-2xl border p-5 ${dark ? 'bg-green-950 border-green-900' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <p className={`font-semibold ${text(dark)}`}>{goal.name}</p>
                  <MdCheckCircle className="text-green-500 text-xl" />
                </div>
                <ProgressBar percentage={100} completed={true} dark={dark} />
                <p className="text-sm text-green-600 font-semibold mt-3">
                  ₹{Number(goal.targetAmount).toLocaleString('en-IN')} — Goal reached!
                </p>
                <button onClick={() => handleDelete(goal)}
                  className={`mt-3 text-xs ${subtext(dark)} hover:text-red-500 transition-colors`}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className={`${modal(dark)} w-full max-w-md p-6`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${text(dark)}`}>
                {editing ? 'Edit Goal' : 'New Goal'}
              </h2>
              <button onClick={closeModal}
                className={`p-1.5 rounded-lg ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}>
                <MdClose className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${text(dark)}`}>Goal Name</label>
                <input type="text" name="name" value={form.name}
                  onChange={handleChange} required placeholder="e.g. Emergency Fund"
                  className={`w-full ${input(dark)}`} />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${text(dark)}`}>Target Amount (₹)</label>
                <input type="number" name="targetAmount" value={form.targetAmount}
                  onChange={handleChange} required min="1" step="0.01" placeholder="e.g. 100000"
                  className={`w-full ${input(dark)}`} />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${text(dark)}`}>
                  Target Date <span className={`font-normal ${subtext(dark)}`}>(optional)</span>
                </label>
                <input type="date" name="targetDate" value={form.targetDate}
                  onChange={handleChange} className={`w-full ${input(dark)}`} />
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

      {/* Contribute Modal */}
      {showContribute && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className={`${modal(dark)} w-full max-w-sm p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`text-lg font-bold ${text(dark)}`}>Add Money</h2>
                <p className={`text-sm ${subtext(dark)}`}>{selected.name}</p>
              </div>
              <button onClick={() => setShowContribute(false)}
                className={`p-1.5 rounded-lg ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}>
                <MdClose className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleContribute} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${text(dark)}`}>Amount (₹)</label>
                <input type="number" value={contribution}
                  onChange={e => setContribution(e.target.value)}
                  required min="1" step="0.01" placeholder="How much to add?"
                  className={`w-full ${input(dark)}`} autoFocus />
              </div>
              <div className={`rounded-xl p-3 text-sm space-y-1
                ${dark ? 'bg-gray-800' : 'bg-blue-50'}`}>
                <div className={`flex justify-between ${subtext(dark)}`}>
                  <span>Current</span>
                  <span>₹{Number(selected.currentAmount).toLocaleString('en-IN')}</span>
                </div>
                <div className={`flex justify-between ${subtext(dark)}`}>
                  <span>Target</span>
                  <span>₹{Number(selected.targetAmount).toLocaleString('en-IN')}</span>
                </div>
                <div className={`flex justify-between font-semibold pt-1 border-t
                  ${dark ? 'border-gray-700 text-blue-400' : 'border-blue-100 text-blue-700'}`}>
                  <span>Remaining</span>
                  <span>₹{Number(selected.remaining).toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowContribute(false)}
                  className={`flex-1 py-2 text-sm font-medium ${btn.secondary(dark)}`}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className={`flex-1 py-2 text-sm ${btn.primary} disabled:opacity-50`}>
                  {saving ? 'Adding...' : 'Add Money'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}