// import { useState, useEffect } from 'react'
// import { transactionApi } from '../api/transactionApi'
// import { accountApi } from '../api/accountApi'
// import toast from 'react-hot-toast'

// const CATEGORIES = [
//   'Salary', 'Freelance', 'Investment Returns',
//   'Food & Dining', 'Groceries', 'Transport', 'Shopping',
//   'Entertainment', 'Healthcare', 'Utilities', 'Housing',
//   'Education', 'Travel', 'Other'
// ]

// const TYPE_COLORS = {
//   INCOME:   'bg-green-100 text-green-700',
//   EXPENSE:  'bg-red-100 text-red-700',
//   TRANSFER: 'bg-blue-100 text-blue-700',
// }

// const emptyForm = {
//   accountId:   '',
//   type:        'EXPENSE',
//   amount:      '',
//   category:    'Food & Dining',
//   description: '',
//   date:        new Date().toISOString().split('T')[0],
//   isRecurring: false,
// }

// export default function TransactionsPage() {
//   const [transactions, setTransactions] = useState([])
//   const [accounts, setAccounts]         = useState([])
//   const [loading, setLoading]           = useState(true)
//   const [showModal, setShowModal]       = useState(false)
//   const [editing, setEditing]           = useState(null)
//   const [form, setForm]                 = useState(emptyForm)
//   const [saving, setSaving]             = useState(false)
//   const [totalPages, setTotalPages]     = useState(0)
//     const [searchMode, setSearchMode]   = useState(false)
// const [searchQuery, setSearchQuery] = useState('')
// const [searchResults, setSearchResults] = useState([])
// const [searching, setSearching]     = useState(false)
//   // Filters
//   const [filters, setFilters] = useState({
//     accountId: '',
//     type:      '',
//     category:  '',
//     from:      '',
//     to:        '',
//     page:      0,
//   })

//   useEffect(() => {
//     fetchAccounts()
//   }, [])

//   useEffect(() => {
//     fetchTransactions()
//   }, [filters])

//   const fetchAccounts = async () => {
//     try {
//       const res = await accountApi.getAll()
//       setAccounts(res.data)
//       // Set default accountId in form
//       if (res.data.length > 0) {
//         setForm(f => ({ ...f, accountId: res.data[0].id }))
//       }
//     } catch {
//       toast.error('Failed to load accounts')
//     }
//   }

//   const fetchTransactions = async () => {
//     setLoading(true)
//     try {
//       const params = {}
//       if (filters.accountId) params.accountId = filters.accountId
//       if (filters.type)      params.type      = filters.type
//       if (filters.category)  params.category  = filters.category
//       if (filters.from)      params.from      = filters.from
//       if (filters.to)        params.to        = filters.to
//       params.page = filters.page
//       params.size = 20

//       const res = await transactionApi.getAll(params)
//       setTransactions(res.data.content)
//       setTotalPages(res.data.totalPages)
//     } catch {
//       toast.error('Failed to load transactions')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const openCreate = () => {
//     setEditing(null)
//     setForm({
//       ...emptyForm,
//       accountId: accounts[0]?.id || '',
//       date: new Date().toISOString().split('T')[0],
//     })
//     setShowModal(true)
//   }

//   const openEdit = (tx) => {
//     setEditing(tx)
//     setForm({
//       accountId:   tx.accountId || accounts[0]?.id || '',
//       type:        tx.type,
//       amount:      tx.amount,
//       category:    tx.category,
//       description: tx.description || '',
//       date:        tx.date,
//       isRecurring: tx.recurring,
//     })
//     setShowModal(true)
//   }

//   const closeModal = () => {
//     setShowModal(false)
//     setEditing(null)
//   }

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target
//     setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
//   }

//   const handleFilterChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value, page: 0 })
//   }

//   const clearFilters = () => {
//     setFilters({ accountId: '', type: '', category: '', from: '', to: '', page: 0 })
//   }

//   const handleSearch = async (e) => {
//     e.preventDefault()
//     if (!searchQuery.trim()) {
//         setSearchMode(false)
//         return
//     }
//     setSearching(true)
//     setSearchMode(true)
//     try {
//         const res = await transactionApi.search(searchQuery)
//         setSearchResults(res.data.content)
//     } catch {
//         toast.error('Search failed')
//     } finally {
//         setSearching(false)
//     }
// }

