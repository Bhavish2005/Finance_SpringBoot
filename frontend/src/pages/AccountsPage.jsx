// import { useState, useEffect } from 'react'
// import { accountApi } from '../api/accountApi'
// import toast from 'react-hot-toast'

// const ACCOUNT_TYPES = ['CHECKING', 'SAVINGS', 'CREDIT_CARD', 'INVESTMENT', 'CASH', 'OTHER']

// const TYPE_ICONS = {
//   CHECKING:    '🏦',
//   SAVINGS:     '💰',
//   CREDIT_CARD: '💳',
//   INVESTMENT:  '📈',
//   CASH:        '💵',
//   OTHER:       '🏧',
// }

// const emptyForm = { name: '', type: 'SAVINGS', currency: 'INR', isDefault: false }

// export default function AccountsPage() {
//   const [accounts, setAccounts]   = useState([])
//   const [loading, setLoading]     = useState(true)
//   const [showModal, setShowModal] = useState(false)
//   const [editing, setEditing]     = useState(null)   // null = creating, object = editing
//   const [form, setForm]           = useState(emptyForm)
//   const [saving, setSaving]       = useState(false)

//   // Load accounts on mount
//   useEffect(() => {
//     fetchAccounts()
//   }, [])

//   const fetchAccounts = async () => {
//     try {
//       const res = await accountApi.getAll()
//       setAccounts(res.data)
//     } catch {
//       toast.error('Failed to load accounts')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const openCreate = () => {
//     setEditing(null)
//     setForm(emptyForm)
//     setShowModal(true)
//   }

//   const openEdit = (account) => {
//     setEditing(account)
//     setForm({
//       name:      account.name,
//       type:      account.type,
//       currency:  account.currency,
//       isDefault: account.isDefault,
//     })
//     setShowModal(true)
//   }

//   const closeModal = () => {
//     setShowModal(false)
//     setEditing(null)
//     setForm(emptyForm)
//   }

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target
//     setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setSaving(true)
//     try {
//       if (editing) {
//         await accountApi.update(editing.id, form)
//         toast.success('Account updated!')
//       } else {
//         await accountApi.create(form)
//         toast.success('Account created!')
//       }
//       closeModal()
//       fetchAccounts()
//     } catch (err) {
//       toast.error(err.response?.data?.error || 'Something went wrong')
//     } finally {
//       setSaving(false)
//     }
//   }

//   const handleDelete = async (account) => {
//     if (!confirm(`Delete "${account.name}"? This cannot be undone.`)) return
//     try {
//       await accountApi.delete(account.id)
//       toast.success('Account deleted')
//       fetchAccounts()
//     } catch {
//       toast.error('Failed to delete account')
//     }
//   }

//   // Total net worth
//   const netWorth = accounts.reduce((sum, a) => sum + Number(a.balance), 0)

//   if (loading) return (
//     <div className="flex items-center justify-center h-64">
//       <p className="text-gray-400">Loading accounts...</p>
//     </div>
//   )

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Net Worth:
//             <span className={`font-semibold ml-1 ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//               ₹{netWorth.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//             </span>
//           </p>
//         </div>
//         <button
//           onClick={openCreate}
//           className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
//         >
//           + Add Account
//         </button>
//       </div>

//       {/* Empty state */}
//       {accounts.length === 0 && (
//         <div className="text-center py-20 text-gray-400">
//           <p className="text-4xl mb-3">🏦</p>
//           <p className="font-medium">No accounts yet</p>
//           <p className="text-sm mt-1">Click "Add Account" to get started</p>
//         </div>
//       )}

//       {/* Account Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
//         {accounts.map((account) => (
//           <div
//             key={account.id}
//             className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <span className="text-2xl">{TYPE_ICONS[account.type]}</span>
//                 <div>
//                   <p className="font-semibold text-gray-900">{account.name}</p>
//                   <p className="text-xs text-gray-400 capitalize">
//                     {account.type.replace('_', ' ')}
//                     {account.default && (
//                       <span className="ml-2 bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded text-xs">
//                         Default
//                       </span>
//                     )}
//                   </p>
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => openEdit(account)}
//                   className="text-gray-400 hover:text-blue-600 text-sm p-1 rounded transition-colors"
//                 >
//                   ✏️
//                 </button>
//                 <button
//                   onClick={() => handleDelete(account)}
//                   className="text-gray-400 hover:text-red-600 text-sm p-1 rounded transition-colors"
//                 >
//                   🗑️
//                 </button>
//               </div>
//             </div>

