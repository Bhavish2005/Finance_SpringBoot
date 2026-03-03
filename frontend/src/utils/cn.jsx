// Design tokens — neutral, professional, developer-grade
export const card = (dark) => dark
  ? 'bg-[#141414] border border-[#262626] rounded-xl'
  : 'bg-white border border-[#E5E5E5] rounded-xl'

export const cardHover = (dark) => dark
  ? 'bg-[#141414] border border-[#262626] rounded-xl hover:border-[#404040] transition-colors'
  : 'bg-white border border-[#E5E5E5] rounded-xl hover:border-[#C0C0C0] transition-colors'

export const page = (dark) => dark ? 'bg-[#0A0A0A]' : 'bg-[#F7F7F7]'

export const text = (dark) => dark ? 'text-[#FAFAFA]'  : 'text-[#111111]'
export const textMuted = (dark) => dark ? 'text-[#666]'  : 'text-[#888]'
export const subtext = (dark) => dark ? 'text-[#555]' : 'text-[#999]'

export const divider = (dark) => dark ? 'border-[#1F1F1F]' : 'border-[#EBEBEB]'

export const input = (dark) => dark
  ? 'bg-[#141414] border border-[#2A2A2A] text-[#FAFAFA] placeholder-[#444] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#555] transition-colors'
  : 'bg-white border border-[#E0E0E0] text-[#111] placeholder-[#BBB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#999] transition-colors'

export const select = (dark) => dark
  ? 'bg-[#141414] border border-[#2A2A2A] text-[#FAFAFA] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#555] transition-colors'
  : 'bg-white border border-[#E0E0E0] text-[#111] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#999] transition-colors'

export const btn = {
  primary: 'bg-[#111] hover:bg-[#222] dark:bg-white dark:text-[#111] dark:hover:bg-[#F0F0F0] text-white text-sm font-medium rounded-lg transition-colors',
  primaryBlue: 'bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors',
  secondary: (dark) => dark
    ? 'border border-[#2A2A2A] text-[#AAA] hover:bg-[#1A1A1A] hover:border-[#444] rounded-lg transition-colors'
    : 'border border-[#E0E0E0] text-[#555] hover:bg-[#F5F5F5] hover:border-[#CCC] rounded-lg transition-colors',
  danger: 'border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors',
  dangerDark: (dark) => dark
    ? 'border border-red-900/40 text-red-400 hover:bg-red-950/30 rounded-lg transition-colors'
    : 'border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors',
}

export const modal = (dark) => dark
  ? 'bg-[#141414] border border-[#262626] rounded-2xl shadow-2xl'
  : 'bg-white border border-[#E5E5E5] rounded-2xl shadow-xl'

export const badge = {
  green:  (dark) => dark ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/50' : 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  red:    (dark) => dark ? 'bg-red-950/50 text-red-400 border border-red-900/50'             : 'bg-red-50 text-red-600 border border-red-100',
  blue:   (dark) => dark ? 'bg-blue-950/50 text-blue-400 border border-blue-900/50'          : 'bg-blue-50 text-blue-600 border border-blue-100',
  yellow: (dark) => dark ? 'bg-amber-950/50 text-amber-400 border border-amber-900/50'       : 'bg-amber-50 text-amber-700 border border-amber-100',
  gray:   (dark) => dark ? 'bg-[#1A1A1A] text-[#888] border border-[#2A2A2A]'               : 'bg-[#F5F5F5] text-[#666] border border-[#E5E5E5]',
}

export const iconBox = (dark) => dark
  ? 'bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg flex items-center justify-center'
  : 'bg-[#F5F5F5] border border-[#EBEBEB] rounded-lg flex items-center justify-center'

export const table = {
  header: (dark) => dark ? 'bg-[#111] text-[#555]' : 'bg-[#FAFAFA] text-[#999]',
  row:    (dark) => dark
    ? 'border-[#1A1A1A] hover:bg-[#141414] transition-colors'
    : 'border-[#F0F0F0] hover:bg-[#FAFAFA] transition-colors',
}