// const clearSearch = () => {
//     setSearchQuery('')
//     setSearchMode(false)
//     setSearchResults([])
// }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setSaving(true)
//     try {
//       const payload = { ...form, amount: parseFloat(form.amount) }
//       if (editing) {
//         await transactionApi.update(editing.id, payload)
//         toast.success('Transaction updated!')
//       } else {
//         await transactionApi.create(payload)
//         toast.success('Transaction added!')
//       }
//       closeModal()
//       fetchTransactions()
//       fetchAccounts() // refresh balances
//     } catch (err) {
//       toast.error(err.response?.data?.error || 'Something went wrong')
//     } finally {
//       setSaving(false)
//     }
//   }

//   const handleDelete = async (tx) => {
//     if (!confirm('Delete this transaction?')) return
//     try {
//       await transactionApi.delete(tx.id)
//       toast.success('Transaction deleted')
//       fetchTransactions()
//       fetchAccounts()
//     } catch {
//       toast.error('Failed to delete')
//     }
//   }
//   const handleExport = async () => {
//     try {
//         const res = await transactionApi.exportCsv(
//             filters.from || null,
//             filters.to   || null
//         )

//         // Create a download link and click it programmatically
//         const url  = window.URL.createObjectURL(new Blob([res.data]))
//         const link = document.createElement('a')
//         link.href  = url
//         link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`)
//         document.body.appendChild(link)
//         link.click()
//         link.remove()
//         window.URL.revokeObjectURL(url)

//         toast.success('CSV downloaded!')
//     } catch {
//         toast.error('Export failed')
//     }
// }

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
//         <div className="flex gap-2">
//         <button
//             onClick={handleExport}
//             className="border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
//         >
//             ⬇️ Export CSV
//         </button>
//         <button
//             onClick={openCreate}
//             disabled={accounts.length === 0}
//             className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
//         >
//             + Add Transaction
//         </button>
//     </div>
//       </div>

//       {/* No accounts warning */}
//       {accounts.length === 0 && (
//         <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl p-4 mb-4 text-sm">
//           ⚠️ You need to create an account first before adding transactions.
//         </div>
//       )}

//         {/* Search Bar */}
// <form onSubmit={handleSearch} className="flex gap-2 mb-4">
//     <div className="relative flex-1">
//         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//             🔍
//         </span>
//         <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search by description or category..."
//             className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//     </div>
//     <button
//         type="submit"
//         className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl"
//     >
//         Search
//     </button>
//     {searchMode && (
//         <button
//             type="button"
//             onClick={clearSearch}
//             className="border border-gray-300 text-gray-600 text-sm px-4 py-2 rounded-xl hover:bg-gray-50"
//         >
//             ✕ Clear
//         </button>
//     )}
// </form>            
//       {/* Filters */}
//       <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
//         <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
//           <select
//             name="accountId"
//             value={filters.accountId}
//             onChange={handleFilterChange}
//             className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Accounts</option>
//             {accounts.map(a => (
//               <option key={a.id} value={a.id}>{a.name}</option>
//             ))}
//           </select>

//           <select
//             name="type"
//             value={filters.type}
//             onChange={handleFilterChange}
//             className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Types</option>
//             <option value="INCOME">Income</option>
//             <option value="EXPENSE">Expense</option>
//             <option value="TRANSFER">Transfer</option>
//           </select>

//           <select
//             name="category"
//             value={filters.category}
//             onChange={handleFilterChange}
//             className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Categories</option>
//             {CATEGORIES.map(c => (
//               <option key={c} value={c}>{c}</option>
//             ))}
//           </select>

//           <input
//             type="date"
//             name="from"
//             value={filters.from}
//             onChange={handleFilterChange}
//             className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           <input
//             type="date"
//             name="to"
//             value={filters.to}
//             onChange={handleFilterChange}
//             className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Clear filters */}
//         {(filters.accountId || filters.type || filters.category || filters.from || filters.to) && (
//           <button
//             onClick={clearFilters}
//             className="mt-3 text-xs text-blue-600 hover:underline"
//           >
//             ✕ Clear filters
//           </button>
//         )}
//       </div>

//       {/* Transactions Table */}
//       <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//         {loading ? (
//           <div className="flex items-center justify-center h-40">
//             <p className="text-gray-400 text-sm">Loading...</p>
//           </div>
//         ) : transactions.length === 0 ? (
//           <div className="text-center py-16 text-gray-400">
//             <p className="text-3xl mb-2">💳</p>
//             <p className="font-medium">No transactions found</p>
//             <p className="text-sm mt-1">Try changing filters or add a new transaction</p>
//           </div>
//         ) : (

