import { useState } from 'react'
import { transactionApi } from '../api/transactionApi'
import { accountApi } from '../api/accountApi'
import toast from 'react-hot-toast'
import { useEffect } from 'react'

export default function ReceiptScannerPage() {
  const [accounts, setAccounts]   = useState([])
  const [preview, setPreview]     = useState(null)
  const [file, setFile]           = useState(null)
  const [scanning, setScanning]   = useState(false)
  const [result, setResult]       = useState(null)
  const [saving, setSaving]       = useState(false)

  // Form state — pre-filled by AI
  const [form, setForm] = useState({
    accountId:   '',
    type:        'EXPENSE',
    amount:      '',
    category:    '',
    description: '',
    date:        '',
    isRecurring: false,
  })

  useEffect(() => {
    accountApi.getAll()
      .then(res => {
        setAccounts(res.data)
        if (res.data.length > 0) {
          setForm(f => ({ ...f, accountId: res.data[0].id }))
        }
      })
  }, [])

  const handleFileDrop = (e) => {
    e.preventDefault()
    const dropped = e.dataTransfer?.files[0] || e.target.files[0]
    if (!dropped) return
    if (!dropped.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }
    setFile(dropped)
    setPreview(URL.createObjectURL(dropped))
    setResult(null)
  }

  const handleScan = async () => {
    if (!file) return
    setScanning(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await transactionApi.scanReceipt(formData)
      const data = res.data

      setResult(data)

      // Pre-fill the form with AI extracted data
      setForm(f => ({
        ...f,
        amount:      data.amount      || '',
        category:    data.category    || 'Other',
        description: data.description || data.merchant || '',
        date:        data.date        || new Date().toISOString().split('T')[0],
      }))

      toast.success('Receipt scanned! Review and save below 👇')
    } catch (err) {
      toast.error('Failed to scan receipt. Try a clearer image.')
    } finally {
      setScanning(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await transactionApi.create({
        ...form,
        amount: parseFloat(form.amount),
      })
      toast.success('Transaction saved! ✅')
      // Reset
      setFile(null)
      setPreview(null)
      setResult(null)
      setForm(f => ({
        ...f,
        amount: '', category: '', description: '',
        date: new Date().toISOString().split('T')[0],
      }))
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const CATEGORIES = [
    'Food & Dining', 'Groceries', 'Transport', 'Shopping',
    'Entertainment', 'Healthcare', 'Utilities', 'Housing',
    'Education', 'Travel', 'Other'
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📷 Receipt Scanner</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload a receipt photo — AI will extract the details automatically
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-white"
        onClick={() => document.getElementById('fileInput').click()}
      >
        {preview ? (
          <img
            src={preview}
            alt="Receipt preview"
            className="max-h-64 mx-auto rounded-xl object-contain"
          />
        ) : (
          <div className="text-gray-400">
            <p className="text-4xl mb-3">📄</p>
            <p className="font-medium text-gray-600">
              Drop receipt image here or click to upload
            </p>
            <p className="text-sm mt-1">Supports JPG, PNG, WEBP</p>
          </div>
        )}
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileDrop}
        />
      </div>

      {/* Scan Button */}
      {file && !result && (
        <button
          onClick={handleScan}
          disabled={scanning}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {scanning ? '🔍 Scanning with AI...' : '🔍 Scan Receipt'}
        </button>
      )}

      {/* AI Result + Editable Form */}
      {result && (
        <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-green-500 text-xl">✅</span>
            <h2 className="text-base font-semibold text-gray-900">
              AI extracted — review and edit before saving
            </h2>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account
              </label>
              <select
                name="accountId"
                value={form.accountId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  step="0.01"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setResult(null); setFile(null); setPreview(null) }}
                className="flex-1 border border-gray-300 text-gray-700 text-sm py-2 rounded-xl hover:bg-gray-50"
              >
                Scan Another
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-xl"
              >
                {saving ? 'Saving...' : '✅ Save Transaction'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}