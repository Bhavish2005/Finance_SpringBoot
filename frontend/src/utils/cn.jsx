// Utility to build dark-mode aware class strings easily
export const card   = (dark) => dark
  ? 'bg-gray-900 border-gray-800 border rounded-2xl'
  : 'bg-white border-gray-200 border rounded-2xl'

export const text   = (dark) => dark ? 'text-white'    : 'text-gray-900'
export const subtext= (dark) => dark ? 'text-gray-400' : 'text-gray-500'
export const input  = (dark) => dark
  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  : 'bg-white border-gray-300 text-gray-900 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

export const select = (dark) => dark
  ? 'bg-gray-800 border-gray-700 text-white border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  : 'bg-white border-gray-300 text-gray-900 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

export const btn = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors',
  secondary: (dark) => dark
    ? 'border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-xl transition-colors'
    : 'border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors',
  danger: 'bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors',
}

export const modal = (dark) => dark
  ? 'bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl'
  : 'bg-white rounded-2xl shadow-2xl'

export const table = {
  header: (dark) => dark ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500',
  row:    (dark) => dark ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-50 hover:bg-gray-50',
}