//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b border-gray-100 bg-gray-50">
//                 <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
//                 <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
//                 <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
//                 <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
//                 <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
//                 <th className="px-5 py-3"></th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {(searchMode ? searchResults : transactions).map((tx) =>  (
//                 <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{tx.date}</td>
//                   <td className="px-5 py-3 text-gray-800 font-medium">
//                     {tx.description || tx.category}
//                     {tx.recurring && (
//                       <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">
//                         🔁 Recurring
//                       </span>
//                     )}
//                   </td>
//                   <td className="px-5 py-3 text-gray-500">{tx.category}</td>
//                   <td className="px-5 py-3">
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${TYPE_COLORS[tx.type]}`}>
//                       {tx.type}
//                     </span>
//                   </td>
//                   <td className={`px-5 py-3 text-right font-semibold whitespace-nowrap
//                     ${tx.type === 'INCOME' ? 'text-green-600' : tx.type === 'EXPENSE' ? 'text-red-600' : 'text-blue-600'}`}>
//                     {tx.type === 'INCOME' ? '+' : '-'}
//                     ₹{Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                   </td>
//                   <td className="px-5 py-3">
//                     <div className="flex gap-2 justify-end">
//                       <button
//                         onClick={() => openEdit(tx)}
//                         className="text-gray-400 hover:text-blue-600 transition-colors"
//                       >✏️</button>
//                       <button
//                         onClick={() => handleDelete(tx)}
//                         className="text-gray-400 hover:text-red-600 transition-colors"
//                       >🗑️</button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-center gap-3 px-5 py-4 border-t border-gray-100">
//             <button
//               onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
//               disabled={filters.page === 0}
//               className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
//             >
//               ← Prev
//             </button>
//             <span className="text-sm text-gray-500">
//               Page {filters.page + 1} of {totalPages}
//             </span>
//             <button
//               onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
//               disabled={filters.page >= totalPages - 1}
//               className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
//             >
//               Next →
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
//             <h2 className="text-lg font-bold text-gray-900 mb-5">
//               {editing ? 'Edit Transaction' : 'New Transaction'}
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
//                 <select
//                   name="accountId"
//                   value={form.accountId}
//                   onChange={handleChange}
//                   required
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   {accounts.map(a => (
//                     <option key={a.id} value={a.id}>{a.name}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
//                 <div className="grid grid-cols-3 gap-2">
//                   {['INCOME', 'EXPENSE', 'TRANSFER'].map(t => (
//                     <button
//                       key={t}
//                       type="button"
//                       onClick={() => setForm({ ...form, type: t })}
//                       className={`py-2 rounded-lg text-sm font-medium border transition-colors
//                         ${form.type === t
//                           ? t === 'INCOME'   ? 'bg-green-500 text-white border-green-500'
//                           : t === 'EXPENSE'  ? 'bg-red-500 text-white border-red-500'
//                           : 'bg-blue-500 text-white border-blue-500'
//                           : 'border-gray-300 text-gray-600 hover:bg-gray-50'
//                         }`}
//                     >
//                       {t === 'INCOME' ? '💚' : t === 'EXPENSE' ? '❤️' : '💙'} {t}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
//                 <input
//                   type="number"
//                   name="amount"
//                   value={form.amount}
//                   onChange={handleChange}
//                   required
//                   min="0.01"
//                   step="0.01"
//                   placeholder="0.00"
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                 <select
//                   name="category"
//                   value={form.category}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   {CATEGORIES.map(c => (
//                     <option key={c} value={c}>{c}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                 <input
//                   type="text"
//                   name="description"
//                   value={form.description}
//                   onChange={handleChange}
//                   placeholder="Optional note"
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//                 <input
//                   type="date"
//                   name="date"
//                   value={form.date}
//                   onChange={handleChange}
//                   required
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   name="isRecurring"
//                   id="isRecurring"
//                   checked={form.isRecurring}
//                   onChange={handleChange}
//                   className="w-4 h-4 text-blue-600"
//                 />
//                 <label htmlFor="isRecurring" className="text-sm text-gray-700">
//                   🔁 Mark as recurring
//                 </label>
//               </div>

//               <div className="flex gap-3 pt-2">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2 rounded-xl hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-xl"
//                 >
//                   {saving ? 'Saving...' : editing ? 'Update' : 'Add'}
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
import { transactionApi } from '../api/transactionApi'
import { accountApi } from '../api/accountApi'
import { useTheme } from '../context/ThemeContext'
import { card, text, subtext, input, select, btn, modal, table } from '../utils/cn'
import toast from 'react-hot-toast'
import {
  MdAdd, MdEdit, MdDelete, MdClose, MdCheck,
  MdArrowDownward, MdArrowUpward, MdSwapHoriz,
  MdFilterList, MdDownload, MdSearch, MdRepeat,
  MdClearAll
} from 'react-icons/md'

const CATEGORIES = [
  'Salary','Freelance','Investment Returns','Food & Dining',
  'Groceries','Transport','Shopping','Entertainment',
  'Healthcare','Utilities','Housing','Education','Travel','Other'
]

const TYPE_CONFIG = {
  INCOME:   { icon: MdArrowDownward, color: 'text-green-500', bg: 'bg-green-100', badge: 'bg-green-100 text-green-700' },
  EXPENSE:  { icon: MdArrowUpward,   color: 'text-red-500',   bg: 'bg-red-100',   badge: 'bg-red-100 text-red-700' },
  TRANSFER: { icon: MdSwapHoriz,     color: 'text-blue-500',  bg: 'bg-blue-100',  badge: 'bg-blue-100 text-blue-700' },
}

const emptyForm = {
  accountId: '', type: 'EXPENSE', amount: '', category: 'Food & Dining',
  description: '', date: new Date().toISOString().split('T')[0], isRecurring: false,
}

export default function TransactionsPage() {
  const { dark } = useTheme()
  const [transactions, setTransactions] = useState([])
  const [accounts, setAccounts]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [showModal, setShowModal]       = useState(false)
  const [editing, setEditing]           = useState(null)
  const [form, setForm]                 = useState(emptyForm)
  const [saving, setSaving]             = useState(false)
  const [totalPages, setTotalPages]     = useState(0)
  const [searchQuery, setSearchQuery]   = useState('')
  const [searchMode, setSearchMode]     = useState(false)
  const [searchResults, setSearchResults] = useState([])

  const [filters, setFilters] = useState({
    accountId: '', type: '', category: '', from: '', to: '', page: 0,
  })

  useEffect(() => { fetchAccounts() }, [])
  useEffect(() => { if (!searchMode) fetchTransactions() }, [filters])

  const fetchAccounts = async () => {
    try {
      const res = await accountApi.getAll()
      setAccounts(res.data)
      if (res.data.length > 0)
        setForm(f => ({ ...f, accountId: res.data[0].id }))
    } catch { toast.error('Failed to load accounts') }
  }

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const params = { page: filters.page, size: 20 }
      if (filters.accountId) params.accountId = filters.accountId
      if (filters.type)      params.type      = filters.type
      if (filters.category)  params.category  = filters.category
      if (filters.from)      params.from      = filters.from
      if (filters.to)        params.to        = filters.to
      const res = await transactionApi.getAll(params)
      setTransactions(res.data.content)
      setTotalPages(res.data.totalPages)
    } catch { toast.error('Failed to load transactions') }
    finally { setLoading(false) }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) { setSearchMode(false); return }
    setLoading(true); setSearchMode(true)
    try {
      const res = await transactionApi.search(searchQuery)
      setSearchResults(res.data.content)
    } catch { toast.error('Search failed') }
    finally { setLoading(false) }
  }

  const clearSearch = () => { setSearchQuery(''); setSearchMode(false); setSearchResults([]) }

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, accountId: accounts[0]?.id || '', date: new Date().toISOString().split('T')[0] })
    setShowModal(true)
  }

  const openEdit = (tx) => {
    setEditing(tx)
    setForm({
      accountId: tx.accountId || accounts[0]?.id || '',
      type: tx.type, amount: tx.amount, category: tx.category,
      description: tx.description || '', date: tx.date, isRecurring: tx.recurring,
    })
    setShowModal(true)
  }

  const closeModal = () => { setShowModal(false); setEditing(null) }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 0 })
  }

  const clearFilters = () => {
    setFilters({ accountId: '', type: '', category: '', from: '', to: '', page: 0 })
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { ...form, amount: parseFloat(form.amount) }
      editing
        ? await transactionApi.update(editing.id, payload)
        : await transactionApi.create(payload)
      toast.success(editing ? 'Updated!' : 'Transaction added!')
      closeModal(); fetchTransactions(); fetchAccounts()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong')
    } finally { setSaving(false) }
  }

  const handleDelete = async (tx) => {
    if (!confirm('Delete this transaction?')) return
    try {
      await transactionApi.delete(tx.id)
      toast.success('Deleted')
      fetchTransactions(); fetchAccounts()
    } catch { toast.error('Failed to delete') }
  }

  const handleExport = async () => {
    try {
      const res = await transactionApi.exportCsv(filters.from || null, filters.to || null)
      const url  = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href  = url
      link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link); link.click(); link.remove()
      window.URL.revokeObjectURL(url)
      toast.success('CSV downloaded!')
    } catch { toast.error('Export failed') }
  }

  const displayTx = searchMode ? searchResults : transactions

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className={`text-2xl font-bold ${text(dark)}`}>Transactions</h1>
        <div className="flex gap-2">
          <button onClick={handleExport}
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl border transition-colors
              ${dark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
            <MdDownload className="text-base" /> Export
          </button>
          <button onClick={openCreate} disabled={accounts.length === 0}
            className={`${btn.primary} flex items-center gap-1.5 text-sm px-3 py-2 disabled:opacity-50`}>
            <MdAdd className="text-base" /> Add
          </button>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <MdSearch className={`absolute left-3 top-1/2 -translate-y-1/2 text-lg ${subtext(dark)}`} />
          <input type="text" value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by description or category..."
            className={`w-full pl-9 pr-4 py-2 ${input(dark)}`} />
        </div>
        <button type="submit"
          className={`${btn.primary} px-4 py-2 text-sm flex items-center gap-1`}>
          <MdSearch className="text-base" /> Search
        </button>
        {searchMode && (
          <button type="button" onClick={clearSearch}
            className={`flex items-center gap-1 text-sm px-3 py-2 rounded-xl border
              ${dark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
            <MdClearAll className="text-base" /> Clear
          </button>
        )}
      </form>

      {/* Filters */}
      {!searchMode && (
        <div className={`${card(dark)} p-4 mb-4`}>
          <div className="flex items-center gap-2 mb-3">
            <MdFilterList className={`text-base ${subtext(dark)}`} />
            <span className={`text-sm font-medium ${text(dark)}`}>Filters</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            <select name="accountId" value={filters.accountId}
              onChange={handleFilterChange} className={`${select(dark)}`}>
              <option value="">All Accounts</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <select name="type" value={filters.type}
              onChange={handleFilterChange} className={`${select(dark)}`}>
              <option value="">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
              <option value="TRANSFER">Transfer</option>
            </select>
            <select name="category" value={filters.category}
              onChange={handleFilterChange} className={`${select(dark)}`}>
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="date" name="from" value={filters.from}
              onChange={handleFilterChange} className={`${input(dark)}`} />
            <input type="date" name="to" value={filters.to}
              onChange={handleFilterChange} className={`${input(dark)}`} />
          </div>
          {(filters.accountId || filters.type || filters.category || filters.from || filters.to) && (
            <button onClick={clearFilters}
              className="mt-3 text-xs text-blue-500 hover:underline flex items-center gap-1">
              <MdClearAll className="text-sm" /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className={`${card(dark)} overflow-hidden`}>
        {searchMode && (
          <div className={`px-5 py-3 border-b text-sm
            ${dark ? 'bg-blue-950 border-blue-900 text-blue-300' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
            <MdSearch className="inline mr-1" />
            {displayTx.length} results for "{searchQuery}"
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <p className={`text-sm ${subtext(dark)}`}>Loading...</p>
          </div>
        ) : displayTx.length === 0 ? (
          <div className={`text-center py-16 ${subtext(dark)}`}>
            <MdCreditCard className="text-4xl mx-auto mb-2 opacity-30" />
            <p className="font-medium">No transactions found</p>
            <p className="text-sm mt-1">Try changing filters or add a new transaction</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${table.header(dark)} ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase">Description</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase">Type</th>
                <th className="text-right px-5 py-3 text-xs font-semibold uppercase">Amount</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className={`divide-y ${dark ? 'divide-gray-800' : 'divide-gray-50'}`}>
              {displayTx.map(tx => {
                const cfg = TYPE_CONFIG[tx.type]
                const Icon = cfg.icon
                return (
                  <tr key={tx.id} className={table.row(dark)}>
                    <td className={`px-5 py-3 whitespace-nowrap ${subtext(dark)}`}>{tx.date}</td>
                    <td className={`px-5 py-3 font-medium ${text(dark)}`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                          <Icon className={`text-sm ${cfg.color}`} />
                        </div>
                        <span className="truncate max-w-32">
                          {tx.description || tx.category}
                        </span>
                        {tx.recurring && (
                          <MdRepeat className="text-purple-500 text-sm flex-shrink-0" title="Recurring" />
                        )}
                      </div>
                    </td>
                    <td className={`px-5 py-3 hidden md:table-cell ${subtext(dark)}`}>{tx.category}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${cfg.badge}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`px-5 py-3 text-right font-semibold whitespace-nowrap
                      ${tx.type === 'INCOME' ? 'text-green-500' : tx.type === 'EXPENSE' ? 'text-red-500' : 'text-blue-500'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'}
                      ₹{Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => openEdit(tx)}
                          className={`p-1.5 rounded-lg transition-colors ${dark ? 'text-gray-500 hover:text-blue-400 hover:bg-gray-800' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}>
                          <MdEdit className="text-base" />
                        </button>
                        <button onClick={() => handleDelete(tx)}
                          className={`p-1.5 rounded-lg transition-colors ${dark ? 'text-gray-500 hover:text-red-400 hover:bg-gray-800' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}>
                          <MdDelete className="text-base" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!searchMode && totalPages > 1 && (
          <div className={`flex items-center justify-center gap-3 px-5 py-4 border-t
            ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
            <button
              onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
              disabled={filters.page === 0}
              className={`px-3 py-1.5 text-sm rounded-lg border disabled:opacity-40 transition-colors
                ${dark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}>
              ← Prev
            </button>
            <span className={`text-sm ${subtext(dark)}`}>
              Page {filters.page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
              disabled={filters.page >= totalPages - 1}
              className={`px-3 py-1.5 text-sm rounded-lg border disabled:opacity-40 transition-colors
                ${dark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}>
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className={`${modal(dark)} w-full max-w-md p-6 max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${text(dark)}`}>
                {editing ? 'Edit Transaction' : 'New Transaction'}
              </h2>
              <button onClick={closeModal}
                className={`p-1.5 rounded-lg ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}>
                <MdClose className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${text(dark)}`}>Account</label>
                <select name="accountId" value={form.accountId}
                  onChange={handleChange} required className={`w-full ${select(dark)}`}>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${text(dark)}`}>Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {['INCOME','EXPENSE','TRANSFER'].map(t => (
                    <button key={t} type="button"
                      onClick={() => setForm({ ...form, type: t })}
                      className={`py-2 rounded-xl text-sm font-medium border transition-colors
                        ${form.type === t
                          ? t === 'INCOME'   ? 'bg-green-500 text-white border-green-500'
                          : t === 'EXPENSE'  ? 'bg-red-500 text-white border-red-500'
                          : 'bg-blue-500 text-white border-blue-500'
                          : dark
                            ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}>
                      {t === 'INCOME'
                        ? <MdArrowDownward className="inline mr-1 text-sm" />
                        : t === 'EXPENSE'
                          ? <MdArrowUpward className="inline mr-1 text-sm" />
                          : <MdSwapHoriz className="inline mr-1 text-sm" />
                      }
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${text(dark)}`}>Amount (₹)</label>
                <input type="number" name="amount" value={form.amount}
                  onChange={handleChange} required min="0.01" step="0.01" placeholder="0.00"
                  className={`w-full ${input(dark)}`} />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${text(dark)}`}>Category</label>
                <select name="category" value={form.category}
                  onChange={handleChange} className={`w-full ${select(dark)}`}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${text(dark)}`}>Description</label>
                <input type="text" name="description" value={form.description}
                  onChange={handleChange} placeholder="Optional note"
                  className={`w-full ${input(dark)}`} />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${text(dark)}`}>Date</label>
                <input type="date" name="date" value={form.date}
                  onChange={handleChange} required className={`w-full ${input(dark)}`} />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" name="isRecurring" id="isRecurring"
                  checked={form.isRecurring} onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded" />
                <label htmlFor="isRecurring" className={`text-sm flex items-center gap-1 ${text(dark)}`}>
                  <MdRepeat className="text-purple-500" /> Mark as recurring
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className={`flex-1 py-2 text-sm font-medium ${btn.secondary(dark)}`}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className={`flex-1 py-2 text-sm ${btn.primary} disabled:opacity-50`}>
                  {saving ? 'Saving...' : editing ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}