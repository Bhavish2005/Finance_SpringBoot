import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import {
  MdEmail, MdLock, MdVisibility, MdVisibilityOff,
  MdArrowForward, MdAccountBalance
} from 'react-icons/md'

// Animated SVG illustration for the left panel
function FinanceIllustration() {
  return (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-sm mx-auto">

      {/* Background circle */}
      <circle cx="200" cy="200" r="160" fill="rgba(255,255,255,0.05)" />
      <circle cx="200" cy="200" r="120" fill="rgba(255,255,255,0.05)" />

      {/* Dashboard card */}
      <rect x="80" y="100" width="240" height="150" rx="16"
        fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

      {/* Card header */}
      <rect x="80" y="100" width="240" height="44" rx="16"
        fill="rgba(255,255,255,0.08)" />
      <rect x="80" y="128" width="240" height="16" fill="rgba(255,255,255,0.08)" />
      <circle cx="104" cy="122" r="8" fill="rgba(255,255,255,0.3)" />
      <rect x="120" y="118" width="60" height="6" rx="3" fill="rgba(255,255,255,0.3)" />
      <rect x="120" y="127" width="40" height="4" rx="2" fill="rgba(255,255,255,0.15)" />

      {/* Balance text */}
      <rect x="100" y="158" width="80" height="8" rx="4" fill="rgba(255,255,255,0.2)" />
      <rect x="100" y="172" width="120" height="16" rx="4" fill="rgba(255,255,255,0.4)" />

      {/* Mini bar chart */}
      <rect x="220" y="175" width="14" height="30" rx="4" fill="rgba(255,255,255,0.2)" />
      <rect x="238" y="165" width="14" height="40" rx="4" fill="rgba(99,179,237,0.6)" />
      <rect x="256" y="170" width="14" height="35" rx="4" fill="rgba(255,255,255,0.2)" />
      <rect x="274" y="158" width="14" height="47" rx="4" fill="rgba(99,179,237,0.8)" />

      {/* Progress bar */}
      <rect x="100" y="210" width="180" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
      <rect x="100" y="210" width="120" height="6" rx="3" fill="rgba(99,179,237,0.7)" />

      {/* Floating stat cards */}
      <rect x="40" y="230" width="100" height="56" rx="12"
        fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.15)" strokeWidth="1">
        <animate attributeName="y" values="230;220;230" dur="3s" repeatCount="indefinite" />
      </rect>
      <rect x="52" y="244" width="40" height="5" rx="2.5" fill="rgba(255,255,255,0.3)" />
      <rect x="52" y="254" width="60" height="8" rx="3" fill="rgba(255,255,255,0.5)" />
      <rect x="52" y="267" width="32" height="5" rx="2.5" fill="rgba(134,239,172,0.6)" />

      <rect x="260" y="220" width="100" height="56" rx="12"
        fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.15)" strokeWidth="1">
        <animate attributeName="y" values="220;230;220" dur="3.5s" repeatCount="indefinite" />
      </rect>
      <rect x="272" y="234" width="40" height="5" rx="2.5" fill="rgba(255,255,255,0.3)" />
      <rect x="272" y="244" width="60" height="8" rx="3" fill="rgba(255,255,255,0.5)" />
      <rect x="272" y="257" width="32" height="5" rx="2.5" fill="rgba(252,165,165,0.6)" />

      {/* Goal ring */}
      <circle cx="200" cy="310" r="28" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none">
        <animate attributeName="r" values="28;32;28" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="310" r="28" stroke="rgba(99,179,237,0.7)" strokeWidth="8"
        fill="none" strokeDasharray="110" strokeDashoffset="40"
        strokeLinecap="round" transform="rotate(-90 200 310)" />
      <rect x="191" y="306" width="18" height="8" rx="3" fill="rgba(255,255,255,0.6)" />

      {/* Sparkle dots */}
      <circle cx="60" cy="140" r="4" fill="rgba(255,255,255,0.4)">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="340" cy="160" r="3" fill="rgba(99,179,237,0.6)">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="350" cy="300" r="4" fill="rgba(255,255,255,0.3)">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="320" r="3" fill="rgba(134,239,172,0.5)">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

export default function LoginPage() {
  const { login }    = useAuth()
  const navigate     = useNavigate()
  const [form, setForm]         = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ---- Left Panel ---- */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex-col items-center justify-center p-12 relative overflow-hidden">

        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 right-0 w-48 h-48 bg-blue-500/30 rounded-full translate-x-1/2 -translate-y-1/2" />

        {/* Logo */}
        <div className="flex items-center gap-3 mb-12 self-start relative z-10">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
            <MdAccountBalance className="text-white text-xl" />
          </div>
          <span className="text-white font-bold text-xl">PocketTrack</span>
        </div>

        {/* Illustration */}
        <div className="relative z-10 w-full">
          <FinanceIllustration />
        </div>

        {/* Text */}
        <div className="relative z-10 text-center mt-8">
          <h2 className="text-white text-2xl font-bold mb-3">
            Your money, crystal clear
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
            Track every rupee, set smart budgets, and let AI scan your receipts automatically.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mt-6 justify-center relative z-10">
          {['AI Receipt Scanner', 'Budget Alerts', 'Health Score', 'Goal Tracking'].map(f => (
            <span key={f}
              className="bg-white/10 backdrop-blur text-white/80 text-xs px-3 py-1.5 rounded-full border border-white/10">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* ---- Right Panel ---- */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MdAccountBalance className="text-white text-sm" />
            </div>
            <span className="font-bold text-gray-900">PocketTrack</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="email" name="email" value={form.email}
                  onChange={handleChange} required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password" value={form.password}
                  onChange={handleChange} required
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPass
                    ? <MdVisibilityOff className="text-lg" />
                    : <MdVisibility    className="text-lg" />
                  }
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm mt-2">
              {loading ? (
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>Sign In <MdArrowForward className="text-base" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400">
                Don't have an account?
              </span>
            </div>
          </div>

          {/* Register link */}
          <Link to="/register"
            className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl transition-colors text-sm">
            Create free account
            <MdArrowForward className="text-base" />
          </Link>
        </div>
      </div>
    </div>
  )
}