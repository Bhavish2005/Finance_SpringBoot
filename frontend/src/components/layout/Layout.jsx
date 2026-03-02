// // import { Outlet, NavLink, useNavigate } from 'react-router-dom'
// // import { useAuth } from '../../context/AuthContext'
// // import { useState } from 'react'

// // const navItems = [
// //   { to: '/dashboard',    label: 'Dashboard',    icon: '📊' },
// //   { to: '/accounts',     label: 'Accounts',     icon: '🏦' },
// //   { to: '/transactions', label: 'Transactions', icon: '💳' },
// //   { to: '/recurring',    label: 'Recurring',    icon: '🔁' },
// //   { to: '/budget',       label: 'Budget',       icon: '🎯' },
// //   { to: '/goals',        label: 'Goals',        icon: '⭐' },
// //   { to: '/health-score', label: 'Health Score',  icon: '💪' },
// //   { to: '/scan-receipt', label: 'Scan Receipt', icon: '📷' },
// // ]

// // export default function Layout() {
// //   const { user, logout } = useAuth()
// //   const navigate          = useNavigate()
// //   const [open, setOpen]   = useState(false)

// //   const handleLogout = () => {
// //     logout()
// //     navigate('/login')
// //   }

// //   return (
// //     <div className="flex h-screen bg-gray-50 overflow-hidden">

// //       {/* ---- Sidebar ---- */}
// //       <aside className={`
// //         fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
// //         flex flex-col transform transition-transform duration-200
// //         ${open ? 'translate-x-0' : '-translate-x-full'}
// //         lg:relative lg:translate-x-0
// //       `}>

// //         {/* Logo */}
// //         <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
// //           <span className="text-2xl">💰</span>
// //           <span className="text-lg font-bold text-gray-900">PocketTrack</span>
// //         </div>

// //         {/* Nav Links */}
// //         <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
// //           {navItems.map(({ to, label, icon }) => (
// //             <NavLink
// //               key={to}
// //               to={to}
// //               onClick={() => setOpen(false)}
// //               className={({ isActive }) =>
// //                 `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
// //                  ${isActive
// //                    ? 'bg-blue-50 text-blue-700'
// //                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
// //                  }`
// //               }
// //             >
// //               <span className="text-base">{icon}</span>
// //               {label}
// //             </NavLink>
// //           ))}
// //         </nav>

// //         {/* User Section */}
// //         <div className="p-4 border-t border-gray-100">
// //           <div className="flex items-center gap-3 mb-3">
// //             <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
// //               {user?.name?.[0]?.toUpperCase()}
// //             </div>
// //             <div className="min-w-0">
// //               <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
// //               <p className="text-xs text-gray-400 truncate">{user?.email}</p>
// //             </div>
// //           </div>
// //           <button
// //             onClick={handleLogout}
// //             className="w-full text-left text-sm text-gray-500 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
// //           >
// //             🚪 Sign out
// //           </button>
// //         </div>
// //       </aside>

// //       {/* Mobile overlay */}
// //       {open && (
// //         <div
// //           className="fixed inset-0 z-40 bg-black/30 lg:hidden"
// //           onClick={() => setOpen(false)}
// //         />
// //       )}

// //       {/* ---- Main content ---- */}
// //       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

// //         {/* Mobile topbar */}
// //         <header className="lg:hidden flex items-center gap-4 px-4 py-3 bg-white border-b border-gray-200">
// //           <button
// //             onClick={() => setOpen(true)}
// //             className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
// //           >
// //             ☰
// //           </button>
// //           <span className="font-bold text-gray-900">💰 PocketTrack</span>
// //         </header>

// //         {/* Page content */}
// //         <main className="flex-1 overflow-y-auto p-6">
// //           <Outlet />
// //         </main>
// //       </div>
// //     </div>
// //   )
// // }


// import { Outlet, NavLink, useNavigate } from 'react-router-dom'
// import { useAuth } from '../../context/AuthContext'
// import { useState } from 'react'
// import {
//   MdDashboard, MdAccountBalance, MdCreditCard,
//   MdRepeat, MdTrackChanges, MdStar, MdFavorite,
//   MdDocumentScanner, MdMenu, MdClose, MdLogout,
//   MdUpload
// } from 'react-icons/md'

