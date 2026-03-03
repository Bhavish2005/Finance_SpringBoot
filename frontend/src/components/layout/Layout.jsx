import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useState } from 'react'
import {
  MdDashboard, MdAccountBalance, MdCreditCard,
  MdRepeat, MdTrackChanges, MdStar, MdFavorite,
  MdDocumentScanner, MdUpload, MdLogout,
  MdMenu, MdChevronLeft, MdDarkMode, MdLightMode,
  MdChevronRight
} from 'react-icons/md'

const navItems = [
  { to: '/dashboard',    label: 'Dashboard',    icon: MdDashboard },
  { to: '/accounts',     label: 'Accounts',     icon: MdAccountBalance },
  { to: '/transactions', label: 'Transactions', icon: MdCreditCard },
  { to: '/recurring',    label: 'Recurring',    icon: MdRepeat },
  { to: '/budget',       label: 'Budget',       icon: MdTrackChanges },
  { to: '/goals',        label: 'Goals',        icon: MdStar },
  { to: '/health-score', label: 'Health Score', icon: MdFavorite },
  { to: '/import',       label: 'Import',       icon: MdUpload },
  { to: '/scan-receipt', label: 'Scan Receipt', icon: MdDocumentScanner },
]

export default function Layout() {
  const { user, logout }           = useAuth()
  const { dark, toggle }           = useTheme()
  const navigate                    = useNavigate()
  const [collapsed, setCollapsed]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  const sb = dark
    ? { bg: 'bg-[#0D0D0D]', border: 'border-[#1C1C1C]', hover: 'hover:bg-[#181818]', muted: 'text-[#3A3A3A]', label: 'text-[#555]', active: 'bg-[#1E1E1E] text-white', inactive: 'text-[#555] hover:text-[#CCC] hover:bg-[#181818]' }
    : { bg: 'bg-white',     border: 'border-[#EBEBEB]', hover: 'hover:bg-[#F5F5F5]', muted: 'text-[#D0D0D0]', label: 'text-[#AAA]', active: 'bg-[#111] text-white',       inactive: 'text-[#999] hover:text-[#111] hover:bg-[#F2F2F2]' }

  return (
    <div className={`flex h-screen overflow-hidden ${dark ? 'bg-[#0A0A0A]' : 'bg-[#F5F5F5]'}`}>

      
      <aside className={`
        hidden lg:flex flex-col flex-shrink-0 border-r overflow-hidden
        transition-all duration-200 ease-in-out
        ${sb.bg} ${sb.border}
        ${collapsed ? 'w-[52px]' : 'w-[220px]'}
      `}>

        
        <div className={`flex items-center h-14 border-b flex-shrink-0 ${sb.border}
          ${collapsed ? 'justify-center px-0' : 'px-4 gap-2'}`}>
          {collapsed ? (
            <button onClick={() => setCollapsed(false)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${sb.hover} ${sb.label}`}>
              <MdChevronRight className="text-lg" />
            </button>
          ) : (
            <>
              <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${dark ? 'bg-white' : 'bg-[#111]'}`}>
                <MdAccountBalance className={`text-xs ${dark ? 'text-[#111]' : 'text-white'}`} />
              </div>
              <span className={`font-semibold text-[13px] flex-1 truncate ${dark ? 'text-[#FAFAFA]' : 'text-[#111]'}`}>
                FinanceVUE
              </span>
              <button onClick={() => setCollapsed(true)}
                className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors flex-shrink-0 ${sb.hover} ${sb.label}`}>
                <MdChevronLeft className="text-base" />
              </button>
            </>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2">
          {!collapsed && (
            <p className={`px-4 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest ${sb.label}`}>
              Navigation
            </p>
          )}
          <div className={`flex flex-col gap-0.5 ${collapsed ? 'items-center px-1.5' : 'px-2'}`}>
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} title={collapsed ? label : undefined}
                className={({ isActive }) =>
                  `group relative flex items-center rounded-lg text-[13px] font-medium transition-all
                  ${collapsed ? 'w-8 h-8 justify-center' : 'gap-2.5 px-3 py-2'}
                  ${isActive ? sb.active : sb.inactive}`
                }>
                {({ isActive }) => (
                  <>
                    <Icon className="text-[17px] flex-shrink-0" />
                    {!collapsed && <span className="truncate">{label}</span>}
                    {collapsed && (
                      <span className={`
                        absolute left-full ml-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                        whitespace-nowrap pointer-events-none z-[999]
                        opacity-0 group-hover:opacity-100 transition-opacity
                        shadow-lg
                        ${dark ? 'bg-[#222] text-white border border-[#333]' : 'bg-[#111] text-white'}
                      `}>
                        {label}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom */}
        <div className={`border-t flex-shrink-0 py-2 ${sb.border}
          ${collapsed ? 'flex flex-col items-center gap-1 px-1.5' : 'px-2 space-y-0.5'}`}>

          {/* Theme toggle */}
          <button onClick={toggle} title={collapsed ? (dark ? 'Light Mode' : 'Dark Mode') : undefined}
            className={`flex items-center rounded-lg transition-colors
              ${collapsed ? 'w-8 h-8 justify-center' : 'w-full gap-2.5 px-3 py-2 text-[13px] font-medium'}
              ${sb.inactive}`}>
            {dark
              ? <MdLightMode className="text-[17px] flex-shrink-0" />
              : <MdDarkMode  className="text-[17px] flex-shrink-0" />
            }
            {!collapsed && (dark ? 'Light Mode' : 'Dark Mode')}
          </button>

          {/* User */}
          {!collapsed ? (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mx-0
              ${dark ? 'bg-[#141414]' : 'bg-[#F5F5F5]'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0
                ${dark ? 'bg-[#2A2A2A] text-[#CCC]' : 'bg-[#111] text-white'}`}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className={`text-[11px] font-semibold truncate ${dark ? 'text-[#CCC]' : 'text-[#222]'}`}>
                  {user?.name}
                </p>
                <p className={`text-[10px] truncate ${sb.label}`}>{user?.email}</p>
              </div>
              <button onClick={handleLogout} title="Sign out"
                className={`flex-shrink-0 transition-colors ${dark ? 'text-[#3A3A3A] hover:text-red-400' : 'text-[#CCC] hover:text-red-500'}`}>
                <MdLogout className="text-sm" />
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} title="Sign out"
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors
                ${dark ? 'text-[#3A3A3A] hover:text-red-400 hover:bg-[#181818]' : 'text-[#CCC] hover:text-red-500 hover:bg-[#F5F5F5]'}`}>
              <MdLogout className="text-[17px]" />
            </button>
          )}
        </div>
      </aside>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Mobile Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[220px] flex flex-col border-r
        transform transition-transform duration-200 lg:hidden
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        ${sb.bg} ${sb.border}
      `}>
        <div className={`flex items-center gap-2 px-4 h-14 border-b flex-shrink-0 ${sb.border}`}>
          <div className={`w-6 h-6 rounded-md flex items-center justify-center ${dark ? 'bg-white' : 'bg-[#111]'}`}>
            <MdAccountBalance className={`text-xs ${dark ? 'text-[#111]' : 'text-white'}`} />
          </div>
          <span className={`font-semibold text-[13px] flex-1 ${dark ? 'text-[#FAFAFA]' : 'text-[#111]'}`}>PocketTrack</span>
          <button onClick={() => setMobileOpen(false)}
            className={`w-6 h-6 flex items-center justify-center rounded-md ${sb.hover} ${sb.label}`}>
            <MdChevronLeft className="text-base" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2">
          <div className="flex flex-col gap-0.5">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all
                  ${isActive ? sb.active : sb.inactive}`
                }>
                {({ isActive }) => (
                  <><Icon className="text-[17px] flex-shrink-0" /><span>{label}</span></>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
        <div className={`border-t px-2 py-2 flex-shrink-0 ${sb.border}`}>
          <button onClick={toggle}
            className={`flex items-center gap-2.5 px-3 py-2 w-full rounded-lg text-[13px] font-medium transition-all ${sb.inactive}`}>
            {dark ? <MdLightMode className="text-[17px]" /> : <MdDarkMode className="text-[17px]" />}
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile topbar */}
        <header className={`lg:hidden flex items-center gap-3 px-4 h-14 border-b flex-shrink-0
          ${dark ? 'bg-[#0D0D0D] border-[#1C1C1C]' : 'bg-white border-[#EBEBEB]'}`}>
          <button onClick={() => setMobileOpen(true)}
            className={`p-1.5 rounded-md transition-colors ${sb.hover} ${sb.label}`}>
            <MdMenu className="text-lg" />
          </button>
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-md flex items-center justify-center ${dark ? 'bg-white' : 'bg-[#111]'}`}>
              <MdAccountBalance className={`text-xs ${dark ? 'text-[#111]' : 'text-white'}`} />
            </div>
            <span className={`font-semibold text-sm ${dark ? 'text-white' : 'text-[#111]'}`}>PocketTrack</span>
          </div>
          <button onClick={toggle}
            className={`ml-auto p-1.5 rounded-md transition-colors ${sb.hover} ${sb.label}`}>
            {dark ? <MdLightMode className="text-base" /> : <MdDarkMode className="text-base" />}
          </button>
        </header>

        <main className={`flex-1 overflow-y-auto overflow-x-hidden p-5 lg:p-6 ${dark ? 'bg-[#0A0A0A]' : 'bg-[#F5F5F5]'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}