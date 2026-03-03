// import { useState } from 'react'
// import { transactionApi } from '../api/transactionApi'
// import { accountApi } from '../api/accountApi'
// import toast from 'react-hot-toast'
// import { useEffect } from 'react'

// export default function ReceiptScannerPage() {
//   const [accounts, setAccounts]   = useState([])
//   const [preview, setPreview]     = useState(null)
//   const [file, setFile]           = useState(null)
//   const [scanning, setScanning]   = useState(false)
//   const [result, setResult]       = useState(null)
//   const [saving, setSaving]       = useState(false)

//   // Form state — pre-filled by AI
//   const [form, setForm] = useState({
//     accountId:   '',
//     type:        'EXPENSE',
//     amount:      '',
//     category:    '',
//     description: '',
//     date:        '',
//     isRecurring: false,
//   })

//   useEffect(() => {
//     accountApi.getAll()
//       .then(res => {
//         setAccounts(res.data)
//         if (res.data.length > 0) {
//           setForm(f => ({ ...f, accountId: res.data[0].id }))
//         }
//       })
//   }, [])

//   const handleFileDrop = (e) => {
//     e.preventDefault()
//     const dropped = e.dataTransfer?.files[0] || e.target.files[0]
//     if (!dropped) return
//     if (!dropped.type.startsWith('image/')) {
//       toast.error('Please upload an image file')
//       return
//     }
//     setFile(dropped)
//     setPreview(URL.createObjectURL(dropped))
//     setResult(null)
//   }

//   const handleScan = async () => {
//     if (!file) return
//     setScanning(true)
//     try {
//       const formData = new FormData()
//       formData.append('file', file)
//       const res = await transactionApi.scanReceipt(formData)
//       const data = res.data

//       setResult(data)

//       // Pre-fill the form with AI extracted data
//       setForm(f => ({
//         ...f,
//         amount:      data.amount      || '',
//         category:    data.category    || 'Other',
//         description: data.description || data.merchant || '',
//         date:        data.date        || new Date().toISOString().split('T')[0],
//       }))

//       toast.success('Receipt scanned! Review and save below 👇')
//     } catch (err) {
//       toast.error('Failed to scan receipt. Try a clearer image.')
//     } finally {
//       setScanning(false)
//     }
//   }

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target
//     setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
//   }

//   const handleSave = async (e) => {
//     e.preventDefault()
//     setSaving(true)
//     try {
//       await transactionApi.create({
//         ...form,
//         amount: parseFloat(form.amount),
//       })
//       toast.success('Transaction saved! ✅')
//       // Reset
//       setFile(null)
//       setPreview(null)
//       setResult(null)
//       setForm(f => ({
//         ...f,
//         amount: '', category: '', description: '',
//         date: new Date().toISOString().split('T')[0],
//       }))
//     } catch (err) {
//       toast.error(err.response?.data?.error || 'Failed to save')
//     } finally {
//       setSaving(false)
//     }
//   }

//   const CATEGORIES = [
//     'Food & Dining', 'Groceries', 'Transport', 'Shopping',
//     'Entertainment', 'Healthcare', 'Utilities', 'Housing',
//     'Education', 'Travel', 'Other'
//   ]

//   return (
//     <div className="max-w-2xl mx-auto">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">📷 Receipt Scanner</h1>
//         <p className="text-sm text-gray-500 mt-1">
//           Upload a receipt photo — AI will extract the details automatically
//         </p>
//       </div>

//       {/* Upload Area */}
//       <div
//         onDrop={handleFileDrop}
//         onDragOver={(e) => e.preventDefault()}
//         className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-white"
//         onClick={() => document.getElementById('fileInput').click()}
//       >
//         {preview ? (
//           <img
//             src={preview}
//             alt="Receipt preview"
//             className="max-h-64 mx-auto rounded-xl object-contain"
//           />
//         ) : (
//           <div className="text-gray-400">
//             <p className="text-4xl mb-3">📄</p>
//             <p className="font-medium text-gray-600">
//               Drop receipt image here or click to upload
//             </p>
//             <p className="text-sm mt-1">Supports JPG, PNG, WEBP</p>
//           </div>
//         )}
//         <input
//           id="fileInput"
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={handleFileDrop}
//         />
//       </div>

//       {/* Scan Button */}
//       {file && !result && (
//         <button
//           onClick={handleScan}
//           disabled={scanning}
//           className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
//         >
//           {scanning ? '🔍 Scanning with AI...' : '🔍 Scan Receipt'}
//         </button>
//       )}

//       {/* AI Result + Editable Form */}
//       {result && (
//         <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6">
//           <div className="flex items-center gap-2 mb-5">
//             <span className="text-green-500 text-xl">✅</span>
//             <h2 className="text-base font-semibold text-gray-900">
//               AI extracted — review and edit before saving
//             </h2>
//           </div>