// const navItems = [
//   { to: '/dashboard',    label: 'Dashboard',     icon: MdDashboard },
//   { to: '/accounts',     label: 'Accounts',      icon: MdAccountBalance },
//   { to: '/transactions', label: 'Transactions',  icon: MdCreditCard },
//   { to: '/recurring',    label: 'Recurring',     icon: MdRepeat },
//   { to: '/budget',       label: 'Budget',        icon: MdTrackChanges },
//   { to: '/goals',        label: 'Goals',         icon: MdStar },
//   { to: '/health-score', label: 'Health Score',  icon: MdFavorite },
//   { to: '/import',       label: 'Import CSV',    icon: MdUpload },
//   { to: '/scan-receipt', label: 'Scan Receipt',  icon: MdDocumentScanner },
// ]

// export default function Layout() {
//   const { user, logout } = useAuth()
//   const navigate          = useNavigate()
//   const [open, setOpen]   = useState(false)

//   const handleLogout = () => {
//     logout()
//     navigate('/login')
//   }

//   return (
//     <div className="flex h-screen bg-gray-50 overflow-hidden">

//       {/* Sidebar */}
//       <aside className={`
//         fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
//         flex flex-col transform transition-transform duration-200
//         ${open ? 'translate-x-0' : '-translate-x-full'}
//         lg:relative lg:translate-x-0
//       `}>

//         {/* Logo */}
//         <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
//           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
//             <MdAccountBalance className="text-white text-lg" />
//           </div>
//           <span className="text-lg font-bold text-gray-900">PocketTrack</span>
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
//           {navItems.map(({ to, label, icon: Icon }) => (
//             <NavLink
//               key={to}
//               to={to}
//               onClick={() => setOpen(false)}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
//                  ${isActive
//                    ? 'bg-blue-50 text-blue-700'
//                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
//                  }`
//               }
//             >
//               {({ isActive }) => (
//                 <>
//                   <Icon className={`text-lg ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
//                   {label}
//                 </>
//               )}
//             </NavLink>
//           ))}
//         </nav>

//         {/* User Section */}
//         <div className="p-4 border-t border-gray-100">
//           <div className="flex items-center gap-3 mb-3">
//             <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
//               {user?.name?.[0]?.toUpperCase()}
//             </div>
//             <div className="min-w-0">
//               <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
//               <p className="text-xs text-gray-400 truncate">{user?.email}</p>
//             </div>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-2 text-left text-sm text-gray-500 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
//           >
//             <MdLogout className="text-base" />
//             Sign out
//           </button>
//         </div>
//       </aside>

//       {/* Mobile overlay */}
//       {open && (
//         <div
//           className="fixed inset-0 z-40 bg-black/30 lg:hidden"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       {/* Main content */}
//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         <header className="lg:hidden flex items-center gap-4 px-4 py-3 bg-white border-b border-gray-200">
//           <button
//             onClick={() => setOpen(true)}
//             className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
//           >
//             <MdMenu className="text-xl" />
//           </button>
//           <span className="font-bold text-gray-900">PocketTrack</span>
//         </header>

//         <main className="flex-1 overflow-y-auto p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   )
// }

import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useState } from 'react'
import {
  MdDashboard, MdAccountBalance, MdCreditCard,
  MdRepeat, MdTrackChanges, MdStar, MdFavorite,
  MdDocumentScanner, MdUpload, MdLogout,
  MdMenu, MdChevronLeft, MdDarkMode, MdLightMode,
  MdKeyboardArrowRight
} from 'react-icons/md'

const navItems = [
  { to: '/dashboard',    label: 'Dashboard',     icon: MdDashboard },
  { to: '/accounts',     label: 'Accounts',      icon: MdAccountBalance },
  { to: '/transactions', label: 'Transactions',  icon: MdCreditCard },
  { to: '/recurring',    label: 'Recurring',     icon: MdRepeat },
  { to: '/budget',       label: 'Budget',        icon: MdTrackChanges },
  { to: '/goals',        label: 'Goals',         icon: MdStar },
  { to: '/health-score', label: 'Health Score',  icon: MdFavorite },
  { to: '/import',       label: 'Import CSV',    icon: MdUpload },
  { to: '/scan-receipt', label: 'Scan Receipt',  icon: MdDocumentScanner },
]