//             {/* Balance */}
//             <div>
//               <p className="text-xs text-gray-400 mb-1">Balance</p>
//               <p className={`text-2xl font-bold ${Number(account.balance) >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
//                 ₹{Number(account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">

//             <h2 className="text-lg font-bold text-gray-900 mb-5">
//               {editing ? 'Edit Account' : 'New Account'}
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Account Name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={form.name}
//                   onChange={handleChange}
//                   required
//                   placeholder="e.g. SBI Savings"
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Account Type
//                 </label>
//                 <select
//                   name="type"
//                   value={form.type}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   {ACCOUNT_TYPES.map(t => (
//                     <option key={t} value={t}>
//                       {TYPE_ICONS[t]} {t.replace('_', ' ')}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Currency
//                 </label>
//                 <select
//                   name="currency"
//                   value={form.currency}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="INR">🇮🇳 INR — Indian Rupee</option>
//                   <option value="USD">🇺🇸 USD — US Dollar</option>
//                   <option value="EUR">🇪🇺 EUR — Euro</option>
//                   <option value="GBP">🇬🇧 GBP — British Pound</option>
//                 </select>
//               </div>

//               <div className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   name="isDefault"
//                   id="isDefault"
//                   checked={form.isDefault}
//                   onChange={handleChange}
//                   className="w-4 h-4 text-blue-600"
//                 />
//                 <label htmlFor="isDefault" className="text-sm text-gray-700">
//                   Set as default account
//                 </label>
//               </div>

//               <div className="flex gap-3 pt-2">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2 rounded-xl hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-xl transition-colors"
//                 >
//                   {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }



import { useState, useEffect } from 'react'
import { accountApi } from '../api/accountApi'
import { useTheme } from '../context/ThemeContext'
import { card, text, subtext, input, select, btn, modal } from '../utils/cn'
import toast from 'react-hot-toast'
import {
  MdAccountBalance, MdSavings, MdCreditCard,
  MdTrendingUp, MdMoney, MdWallet, MdAdd,
  MdEdit, MdDelete, MdClose, MdCheck
} from 'react-icons/md'

const ACCOUNT_TYPES = ['CHECKING','SAVINGS','CREDIT_CARD','INVESTMENT','CASH','OTHER']

const TYPE_CONFIG = {
  CHECKING:    { icon: MdAccountBalance, color: 'bg-blue-100 text-blue-600' },
  SAVINGS:     { icon: MdSavings,        color: 'bg-green-100 text-green-600' },
  CREDIT_CARD: { icon: MdCreditCard,     color: 'bg-red-100 text-red-600' },
  INVESTMENT:  { icon: MdTrendingUp,     color: 'bg-purple-100 text-purple-600' },
  CASH:        { icon: MdMoney,          color: 'bg-yellow-100 text-yellow-600' },
  OTHER:       { icon: MdWallet,         color: 'bg-gray-100 text-gray-600' },
}

const emptyForm = { name: '', type: 'SAVINGS', currency: 'INR', isDefault: false }