//           <form onSubmit={handleSave} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Account
//               </label>
//               <select
//                 name="accountId"
//                 value={form.accountId}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 {accounts.map(a => (
//                   <option key={a.id} value={a.id}>{a.name}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Amount (₹)
//                 </label>
//                 <input
//                   type="number"
//                   name="amount"
//                   value={form.amount}
//                   onChange={handleChange}
//                   required
//                   step="0.01"
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Date
//                 </label>
//                 <input
//                   type="date"
//                   name="date"
//                   value={form.date}
//                   onChange={handleChange}
//                   required
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Category
//               </label>
//               <select
//                 name="category"
//                 value={form.category}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 {CATEGORIES.map(c => (
//                   <option key={c} value={c}>{c}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <input
//                 type="text"
//                 name="description"
//                 value={form.description}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div className="flex gap-3 pt-2">
//               <button
//                 type="button"
//                 onClick={() => { setResult(null); setFile(null); setPreview(null) }}
//                 className="flex-1 border border-gray-300 text-gray-700 text-sm py-2 rounded-xl hover:bg-gray-50"
//               >
//                 Scan Another
//               </button>
//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-xl"
//               >
//                 {saving ? 'Saving...' : '✅ Save Transaction'}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   )
// }



import { useState, useEffect } from 'react'
import { transactionApi } from '../api/transactionApi'
import { accountApi } from '../api/accountApi'
import { useTheme } from '../context/ThemeContext'
import { card, text, textMuted, subtext, input, select, btn, modal, iconBox, badge } from '../utils/cn'
import toast from 'react-hot-toast'
import {
  MdDocumentScanner, MdUpload, MdAutoAwesome,
  MdSave, MdRefresh, MdClose, MdImage,
  MdCheckCircle, MdArrowDownward, MdArrowUpward,
  MdSwapHoriz
} from 'react-icons/md'

const CATEGORIES = [
  'Salary','Freelance','Investment Returns','Food & Dining',
  'Groceries','Transport','Shopping','Entertainment',
  'Healthcare','Utilities','Housing','Education','Travel','Other'
]

