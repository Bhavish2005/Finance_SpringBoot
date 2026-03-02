// import { Outlet, NavLink, useNavigate } from 'react-router-dom'
// import { useAuth } from '../../context/AuthContext'
// import { useState } from 'react'

// const navItems = [
//   { to: '/dashboard',    label: 'Dashboard',    icon: '📊' },
//   { to: '/accounts',     label: 'Accounts',     icon: '🏦' },
//   { to: '/transactions', label: 'Transactions', icon: '💳' },
//   { to: '/recurring',    label: 'Recurring',    icon: '🔁' },
//   { to: '/budget',       label: 'Budget',       icon: '🎯' },
//   { to: '/goals',        label: 'Goals',        icon: '⭐' },
//   { to: '/health-score', label: 'Health Score',  icon: '💪' },
//   { to: '/scan-receipt', label: 'Scan Receipt', icon: '📷' },
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

//       {/* ---- Sidebar ---- */}
//       <aside className={`
//         fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
//         flex flex-col transform transition-transform duration-200
//         ${open ? 'translate-x-0' : '-translate-x-full'}
//         lg:relative lg:translate-x-0
//       `}>

//         {/* Logo */}
//         <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
//           <span className="text-2xl">💰</span>
//           <span className="text-lg font-bold text-gray-900">PocketTrack</span>
//         </div>

//         {/* Nav Links */}
//         <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
//           {navItems.map(({ to, label, icon }) => (
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
//               <span className="text-base">{icon}</span>
//               {label}
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
//             className="w-full text-left text-sm text-gray-500 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
//           >
//             🚪 Sign out
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

//       {/* ---- Main content ---- */}
//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

//         {/* Mobile topbar */}
//         <header className="lg:hidden flex items-center gap-4 px-4 py-3 bg-white border-b border-gray-200">
//           <button
//             onClick={() => setOpen(true)}
//             className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
//           >
//             ☰
//           </button>
//           <span className="font-bold text-gray-900">💰 PocketTrack</span>
//         </header>

//         {/* Page content */}
//         <main className="flex-1 overflow-y-auto p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   )
// }


import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import {
  MdDashboard, MdAccountBalance, MdCreditCard,
  MdRepeat, MdTrackChanges, MdStar, MdFavorite,
  MdDocumentScanner, MdMenu, MdClose, MdLogout
} from 'react-icons/md'

const navItems = [
  { to: '/dashboard',    label: 'Dashboard',     icon: MdDashboard },
  { to: '/accounts',     label: 'Accounts',      icon: MdAccountBalance },
  { to: '/transactions', label: 'Transactions',  icon: MdCreditCard },
  { to: '/recurring',    label: 'Recurring',     icon: MdRepeat },
  { to: '/budget',       label: 'Budget',        icon: MdTrackChanges },
  { to: '/goals',        label: 'Goals',         icon: MdStar },
  { to: '/health-score', label: 'Health Score',  icon: MdFavorite },
  { to: '/scan-receipt', label: 'Scan Receipt',  icon: MdDocumentScanner },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate          = useNavigate()
  const [open, setOpen]   = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
        flex flex-col transform transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <MdAccountBalance className="text-white text-lg" />
          </div>
          <span className="text-lg font-bold text-gray-900">PocketTrack</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                 ${isActive
                   ? 'bg-blue-50 text-blue-700'
                   : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`text-lg ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-left text-sm text-gray-500 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <MdLogout className="text-base" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden flex items-center gap-4 px-4 py-3 bg-white border-b border-gray-200">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <MdMenu className="text-xl" />
          </button>
          <span className="font-bold text-gray-900">PocketTrack</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}