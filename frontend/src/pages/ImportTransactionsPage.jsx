import { useState, useEffect } from 'react'
import { transactionApi } from '../api/transactionApi'
import { accountApi } from '../api/accountApi'
import toast from 'react-hot-toast'
import { MdUpload, MdCheckCircle, MdError, MdDownload } from 'react-icons/md'

export default function ImportTransactionsPage() {
  const [accounts, setAccounts]     = useState([])
  const [accountId, setAccountId]   = useState('')
  const [file, setFile]             = useState(null)
  const [importing, setImporting]   = useState(false)
  const [results, setResults]       = useState(null)

  useEffect(() => {
    accountApi.getAll().then(res => {
      setAccounts(res.data)
      if (res.data.length > 0) setAccountId(res.data[0].id)
    })
  }, [])

  const handleFileDrop = (e) => {
    e.preventDefault()
    const dropped = e.dataTransfer?.files[0] || e.target.files[0]
    if (!dropped) return
    const name = dropped.name.toLowerCase()
    if (!name.endsWith('.csv') && !name.endsWith('.xlsx') && !name.endsWith('.xls')) {
        toast.error('Please upload a CSV or Excel file')
        return
    }
    setFile(dropped)
    setResults(null)
}

  const handleImport = async () => {
    if (!file || !accountId) return
    setImporting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('accountId', accountId)
      const res = await transactionApi.importCsv(formData)
      setResults(res.data)
      if (res.data.success > 0) {
        toast.success(`${res.data.success} transactions imported!`)
      }
      if (res.data.failed > 0) {
        toast.error(`${res.data.failed} rows failed`)
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const csv = [
      'Date,Type,Category,Description,Amount',
      '2026-03-01,INCOME,Salary,Monthly salary,50000',
      '2026-03-02,EXPENSE,Food & Dining,Lunch at restaurant,450',
      '2026-03-03,EXPENSE,Transport,Uber ride,200',
      '2026-03-05,EXPENSE,Groceries,Big Basket order,1200',
      '2026-03-10,EXPENSE,Entertainment,Netflix subscription,649',
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href  = url
    link.setAttribute('download', 'pockettrack_import_template.csv')
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    toast.success('Template downloaded!')
  }

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Import Transactions
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload a CSV file to import multiple transactions at once
        </p>
      </div>

      {/* How it works */}
<div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6">
    <h2 className="font-semibold text-blue-900 mb-3">
        Supported File Formats
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
        <div>
            <p className="font-semibold mb-1">✅ Accepted columns</p>
            <p className="text-blue-700">Date, Description, Category,
               Amount <span className="text-blue-500">(or separate Debit / Credit columns)</span>,
               Type (optional)
            </p>
        </div>
        <div>
            <p className="font-semibold mb-1">✅ Smart detection</p>
            <p className="text-blue-700">
                Works with most bank statements — headers can be in
                any order, extra columns are ignored automatically.
            </p>
        </div>
    </div>
</div>
      {/* CSV Format info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">
            Required CSV Format
          </h2>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors"
          >
            <MdDownload className="text-base" />
            Download Template
          </button>
        </div>

        {/* Column table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Column</th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Required</th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Format</th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { col: 'Date',        req: true,  fmt: 'yyyy-MM-dd or dd/MM/yyyy', ex: '2026-03-01' },
                { col: 'Type',        req: true,  fmt: 'INCOME / EXPENSE / TRANSFER', ex: 'EXPENSE' },
                { col: 'Category',    req: true,  fmt: 'Any category name',        ex: 'Groceries' },
                { col: 'Description', req: false, fmt: 'Any text',                 ex: 'Big Basket order' },
                { col: 'Amount',      req: true,  fmt: 'Number (no currency sign)', ex: '1200' },
              ].map(({ col, req, fmt, ex }) => (
                <tr key={col}>
                  <td className="px-4 py-2.5 font-medium text-gray-800">{col}</td>
                  <td className="px-4 py-2.5">
                    {req
                      ? <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Required</span>
                      : <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Optional</span>
                    }
                  </td>
                  <td className="px-4 py-2.5 text-gray-500 text-xs">{fmt}</td>
                  <td className="px-4 py-2.5 text-gray-700 font-mono text-xs">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account selector */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Import to Account
        </label>
        <select
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {accounts.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      {/* Upload area */}
      <div
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById('csvInput').click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors mb-4
          ${file
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 hover:border-blue-400 bg-white'
          }`}
      >
        {file ? (
          <div>
            <MdCheckCircle className="text-green-500 text-4xl mx-auto mb-2" />
            <p className="font-semibold text-green-700">{file.name}</p>
            <p className="text-sm text-green-600 mt-1">
              {(file.size / 1024).toFixed(1)} KB — Ready to import
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null); setResults(null) }}
              className="mt-3 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Remove file
            </button>
          </div>
        ) : (
          <div>
            <MdUpload className="text-gray-400 text-4xl mx-auto mb-2" />
            <p className="font-medium text-gray-600">
              Drop your CSV here or click to browse
            </p>
            <p className="text-sm text-gray-400 mt-1">
    CSV (.csv) or Excel (.xlsx) files accepted
</p>
          </div>
        )}
        <input
  id="csvInput"
  type="file"
  accept=".csv,.xlsx,.xls"
  className="hidden"
  onChange={handleFileDrop}
/>
      </div>

      {/* Import button */}
      {file && !results && (
        <button
          onClick={handleImport}
          disabled={importing || !accountId}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <MdUpload className="text-lg" />
          {importing ? 'Importing...' : 'Import Transactions'}
        </button>
      )}

      {/* Results */}
      {results && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

          {/* Summary */}
          <div className="flex items-center gap-6 p-5 border-b border-gray-100 bg-gray-50">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{results.total}</p>
              <p className="text-xs text-gray-500">Total Rows</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{results.success}</p>
              <p className="text-xs text-gray-500">Imported</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">{results.failed}</p>
              <p className="text-xs text-gray-500">Failed</p>
            </div>
            <button
              onClick={() => { setFile(null); setResults(null) }}
              className="ml-auto text-sm border border-gray-300 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50"
            >
              Import Another
            </button>
          </div>

          {/* Row results */}
          <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
            {results.results.map((r, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                {r.status === 'success'
                  ? <MdCheckCircle className="text-green-500 text-lg flex-shrink-0" />
                  : <MdError className="text-red-500 text-lg flex-shrink-0" />
                }
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">
                    Row {r.row} —{' '}
                    {r.status === 'success'
                      ? <span className="text-green-600">
                          {r.desc || 'Transaction'} ₹{r.amount}
                        </span>
                      : <span className="text-red-600">{r.reason}</span>
                    }
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0
                  ${r.status === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                  }`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}