export default function Layout() {
  const { user, logout }    = useAuth()
  const { dark, toggle }    = useTheme()
  const navigate             = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={`flex h-screen overflow-hidden ${dark ? 'bg-gray-950' : 'bg-gray-50'}`}>

      {/* ---- Desktop Sidebar ---- */}
      <aside className={`
        hidden lg:flex flex-col border-r transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-64'}
        ${dark
          ? 'bg-gray-900 border-gray-800'
          : 'bg-white border-gray-200'}
      `}>

        {/* Logo + Collapse button */}
        <div className={`flex items-center border-b h-16 px-3
          ${dark ? 'border-gray-800' : 'border-gray-100'}
          ${collapsed ? 'justify-center' : 'justify-between px-4'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <MdAccountBalance className="text-white text-sm" />
              </div>
              <span className={`font-bold text-base ${dark ? 'text-white' : 'text-gray-900'}`}>
                PocketTrack
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className={`p-1.5 rounded-lg transition-colors flex-shrink-0
              ${dark
                ? 'hover:bg-gray-800 text-gray-400'
                : 'hover:bg-gray-100 text-gray-500'}`}
          >
            {collapsed
              ? <MdKeyboardArrowRight className="text-xl" />
              : <MdChevronLeft className="text-xl" />
            }
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className={({ isActive }) => `
                flex items-center rounded-xl text-sm font-medium
                transition-colors group relative
                ${collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'}
                ${isActive
                  ? 'bg-blue-600 text-white'
                  : dark
                    ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`text-lg flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                  {!collapsed && <span>{label}</span>}

                  {/* Tooltip when collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                      {label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className={`p-3 border-t space-y-1
          ${dark ? 'border-gray-800' : 'border-gray-100'}`}>

          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            title={collapsed ? (dark ? 'Light Mode' : 'Dark Mode') : undefined}
            className={`w-full flex items-center rounded-xl text-sm font-medium transition-colors
              ${collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'}
              ${dark
                ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
          >
            {dark
              ? <MdLightMode className="text-lg flex-shrink-0" />
              : <MdDarkMode  className="text-lg flex-shrink-0" />
            }
            {!collapsed && (
              <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
            )}
          </button>

          {/* User info + logout */}
          {!collapsed && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl
              ${dark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-semibold truncate
                  ${dark ? 'text-white' : 'text-gray-900'}`}>
                  {user?.name}
                </p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <MdLogout className="text-base" />
              </button>
            </div>
          )}

          {collapsed && (
            <button
              onClick={handleLogout}
              title="Sign out"
              className={`w-full flex justify-center px-2 py-2.5 rounded-xl transition-colors
                ${dark
                  ? 'text-gray-400 hover:bg-gray-800 hover:text-red-400'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-red-500'
                }`}
            >
              <MdLogout className="text-lg" />
            </button>
          )}
        </div>
      </aside>

      {/* ---- Mobile Sidebar ---- */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 flex flex-col
        transform transition-transform duration-200 lg:hidden
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        ${dark ? 'bg-gray-900 border-r border-gray-800' : 'bg-white border-r border-gray-200'}
      `}>
        <div className={`flex items-center justify-between px-4 h-16 border-b
          ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <MdAccountBalance className="text-white text-sm" />
            </div>
            <span className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
              PocketTrack
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className={`p-1.5 rounded-lg ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <MdChevronLeft className="text-xl" />
          </button>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-blue-600 text-white'
                  : dark
                    ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`text-lg ${isActive ? 'text-white' : ''}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className={`p-3 border-t space-y-1 ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
          <button
            onClick={toggle}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
              ${dark
                ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
          >
            {dark ? <MdLightMode className="text-lg" /> : <MdDarkMode className="text-lg" />}
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>

          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl
            ${dark ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-semibold truncate ${dark ? 'text-white' : 'text-gray-900'}`}>
                {user?.name}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500">
              <MdLogout className="text-base" />
            </button>
          </div>
        </div>
      </aside>

      {/* ---- Main Content ---- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile topbar */}
        <header className={`lg:hidden flex items-center gap-3 px-4 h-14 border-b flex-shrink-0
          ${dark
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'}`}>
          <button
            onClick={() => setMobileOpen(true)}
            className={`p-1.5 rounded-lg ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <MdMenu className="text-xl" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <MdAccountBalance className="text-white text-xs" />
            </div>
            <span className={`font-bold text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>
              PocketTrack
            </span>
          </div>
          <button
            onClick={toggle}
            className={`ml-auto p-1.5 rounded-lg ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {dark ? <MdLightMode className="text-lg" /> : <MdDarkMode className="text-lg" />}
          </button>
        </header>

        {/* Page content */}
        <main className={`flex-1 overflow-y-auto p-6
          ${dark ? 'bg-gray-950' : 'bg-gray-50'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}