export default function AccountsPage() {
  const { dark } = useTheme()
  const [accounts, setAccounts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(emptyForm)
  const [saving, setSaving]       = useState(false)

  useEffect(() => { fetchAccounts() }, [])

  const fetchAccounts = async () => {
    try {
      const res = await accountApi.getAll()
      setAccounts(res.data)
    } catch { toast.error('Failed to load accounts') }
    finally { setLoading(false) }
  }

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true) }
  const openEdit   = (a)  => {
    setEditing(a)
    setForm({ name: a.name, type: a.type, currency: a.currency, isDefault: a.isDefault })
    setShowModal(true)
  }
  const closeModal = () => { setShowModal(false); setEditing(null) }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      editing
        ? await accountApi.update(editing.id, form)
        : await accountApi.create(form)
      toast.success(editing ? 'Account updated!' : 'Account created!')
      closeModal(); fetchAccounts()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong')
    } finally { setSaving(false) }
  }

  const handleDelete = async (a) => {
    if (!confirm(`Delete "${a.name}"?`)) return
    try {
      await accountApi.delete(a.id)
      toast.success('Account deleted')
      fetchAccounts()
    } catch { toast.error('Failed to delete') }
  }

  const netWorth = accounts.reduce((s, a) => s + Number(a.balance), 0)

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className={subtext(dark)}>Loading accounts...</p>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${text(dark)}`}>Accounts</h1>
          <p className={`text-sm mt-1 ${subtext(dark)}`}>
            Net Worth:
            <span className={`font-semibold ml-1 ${netWorth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ₹{netWorth.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </p>
        </div>
        <button onClick={openCreate}
          className={`${btn.primary} flex items-center gap-2 px-4 py-2 text-sm`}>
          <MdAdd className="text-base" /> Add Account
        </button>
      </div>

      {/* Empty */}
      {accounts.length === 0 && (
        <div className={`text-center py-20 ${subtext(dark)}`}>
          <MdAccountBalance className="text-5xl mx-auto mb-3 opacity-30" />
          <p className="font-medium">No accounts yet</p>
          <p className="text-sm mt-1">Click "Add Account" to get started</p>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {accounts.map((account) => {
          const cfg = TYPE_CONFIG[account.type] || TYPE_CONFIG.OTHER
          const Icon = cfg.icon
          return (
            <div key={account.id} className={`${card(dark)} p-5 hover:shadow-md transition-shadow`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.color}`}>
                    <Icon className="text-xl" />
                  </div>
                  <div>
                    <p className={`font-semibold ${text(dark)}`}>{account.name}</p>
                    <p className={`text-xs capitalize ${subtext(dark)}`}>
                      {account.type.replace('_', ' ')}
                      {account.default && (
                        <span className="ml-2 bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded text-xs">
                          Default
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(account)}
                    className={`p-1.5 rounded-lg transition-colors ${dark ? 'text-gray-500 hover:text-blue-400 hover:bg-gray-800' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}>
                    <MdEdit className="text-base" />
                  </button>
                  <button onClick={() => handleDelete(account)}
                    className={`p-1.5 rounded-lg transition-colors ${dark ? 'text-gray-500 hover:text-red-400 hover:bg-gray-800' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}>
                    <MdDelete className="text-base" />
                  </button>
                </div>
              </div>
              <div>
                <p className={`text-xs mb-1 ${subtext(dark)}`}>Balance</p>
                <p className={`text-2xl font-bold ${Number(account.balance) >= 0 ? text(dark) : 'text-red-500'}`}>
                  ₹{Number(account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className={`${modal(dark)} w-full max-w-md p-6`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${text(dark)}`}>
                {editing ? 'Edit Account' : 'New Account'}
              </h2>
              <button onClick={closeModal}
                className={`p-1.5 rounded-lg ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}>
                <MdClose className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${text(dark)}`}>Account Name</label>
                <input type="text" name="name" value={form.name}
                  onChange={handleChange} required placeholder="e.g. SBI Savings"
                  className={`w-full ${input(dark)}`} />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${text(dark)}`}>Account Type</label>
                <select name="type" value={form.type} onChange={handleChange}
                  className={`w-full ${select(dark)}`}>
                  {ACCOUNT_TYPES.map(t => (
                    <option key={t} value={t}>{t.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${text(dark)}`}>Currency</label>
                <select name="currency" value={form.currency} onChange={handleChange}
                  className={`w-full ${select(dark)}`}>
                  <option value="INR">INR — Indian Rupee</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="isDefault" id="isDefault"
                  checked={form.isDefault} onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded" />
                <label htmlFor="isDefault" className={`text-sm ${text(dark)}`}>
                  Set as default account
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className={`flex-1 py-2 text-sm font-medium ${btn.secondary(dark)}`}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className={`flex-1 py-2 text-sm ${btn.primary} disabled:opacity-50 flex items-center justify-center gap-2`}>
                  {saving ? 'Saving...' : (
                    <><MdCheck className="text-base" />{editing ? 'Update' : 'Create'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}