export default function ReceiptScannerPage() {
  const { dark } = useTheme()
  const [accounts, setAccounts]   = useState([])
  const [file, setFile]           = useState(null)
  const [preview, setPreview]     = useState(null)
  const [scanning, setScanning]   = useState(false)
  const [saving, setSaving]       = useState(false)
  const [scanned, setScanned]     = useState(false)
  const [form, setForm] = useState({
    accountId: '', type: 'EXPENSE', amount: '',
    category: '', description: '',
    date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    accountApi.getAll().then(res => {
      setAccounts(res.data)
      if (res.data.length > 0)
        setForm(f => ({ ...f, accountId: res.data[0].id }))
    })
  }, [])

  const handleFile = (e) => {
    e.preventDefault()
    const f = e.dataTransfer?.files[0] || e.target.files[0]
    if (!f) return
    if (!f.type.startsWith('image/')) { toast.error('Please upload an image file'); return }
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setScanned(false)
  }

  const handleScan = async () => {
    if (!file) return
    setScanning(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await transactionApi.scanReceipt(fd)
      const d   = res.data
      setForm(f => ({
        ...f,
        amount:      d.amount      || '',
        category:    d.category    || 'Other',
        description: d.description || d.merchant || '',
        date:        d.date        || f.date,
        type:        'EXPENSE',
      }))
      setScanned(true)
      toast.success('Receipt scanned successfully!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to scan receipt')
    } finally {
      setScanning(false)
    }
  }

  const handleSave = async () => {
    if (!form.accountId || !form.amount) {
      toast.error('Please fill in account and amount')
      return
    }
    setSaving(true)
    try {
      await transactionApi.create({
        ...form,
        amount: parseFloat(form.amount),
        isRecurring: false,
      })
      toast.success('Transaction saved!')
      reset()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const reset = () => {
    setFile(null); setPreview(null)
    setScanned(false)
    setForm(f => ({
      ...f, amount: '', category: '', description: '',
      date: new Date().toISOString().split('T')[0], type: 'EXPENSE',
    }))
  }

  const bg    = dark ? 'bg-[#0A0A0A]' : 'bg-[#F7F7F7]'
  const lc    = dark ? 'text-[#FAFAFA]' : 'text-[#111]'
  const mc    = dark ? 'text-[#666]' : 'text-[#999]'

  return (
    <div className={`min-h-full ${bg}`}>
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className={`w-8 h-8 ${iconBox(dark)}`}>
            <MdDocumentScanner className={`text-base ${mc}`} />
          </div>
          <h1 className={`text-xl font-semibold ${lc}`}>Scan Receipt</h1>
        </div>
        <p className={`text-sm ml-11 ${mc}`}>
          Upload a receipt image — AI extracts the details automatically
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-5xl">

        {/* Left — upload */}
        <div className="space-y-4">

          {/* Drop zone */}
          <div
            onDrop={handleFile} onDragOver={e => e.preventDefault()}
            onClick={() => !preview && document.getElementById('receiptInput').click()}
            className={`relative rounded-xl border-2 border-dashed transition-all
              ${preview ? 'cursor-default' : 'cursor-pointer'}
              ${dark
                ? preview ? 'border-[#2A2A2A]' : 'border-[#2A2A2A] hover:border-[#444]'
                : preview ? 'border-[#E0E0E0]' : 'border-[#D0D0D0] hover:border-[#AAA]'
              }`}>

            {preview ? (
              <div className="relative">
                <img src={preview} alt="Receipt"
                  className="w-full h-72 object-contain rounded-xl p-2" />
                <button onClick={(e) => { e.stopPropagation(); reset() }}
                  className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center
                    ${dark ? 'bg-[#1A1A1A] text-[#888] hover:text-white border border-[#2A2A2A]'
                           : 'bg-white text-[#888] hover:text-[#111] border border-[#E0E0E0]'} shadow-sm`}>
                  <MdClose className="text-sm" />
                </button>
                {scanned && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 text-white">
                    <MdCheckCircle className="text-sm" />
                    Scanned
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className={`w-12 h-12 rounded-xl ${iconBox(dark)} mb-4 flex items-center justify-center`}>
                  <MdImage className={`text-2xl ${mc}`} />
                </div>
                <p className={`text-sm font-medium ${lc} mb-1`}>
                  Drop receipt image here
                </p>
                <p className={`text-xs ${mc}`}>or click to browse — JPG, PNG, WEBP</p>
              </div>
            )}

            <input id="receiptInput" type="file" accept="image/*"
              className="hidden" onChange={handleFile} />
          </div>

          {/* Scan button */}
          {file && !scanned && (
            <button onClick={handleScan} disabled={scanning}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all
                ${scanning ? 'opacity-60 cursor-wait' : ''}
                ${dark ? 'bg-white text-[#111] hover:bg-[#F0F0F0]' : 'bg-[#111] text-white hover:bg-[#222]'}`}>
              {scanning ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Scanning with AI...
                </>
              ) : (
                <>
                  <MdAutoAwesome className="text-base" />
                  Scan with AI
                </>
              )}
            </button>
          )}

          {scanned && (
            <button onClick={reset}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${dark ? 'border border-[#2A2A2A] text-[#666] hover:bg-[#141414]'
                       : 'border border-[#E0E0E0] text-[#888] hover:bg-[#F5F5F5]'}`}>
              <MdRefresh className="text-base" />
              Scan Another Receipt
            </button>
          )}
        </div>

        {/* Right — form */}
        <div className={`${card(dark)} p-5 space-y-4`}>
          <div className="flex items-center justify-between mb-1">
            <p className={`text-sm font-semibold ${lc}`}>Transaction Details</p>
            {scanned && (
              <span className={`text-xs px-2 py-1 rounded-md font-medium ${badge.green(dark)}`}>
                AI filled
              </span>
            )}
          </div>

          {/* Account */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${mc}`}>Account</label>
            <select value={form.accountId}
              onChange={e => setForm({ ...form, accountId: e.target.value })}
              className={`w-full ${select(dark)}`}>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${mc}`}>Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { t: 'EXPENSE',  icon: MdArrowUpward,   label: 'Expense'  },
                { t: 'INCOME',   icon: MdArrowDownward, label: 'Income'   },
                { t: 'TRANSFER', icon: MdSwapHoriz,     label: 'Transfer' },
              ].map(({ t, icon: Icon, label }) => (
                <button key={t} type="button"
                  onClick={() => setForm({ ...form, type: t })}
                  className={`py-2 rounded-lg text-xs font-medium border transition-colors flex items-center justify-center gap-1.5
                    ${form.type === t
                      ? dark
                        ? 'bg-white text-[#111] border-white'
                        : 'bg-[#111] text-white border-[#111]'
                      : dark
                        ? 'border-[#2A2A2A] text-[#555] hover:border-[#444] hover:text-[#888]'
                        : 'border-[#E0E0E0] text-[#888] hover:border-[#CCC] hover:text-[#555]'
                    }`}>
                  <Icon className="text-sm" />{label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${mc}`}>Amount (₹)</label>
            <input type="number" value={form.amount} min="0.01" step="0.01"
              onChange={e => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00" className={`w-full ${input(dark)}`} />
          </div>

          {/* Category */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${mc}`}>Category</label>
            <select value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className={`w-full ${select(dark)}`}>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${mc}`}>Description</label>
            <input type="text" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Optional note" className={`w-full ${input(dark)}`} />
          </div>

          {/* Date */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${mc}`}>Date</label>
            <input type="date" value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className={`w-full ${input(dark)}`} />
          </div>

          {/* Save */}
          <button onClick={handleSave}
            disabled={saving || !form.amount || !form.accountId}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40
              ${dark ? 'bg-white text-[#111] hover:bg-[#F0F0F0]' : 'bg-[#111] text-white hover:bg-[#222]'}`}>
            {saving ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : <MdSave className="text-base" />}
            {saving ? 'Saving...' : 'Save Transaction'}
          </button>
        </div>
      </div>
    </div>
  )
}