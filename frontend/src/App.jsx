import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import LandingPage      from './pages/LandingPage'
import LoginPage        from './pages/LoginPage'
import RegisterPage     from './pages/RegisterPage'
import DashboardPage    from './pages/DashboardPage'
import AccountsPage     from './pages/AccountsPage'
import TransactionsPage from './pages/TransactionsPage'
import BudgetPage       from './pages/BudgetPage'
import GoalsPage        from './pages/GoalsPage'
import ReceiptScannerPage from './pages/ReceiptScannerPage'
import Layout           from './components/layout/Layout'
import RecurringPage from './pages/RecurringPage'
import HealthScorePage from './pages/HealthScorePage'
import ImportTransactionsPage from './pages/ImportTransactionsPage'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  )
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <Routes>

      {/* Landing — always visible, redirects to dashboard if logged in */}
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />

      {/* Auth pages — only when logged out */}
      <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Protected app pages — inside Layout */}
      <Route path="/dashboard"    element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
      </Route>

      <Route path="/accounts" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<AccountsPage />} />
      </Route>

      <Route path="/transactions" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<TransactionsPage />} />
      </Route>

      <Route path="/budget" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<BudgetPage />} />
      </Route>

      <Route path="/goals" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<GoalsPage />} />
      </Route>

      <Route path="/scan-receipt" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<ReceiptScannerPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/recurring" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
  <Route index element={<RecurringPage />} />
</Route>
<Route path="/health-score" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
  <Route index element={<HealthScorePage />} />
</Route>
<Route path="/import" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
  <Route index element={<ImportTransactionsPage />} />
</Route>

    </Routes>
  )
}