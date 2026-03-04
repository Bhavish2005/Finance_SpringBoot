import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import {
  MdPerson, MdEmail, MdLock, MdVisibility,
  MdVisibilityOff, MdArrowForward, MdAccountBalance,
  MdCheck
} from 'react-icons/md'


function GrowthIllustration() {
  return (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-sm mx-auto">

    
      <circle cx="200" cy="200" r="150" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
      <circle cx="200" cy="200" r="100" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />

      
      <polyline
        points="60,300 100,260 150,270 200,200 250,180 300,140 340,110"
        stroke="rgba(99,179,237,0.5)" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" fill="none" />

      
      <polygon
        points="60,300 100,260 150,270 200,200 250,180 300,140 340,110 340,320 60,320"
        fill="url(#chartGrad)" />

      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(99,179,237,0.2)" />
          <stop offset="100%" stopColor="rgba(99,179,237,0)" />
        </linearGradient>
      </defs>

      
      {[[100,260],[150,270],[200,200],[250,180],[300,140]].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill="white" stroke="rgba(99,179,237,0.8)" strokeWidth="2">
          <animate attributeName="r" values="5;7;5" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}

      
      <rect x="240" y="90" width="130" height="70" rx="14"
        fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
        <animate attributeName="y" values="90;80;90" dur="3s" repeatCount="indefinite" />
      </rect>
      <rect x="256" y="106" width="50" height="5" rx="2.5" fill="rgba(255,255,255,0.3)" />
      <rect x="256" y="116" width="80" height="10" rx="4" fill="rgba(255,255,255,0.5)" />
      
      <rect x="256" y="134" width="98" height="5" rx="2.5" fill="rgba(255,255,255,0.1)" />
      <rect x="256" y="134" width="68" height="5" rx="2.5" fill="rgba(134,239,172,0.7)" />

     
      <rect x="30" y="150" width="120" height="65" rx="14"
        fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.15)" strokeWidth="1">
        <animate attributeName="y" values="150;162;150" dur="3.8s" repeatCount="indefinite" />
      </rect>
      <rect x="46" y="164" width="45" height="5" rx="2.5" fill="rgba(255,255,255,0.25)" />
      <rect x="46" y="174" width="70" height="9" rx="3" fill="rgba(255,255,255,0.45)" />
      <rect x="46" y="188" width="55" height="5" rx="2.5" fill="rgba(252,165,165,0.5)" />

      
      <circle cx="310" cy="250" r="24" fill="rgba(134,239,172,0.2)"
        stroke="rgba(134,239,172,0.4)" strokeWidth="2">
        <animate attributeName="r" values="24;28;24" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <polyline points="299,250 307,258 321,243"
        stroke="rgba(134,239,172,0.9)" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" fill="none" />

      
      <circle cx="370" cy="90" r="4" fill="rgba(255,255,255,0.4)">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="30" cy="90" r="3" fill="rgba(99,179,237,0.5)">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="370" cy="320" r="3" fill="rgba(134,239,172,0.4)">
        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.8s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

const benefits = [
  'AI-powered receipt scanning',
  'Smart budget alerts via email',
  'Financial health score',
  'Multi-account tracking',
]

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [form, setForm]         = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      toast.success('Account created! Welcome to PocketTrack!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const strength = form.password.length === 0 ? 0
    : form.password.length < 6  ? 1
    : form.password.length < 10 ? 2 : 3

  const strengthConfig = [
    { label: '',       color: '' },
    { label: 'Weak',   color: 'bg-red-500' },
    { label: 'Fair',   color: 'bg-yellow-500' },
    { label: 'Strong', color: 'bg-green-500' },
  ]

  return (
    <div className="min-h-screen flex">

      {/* ---- Left Panel ---- */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-700 via-blue-700 to-blue-600 flex-col items-center justify-center p-12 relative overflow-hidden">

        {/* Decorations */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/3 translate-y-1/3" />

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 self-start relative z-10">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
            <MdAccountBalance className="text-white text-xl" />
          </div>
          <span className="text-white font-bold text-xl">FinanceVUE</span>
        </div>

        
        <div className="relative z-10 w-full">
          <GrowthIllustration />
        </div>

        
        <div className="relative z-10 mt-6 self-start">
          <h2 className="text-white text-2xl font-bold mb-4">
            Start your financial journey
          </h2>
          <div className="space-y-2.5">
            {benefits.map(b => (
              <div key={b} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MdCheck className="text-green-400 text-xs" />
                </div>
                <span className="text-blue-100 text-sm">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <div className="flex-1 flex items-center justify-center p-6 bg-white overflow-y-auto">
        <div className="w-full max-w-sm py-8">

        
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MdAccountBalance className="text-white text-sm" />
            </div>
            <span className="font-bold text-gray-900">PocketTrack</span>
          </div>

        
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create account
            </h1>
            <p className="text-gray-500 text-sm">
              Free forever. No credit card required.
            </p>
          </div>

         
          <form onSubmit={handleSubmit} className="space-y-4">

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full name
              </label>
              <div className="relative">
                <MdPerson className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text" name="name" value={form.name}
                  onChange={handleChange} required
                  placeholder="Bhavish Kumar"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            
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

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password" value={form.password}
                  onChange={handleChange} required
                  placeholder="Min. 6 characters"
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

              
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3].map(i => (
                      <div key={i}
                        className={`flex-1 h-1.5 rounded-full transition-all duration-300
                          ${i <= strength
                            ? strengthConfig[strength].color
                            : 'bg-gray-200'
                          }`} />
                    ))}
                  </div>
                  <p className={`text-xs ${
                    strength === 1 ? 'text-red-500' :
                    strength === 2 ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {strengthConfig[strength].label} password
                  </p>
                </div>
              )}
            </div>

            
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm mt-2">
              {loading ? (
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>Create Account <MdArrowForward className="text-base" /></>
              )}
            </button>
          </form>

         
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400">
                Already have an account?
              </span>
            </div>
          </div>

          
          <Link to="/login"
            className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl transition-colors text-sm">
            Sign in instead
            <MdArrowForward className="text-base" />
          </Link>

          
          <p className="text-xs text-gray-400 text-center mt-6">
            By creating an account you agree to our{' '}
            <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}