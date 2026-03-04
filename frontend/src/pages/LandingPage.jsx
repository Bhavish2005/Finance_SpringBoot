import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import emailjs from '@emailjs/browser'
import { MdArrowForward } from 'react-icons/md'
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa'
import logo from '../assets/logo.svg'
import styles from '../LandingPage.module.css'


const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
function HeroIllustration() {
  return (
    <svg viewBox="0 0 560 440" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="hCard" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="hGreen" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#00C4B3" /><stop offset="100%" stopColor="#34D399" />
        </linearGradient>
        <linearGradient id="hArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00C4B3" stopOpacity="0.25" /><stop offset="100%" stopColor="#00C4B3" stopOpacity="0" />
        </linearGradient>
        <filter id="hShadow"><feDropShadow dx="0" dy="10" stdDeviation="18" floodColor="#000" floodOpacity="0.18" /></filter>
        <filter id="hCardSm"><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.12" /></filter>
      </defs>
      <rect x="60" y="20" width="360" height="250" rx="22" fill="url(#hCard)" filter="url(#hShadow)" />
      <rect x="60" y="20" width="360" height="56" rx="22" fill="rgba(255,255,255,0.07)" />
      <rect x="60" y="56" width="360" height="20" fill="rgba(255,255,255,0.07)" />
      <circle cx="90" cy="48" r="13" fill="#00C4B3" opacity="0.85" />
      <circle cx="90" cy="48" r="6" fill="rgba(255,255,255,0.5)" />
      <rect x="112" y="39" width="90" height="7" rx="3.5" fill="rgba(255,255,255,0.55)" />
      <rect x="112" y="51" width="55" height="5" rx="2.5" fill="rgba(255,255,255,0.25)" />
      <rect x="80" y="90" width="65" height="6" rx="3" fill="rgba(255,255,255,0.25)" />
      <rect x="80" y="104" width="150" height="20" rx="5" fill="rgba(255,255,255,0.88)" />
      <rect x="80" y="130" width="85" height="6" rx="3" fill="rgba(0,196,179,0.65)" />
      <polygon points="230,200 268,180 296,184 326,162 356,154 386,140 386,220 230,220" fill="url(#hArea)" />
      <polyline points="230,200 268,180 296,184 326,162 356,154 386,140" stroke="url(#hGreen)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {[230,268,296,326,356,386].map((x,i) => { const ys=[200,180,184,162,154,140]; return <circle key={i} cx={x} cy={ys[i]} r="3.5" fill="white" stroke="#00C4B3" strokeWidth="1.5" /> })}
      {[0,1,2,3,4,5].map(i => { const hs=[28,42,33,52,38,47]; return <rect key={i} x={80+i*27} y={242-hs[i]} width="17" height={hs[i]} rx="5" fill={i===3||i===5?'rgba(0,196,179,0.7)':'rgba(255,255,255,0.15)'} /> })}
      <rect x="80" y="244" width="210" height="1" fill="rgba(255,255,255,0.1)" />
      <rect x="320" y="190" width="155" height="82" rx="18" fill="white" filter="url(#hCardSm)"><animate attributeName="y" values="190;178;190" dur="3.8s" repeatCount="indefinite" /></rect>
      <circle cx="347" cy="216" r="13" fill="#D1FAE5"><animate attributeName="cy" values="216;204;216" dur="3.8s" repeatCount="indefinite" /></circle>
      <rect x="367" y="208" width="45" height="6" rx="3" fill="#E2E8F0"><animate attributeName="y" values="208;196;208" dur="3.8s" repeatCount="indefinite" /></rect>
      <rect x="367" y="220" width="65" height="10" rx="4" fill="#111827"><animate attributeName="y" values="220;208;220" dur="3.8s" repeatCount="indefinite" /></rect>
      <rect x="337" y="238" width="90" height="6" rx="3" fill="#00C4B3"><animate attributeName="y" values="238;226;238" dur="3.8s" repeatCount="indefinite" /></rect>
      <rect x="20" y="170" width="150" height="82" rx="18" fill="white" filter="url(#hCardSm)"><animate attributeName="y" values="170;182;170" dur="4.2s" repeatCount="indefinite" /></rect>
      <circle cx="45" cy="196" r="13" fill="#FEE2E2"><animate attributeName="cy" values="196;208;196" dur="4.2s" repeatCount="indefinite" /></circle>
      <rect x="65" y="188" width="45" height="6" rx="3" fill="#E2E8F0"><animate attributeName="y" values="188;200;188" dur="4.2s" repeatCount="indefinite" /></rect>
      <rect x="65" y="200" width="65" height="10" rx="4" fill="#111827"><animate attributeName="y" values="200;212;200" dur="4.2s" repeatCount="indefinite" /></rect>
      <rect x="30" y="220" width="110" height="5" rx="2.5" fill="#F3F4F6"><animate attributeName="y" values="220;232;220" dur="4.2s" repeatCount="indefinite" /></rect>
      <rect x="30" y="220" width="68" height="5" rx="2.5" fill="#EF4444"><animate attributeName="y" values="220;232;220" dur="4.2s" repeatCount="indefinite" /></rect>
      <rect x="350" y="295" width="115" height="70" rx="18" fill="white" filter="url(#hCardSm)"><animate attributeName="y" values="295;283;295" dur="5s" repeatCount="indefinite" /></rect>
      <circle cx="380" cy="325" r="18" fill="none" stroke="#E5E7EB" strokeWidth="3.5"><animate attributeName="cy" values="325;313;325" dur="5s" repeatCount="indefinite" /></circle>
      <circle cx="380" cy="325" r="18" fill="none" stroke="#00C4B3" strokeWidth="3.5" strokeDasharray="113" strokeDashoffset="28" strokeLinecap="round" transform="rotate(-90 380 325)"><animate attributeName="cy" values="325;313;325" dur="5s" repeatCount="indefinite" /></circle>
      <rect x="403" y="316" width="40" height="6" rx="3" fill="#E2E8F0"><animate attributeName="y" values="316;304;316" dur="5s" repeatCount="indefinite" /></rect>
      <rect x="403" y="326" width="52" height="10" rx="4" fill="#111827"><animate attributeName="y" values="326;314;326" dur="5s" repeatCount="indefinite" /></rect>
      <circle cx="510" cy="55" r="5.5" fill="#00C4B3" opacity="0.4"><animate attributeName="opacity" values="0.4;1;0.4" dur="2.2s" repeatCount="indefinite" /></circle>
      <circle cx="530" cy="190" r="4" fill="#4A90D9" opacity="0.5"><animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" /></circle>
      <circle cx="15" cy="75" r="4.5" fill="#F59E0B" opacity="0.4"><animate attributeName="opacity" values="0.4;0.9;0.4" dur="3.5s" repeatCount="indefinite" /></circle>
    </svg>
  )
}

function ReceiptScanIllustration() {
  return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: 220 }}>
      <defs><linearGradient id="scanGr" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#00C4B3" stopOpacity="0" /><stop offset="50%" stopColor="#00C4B3" /><stop offset="100%" stopColor="#00C4B3" stopOpacity="0" /></linearGradient></defs>
      <rect x="90" y="10" width="130" height="210" rx="18" fill="#1E293B" />
      <rect x="95" y="16" width="120" height="198" rx="14" fill="#0F172A" />
      <rect x="125" y="20" width="55" height="10" rx="5" fill="#0F172A" />
      <circle cx="152" cy="26" r="3.5" fill="#334155" />
      <rect x="100" y="38" width="110" height="162" rx="10" fill="#0F172A" />
      <rect x="114" y="52" width="78" height="108" rx="7" fill="white" />
      <rect x="122" y="62" width="62" height="4" rx="2" fill="#E2E8F0" />
      <rect x="122" y="70" width="44" height="4" rx="2" fill="#E2E8F0" />
      <rect x="122" y="78" width="62" height="1" rx=".5" fill="#F1F5F9" />
      {[84,92,100,108].map((y,i) => (<g key={i}><rect x="122" y={y} width={28+i*4} height="3" rx="1.5" fill="#E2E8F0" /><rect x={156+i} y={y} width={18+i*2} height="3" rx="1.5" fill="#E2E8F0" /></g>))}
      <rect x="122" y="116" width="62" height="1" rx=".5" fill="#F1F5F9" />
      <rect x="122" y="122" width="30" height="6" rx="2" fill="#111827" />
      <rect x="154" y="122" width="30" height="6" rx="2" fill="#00C4B3" />
      <path d="M108 46 L108 56 L118 56" stroke="#00C4B3" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M192 46 L192 56 L182 56" stroke="#00C4B3" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M108 164 L108 154 L118 154" stroke="#00C4B3" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M192 164 L192 154 L182 154" stroke="#00C4B3" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="108" y="100" width="84" height="2.5" rx="1.25" fill="url(#scanGr)" opacity="0.9">
        <animate attributeName="y" values="52;158;52" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.5;1" dur="2.4s" repeatCount="indefinite" />
      </rect>
      {[{x:22,y:80,c:'#EFF6FF',bc:'#BFDBFE',tc:'#3B82F6',d:'0.4s'},{x:222,y:90,c:'#F0FDF4',bc:'#BBF7D0',tc:'#00C4B3',d:'1.1s'},{x:18,y:120,c:'#FFF7ED',bc:'#FED7AA',tc:'#F59E0B',d:'1.7s'}].map(({x,y,c,bc,tc,d},i) => (
        <g key={i}>
          <rect x={x} y={y} width={68} height={26} rx="13" fill={c} stroke={bc} strokeWidth="1"><animate attributeName="opacity" values="0;1;1;0" dur="3s" begin={d} repeatCount="indefinite" /></rect>
          <rect x={x+8} y={y+9} width={52} height="7" rx="3.5" fill={tc}><animate attributeName="opacity" values="0;1;1;0" dur="3s" begin={d} repeatCount="indefinite" /></rect>
        </g>
      ))}
    </svg>
  )
}

function BudgetIllustration() {
  const bars = [{ pct: 0.65, c: '#EF4444', label: 'Housing' },{ pct: 0.82, c: '#F59E0B', label: 'Food' },{ pct: 0.48, c: '#00C4B3', label: 'Transport' },{ pct: 0.72, c: '#4A90D9', label: 'Savings' }]
  return (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: 200 }}>
      <rect x="12" y="12" width="296" height="196" rx="18" fill="#EFF6FF" />
      <rect x="28" y="28" width="100" height="7" rx="3.5" fill="#BFDBFE" />
      <rect x="28" y="40" width="68" height="14" rx="5" fill="#1E40AF" />
      {bars.map(({ pct, c, label }, i) => { const y = 80 + i * 32; return (<g key={i}><text x="28" y={y+9} fontSize="10" fill="#64748B" fontFamily="DM Sans,sans-serif">{label}</text><rect x="100" y={y} width="196" height="10" rx="5" fill="#DBEAFE" /><rect x="100" y={y} width={196*pct} height="10" rx="5" fill={c} opacity="0.85" /><text x={100+196*pct+4} y={y+9} fontSize="10" fill={c} fontFamily="DM Sans,sans-serif" fontWeight="600">{Math.round(pct*100)}%</text></g>) })}
      <circle cx="264" cy="52" r="30" fill="none" stroke="#DBEAFE" strokeWidth="9" />
      <circle cx="264" cy="52" r="30" fill="none" stroke="#00C4B3" strokeWidth="9" strokeDasharray="188" strokeDashoffset="56" strokeLinecap="round" transform="rotate(-90 264 52)" />
      <text x="264" y="57" textAnchor="middle" fontSize="11" fill="#1E40AF" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif">70%</text>
    </svg>
  )
}

function DashboardIllustration() {
  return (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: 200 }}>
      <defs>
        <linearGradient id="dBar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00C4B3" /><stop offset="100%" stopColor="#4A90D9" /></linearGradient>
        <linearGradient id="dArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00C4B3" stopOpacity="0.2" /><stop offset="100%" stopColor="#00C4B3" stopOpacity="0" /></linearGradient>
      </defs>
      <rect x="12" y="12" width="296" height="196" rx="18" fill="#F0F9FF" />
      <rect x="28" y="28" width="120" height="7" rx="3.5" fill="#BAE6FD" />
      <rect x="28" y="40" width="85" height="14" rx="5" fill="#0C4A6E" />
      {[55,75,45,90,65,80,58].map((h,i) => (<rect key={i} x={32+i*38} y={172-h} width="22" height={h} rx="6" fill={i===3||i===5?'url(#dBar)':'rgba(0,196,179,0.25)'} />))}
      <polygon points="32,140 70,120 108,130 146,102 184,96 222,80 260,86 260,172 32,172" fill="url(#dArea)" />
      <polyline points="32,140 70,120 108,130 146,102 184,96 222,80 260,86" stroke="#4A90D9" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {[32,70,108,146,184,222,260].map((x,i) => { const ys=[140,120,130,102,96,80,86]; return <circle key={i} cx={x} cy={ys[i]} r="3.5" fill="#fff" stroke="#4A90D9" strokeWidth="2" /> })}
      {[100,130,160].map(y => (<line key={y} x1="28" y1={y} x2="292" y2={y} stroke="#E0F2FE" strokeWidth="0.8" />))}
    </svg>
  )
}

function GoalsIllustration() {
  const goals = [{ label: 'Emergency Fund', pct: 0.75, c: '#00C4B3' },{ label: 'Vacation', pct: 0.45, c: '#4A90D9' },{ label: 'New Laptop', pct: 0.9, c: '#F59E0B' }]
  return (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: 200 }}>
      <rect x="12" y="12" width="296" height="196" rx="18" fill="#F0FDF4" />
      <rect x="28" y="28" width="110" height="7" rx="3.5" fill="#BBF7D0" />
      <rect x="28" y="40" width="78" height="14" rx="5" fill="#14532D" />
      {goals.map(({ label, pct, c }, i) => { const y = 80 + i * 42; return (<g key={i}><text x="28" y={y+10} fontSize="11" fill="#374151" fontFamily="DM Sans,sans-serif">{label}</text><text x={28+196*pct} y={y+10} fontSize="10" fill={c} fontFamily="DM Sans,sans-serif" fontWeight="700" textAnchor="end">{Math.round(pct*100)}%</text><rect x="28" y={y+14} width="196" height="12" rx="6" fill="#E5E7EB" /><rect x="28" y={y+14} width={196*pct} height="12" rx="6" fill={c}><animate attributeName="width" from="0" to={196*pct} dur={`${1+i*0.3}s`} fill="freeze" /></rect></g>) })}
    </svg>
  )
}

function HealthScoreIllustration() {
  return (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: 200 }}>
      <rect x="12" y="12" width="296" height="196" rx="18" fill="#FFF7ED" />
      <rect x="28" y="28" width="130" height="7" rx="3.5" fill="#FED7AA" />
      <rect x="28" y="40" width="90" height="14" rx="5" fill="#7C2D12" />
      <circle cx="160" cy="130" r="64" fill="none" stroke="#FEE2E2" strokeWidth="12" />
      <circle cx="160" cy="130" r="64" fill="none" stroke="#00C4B3" strokeWidth="12" strokeDasharray="402" strokeDashoffset="80" strokeLinecap="round" transform="rotate(-90 160 130)">
        <animate attributeName="stroke-dashoffset" values="402;80" dur="1.6s" fill="freeze" />
      </circle>
      <text x="160" y="124" textAnchor="middle" fontSize="28" fontWeight="800" fill="#1E293B" fontFamily="Plus Jakarta Sans,sans-serif">82</text>
      <text x="160" y="142" textAnchor="middle" fontSize="11" fill="#64748B" fontFamily="DM Sans,sans-serif">Health Score</text>
      {[{ x: 42, y: 90, t: 'Savings', v: 'A+' },{ x: 230, y: 90, t: 'Discipline', v: 'B+' }].map(({ x, y, t, v }, i) => (
        <g key={i}>
          <rect x={x} y={y} width="48" height="34" rx="8" fill="white" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.07))' }} />
          <text x={x+24} y={y+14} textAnchor="middle" fontSize="9" fill="#94A3B8" fontFamily="DM Sans,sans-serif">{t}</text>
          <text x={x+24} y={y+27} textAnchor="middle" fontSize="13" fontWeight="700" fill="#00C4B3" fontFamily="Plus Jakarta Sans,sans-serif">{v}</text>
        </g>
      ))}
    </svg>
  )
}

function MultiAccountIllustration() {
  const accs = [{ label: 'Savings Account', val: '₹1,24,000', c: '#00C4B3' },{ label: 'Checking Account', val: '₹38,500', c: '#4A90D9' },{ label: 'Credit Card', val: '₹−12,000', c: '#EF4444' }]
  return (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: 200 }}>
      <rect x="12" y="12" width="296" height="196" rx="18" fill="#EEF2FF" />
      <rect x="28" y="28" width="110" height="7" rx="3.5" fill="#C7D2FE" />
      <rect x="28" y="40" width="78" height="14" rx="5" fill="#3730A3" />
      {accs.map(({ label, val, c }, i) => { const y = 80 + i * 40; return (<g key={i}><rect x="28" y={y} width="264" height="32" rx="10" fill="white" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.06))' }} /><circle cx="50" cy={y+16} r="9" fill={c} opacity="0.2" /><circle cx="50" cy={y+16} r="5" fill={c} /><text x="66" y={y+13} fontSize="10" fill="#64748B" fontFamily="DM Sans,sans-serif">{label}</text><text x="66" y={y+24} fontSize="12" fontWeight="700" fill="#1E293B" fontFamily="Plus Jakarta Sans,sans-serif">{val}</text></g>) })}
    </svg>
  )
}


function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add(styles.visible); obs.unobserve(e.target) }
      }),
      { threshold: 0.12 }
    )
    document.querySelectorAll(`.${styles.sr}, .${styles.srLeft}, .${styles.srRight}`).forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}


const features = [
  { title: 'AI Receipt Scanner',      desc: 'Snap a photo — Our Service extracts merchant, amount, date and category instantly. No manual entry ever again.',            Illus: ReceiptScanIllustration,  bg: '#EFF6FF', accent: '#3B82F6', tag: 'AI-Powered' },
  { title: 'Smart Dashboard',         desc: 'Beautiful charts show exactly where your money goes. Track 6 months of income vs expenses at a glance.',                  Illus: DashboardIllustration,    bg: '#F0F9FF', accent: '#00C4B3', tag: 'Analytics'  },
  { title: 'Budget Management',       desc: 'Set monthly limits per category. Get email alerts at 80% and 100% before overspending happens.',                           Illus: BudgetIllustration,       bg: '#EFF6FF', accent: '#F59E0B', tag: 'Planning'   },
  { title: 'Savings Goals',           desc: "Define what you're saving for. Track progress visually and celebrate each milestone you hit.",                             Illus: GoalsIllustration,        bg: '#F0FDF4', accent: '#10B981', tag: 'Goals'      },
  { title: 'Financial Health Score',  desc: 'Get a 0–100 score based on savings rate, budget discipline, goal progress and net worth trends.',                         Illus: HealthScoreIllustration,  bg: '#FFF7ED', accent: '#F97316', tag: 'Insights'   },
  { title: 'Multi-Account Tracking',  desc: 'Manage savings, checking, credit cards and investments in one place with real-time balances.',                            Illus: MultiAccountIllustration, bg: '#EEF2FF', accent: '#6366F1', tag: 'Unified'    },
]

const comparisons = [
  { feature: 'AI Receipt Scanning',    us: true,  others: false },
  { feature: 'Financial Health Score', us: true,  others: false },
  { feature: 'Budget Email Alerts',    us: true,  others: false },
  { feature: 'Monthly Email Reports',  us: true,  others: false },
  { feature: 'Multi-Account Tracking', us: true,  others: true  },
  { feature: 'Goal Tracking',          us: true,  others: true  },
  { feature: 'CSV Import & Export',    us: true,  others: true  },
  { feature: 'Free to Use',            us: true,  others: false },
]

const testimonials = [
  { name: 'Priya Sharma',    role: 'Software Engineer, Bangalore', avatar: 'PS', text: 'FinanceVU changed how I manage money. The AI receipt scanner saves me 30 minutes a week. The health score keeps me motivated to save more.',               rating: 5 },
  { name: 'Rahul Mehta',     role: 'MBA Student, Mumbai',          avatar: 'RM', text: 'The budget alerts stopped me from overspending three times last month. Finally a finance app that explains where my money actually goes.',                  rating: 5 },
  { name: 'Ananya Krishnan', role: 'Freelance Designer, Chennai',  avatar: 'AK', text: "As a freelancer with variable income, FinanceVU's multi-account tracking and monthly reports are invaluable for staying on top of my finances.",         rating: 5 },
]

const stats = [
  { value: '50K+',  label: 'Transactions'  },
  { value: '10K+',  label: 'Active Users'  },
  { value: '₹2Cr+', label: 'Money Managed' },
  { value: '4.9★',  label: 'Rating'        },
]

const processSteps = [
  { step: '01', title: 'Create an account',     desc: 'Sign up and set your monthly baseline in less than a minute.',                   meta: 'Setup'    },
  { step: '02', title: 'Add your transactions', desc: 'Import CSV or add entries manually to start tracking instantly.',                meta: 'Data'     },
  { step: '03', title: 'Review insights',       desc: 'Use dashboard trends and budget alerts to improve your monthly decisions.',      meta: 'Insights' },
]


function ContactForm() {
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null) 

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('validation')
      return
    }
    setStatus('sending')
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
    name:    form.name,
    email:   form.email,
    title:   form.subject || '(No subject)',
    message: form.message,
    time:    new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  },
        EMAILJS_PUBLIC_KEY
      )
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setStatus(null), 6000)
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={styles.formGrid2}>
        <input className={styles.inputField} name="name"  placeholder="Your Name *"  value={form.name}    onChange={handleChange} autoComplete="name"  />
        <input className={styles.inputField} name="email" placeholder="Your Email *" value={form.email}   onChange={handleChange} autoComplete="email" type="email" />
      </div>
      <div className={styles.formGroup}>
        <input className={styles.inputField} name="subject" placeholder="Subject (optional)" value={form.subject} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <textarea className={styles.textareaField} name="message" placeholder="Your message *" rows={5} value={form.message} onChange={handleChange} />
      </div>

      {status === 'validation' && <p className={styles.formError}>Please fill in your name, email, and message.</p>}
      {status === 'error'      && <p className={styles.formError}>Something went wrong. Please try again or email us directly.</p>}
      {status === 'success'    && <p className={styles.formSuccess}>✓ Message sent! We'll get back to you within 24 hours.</p>}

      <button type="submit" className={styles.formSubmitBtn} disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send Message →'}
      </button>
    </form>
  )
}


export default function LandingPage() {
  useScrollReveal()
  const [activeSection, setActiveSection] = useState('features')

  const navItems = [
    { id: 'features',     label: 'Features'  },
    { id: 'compare',      label: 'Compare'   },
    { id: 'testimonials', label: 'Reviews'   },
    { id: 'contact',      label: 'Contact'   },
  ]

  const scrollTo = id => {
    const el = document.getElementById(id)
    if (!el) return
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' })
    setActiveSection(id)
  }

  useEffect(() => {
    const sections = navItems.map(({ id }) => document.getElementById(id)).filter(Boolean)
    const obs = new IntersectionObserver(
      entries => {
        const vis = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (vis[0]?.target?.id) setActiveSection(vis[0].target.id)
      },
      { threshold: [0.2, 0.5], rootMargin: '-20% 0px -55% 0px' }
    )
    sections.forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  return (
    <div className={styles.root}>

      {/* ════════ NAV ════════ */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.navLogo}>
            <img src={logo} alt="FinanceVUE" className={styles.navLogoImg} />
          </Link>
          <div className={styles.navLinks}>
            {navItems.map(({ id, label }) => (
              <button key={id} onClick={() => scrollTo(id)}
                className={`${styles.navLink} ${activeSection === id ? styles.navLinkActive : ''}`}>
                {label}
              </button>
            ))}
          </div>
          <div className={styles.navActions}>
            <Link to="/login"    className={styles.navSignIn}>Sign In</Link>
            <Link to="/register" className={styles.btnTeal} style={{ padding: '9px 20px' }}>Get Started Free →</Link>
          </div>
        </div>
      </nav>

      {/* ════════ HERO ════════ */}
      <section className={styles.hero}>
        <div className={styles.heroDotGrid} />
        <div className={styles.heroBlob1} />
        <div className={styles.heroBlob2} />

        <div className={styles.heroInner}>
          <div className={styles.heroGrid}>
            <div>
              <h1 className={`${styles.heroH1} ${styles.fadeUp2}`}>
                Master Your<br /><span className={styles.accentTeal}>Money</span> with AI
              </h1>
              <p className={`${styles.heroSubtitle} ${styles.fadeUp3}`}>
                Track expenses, scan receipts with AI, set smart budgets and achieve savings goals — all in one clean interface.
              </p>
              <div className={`${styles.heroBtns} ${styles.fadeUp3}`}>
                <Link to="/register" className={styles.btnTeal} style={{ padding: '13px 28px', fontSize: '0.9rem' }}>
                  Start for Free <MdArrowForward />
                </Link>
                <a href="#features" className={styles.btnGhost} style={{ padding: '13px 28px', fontSize: '0.9rem' }}>
                  See Features
                </a>
              </div>
              <p className={`${styles.heroNote} ${styles.fadeUp3}`}>No credit card required · Free forever</p>
              <div className={`${styles.statsRow} ${styles.fadeUp4}`}>
                {stats.map(({ value, label }) => (
                  <div key={label} className={styles.statItem}>
                    <span className={styles.statVal}>{value}</span>
                    <span className={styles.statLabel}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.heroIllus}><HeroIllustration /></div>
          </div>
        </div>

        <svg viewBox="0 0 1440 72" fill="none" className={styles.heroWave} style={{ display: 'block', marginBottom: '-2px' }}>
  <path d="M0 0 C360 72 1080 72 1440 0 L1440 72 L0 72 Z" fill="#fff" />
</svg>
      </section>

      {/* ════════ FEATURES ════════ */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.featuresInner}>
          <div className={`${styles.featuresHeader} ${styles.sr}`}>
            <span className={styles.labelTeal}>Everything you need</span>
            <h2 className={styles.sectionH2}>
              Built for how you actually<br /><span className={styles.accentTeal}>think about money</span>
            </h2>
            <p className={styles.featuresSubtitle}>Every feature reduces friction and gives you total clarity.</p>
          </div>

          {features.map(({ title, desc, Illus, bg, accent, tag }, i) => (
            <div key={title}
              className={`${styles.featRow} ${i % 2 === 1 ? styles.featRowReverse : ''} ${styles.sr}`}
              style={{ animationDelay: `${i * 0.07}s` }}>
              <div className={styles.featText}>
                <span className={styles.featTag} style={{ background: `${accent}18`, color: accent }}>{tag}</span>
                <h3 className={styles.featH3}>{title}</h3>
                <p className={styles.featDesc}>{desc}</p>
                <Link to="/register" className={styles.featCta} style={{ color: accent, borderBottomColor: accent }}>
                  Get started <span className={styles.featCtaArrow}>→</span>
                </Link>
              </div>
              <div className={styles.featIllus} style={{ background: bg }}><Illus /></div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.stepsSection}>
        <div className={styles.stepsDotGrid} />
        <div className={styles.stepsInner}>
          <div className={`${styles.stepsHeader} ${styles.sr}`}>
            <span className={styles.labelTeal}>Simple process</span>
            <h2 className={styles.sectionH2}>Up and running in <span className={styles.accentTeal}>3 minutes</span></h2>
          </div>
          <div className={styles.stepsGrid}>
            {processSteps.map(({ step, title, desc, meta }, i) => (
              <div key={step} className={styles.sr} style={{ animationDelay: `${i * 0.12}s` }}>
                <div className={styles.stepNum}>{step}</div>
                <div className={styles.stepCard}>
                  <div className={styles.stepMeta}>
                    {/* <span className={styles.stepBadge}>{step}</span> */}
                    <span className={styles.stepTag}>{meta}</span>
                  </div>
                  <h3 className={styles.stepH3}>{title}</h3>
                  <p className={styles.stepDesc}>{desc}</p>
                  <div className={styles.stepBar}>
                    <div className={styles.stepBarFill} style={{ width: `${(i + 1) * 33.33}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ COMPARISON ════════ */}
      <section id="compare" className={styles.compareSection}>
        <div className={styles.compareInner}>
          <div className={`${styles.compareHeader} ${styles.sr}`}>
            <span className={styles.labelTeal}>Comparison</span>
            <h2 className={styles.sectionH2}>Why <span className={styles.accentTeal}>FinanceVUE</span> stands out</h2>
            <p className={styles.compareSubtitle}>We built what other apps were missing.</p>
          </div>
          <div className={`${styles.compareTable} ${styles.sr}`}>
            <div className={styles.cmpHead}>
              <div className={styles.cmpHeadCell}>Feature</div>
              <div className={styles.cmpHeadCellUs}>FinanceVUE ✦</div>
              <div className={styles.cmpHeadCellOthers}>Others</div>
            </div>
            {comparisons.map(({ feature, us, others }) => (
              <div key={feature} className={styles.cmpRow}>
                <div className={styles.cmpCell}>{feature}</div>
                <div className={styles.cmpCellUs}>
                  {us ? <span className={styles.cmpCheck}>✓</span> : <span className={styles.cmpDash}>–</span>}
                </div>
                <div className={styles.cmpCellOthers}>
                  {others ? <span className={styles.cmpCheck}>✓</span> : <span className={styles.cmpDash}>–</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ TESTIMONIALS ════════ */}
      <section id="testimonials" className={styles.testiSection}>
        <div className={styles.testiInner}>
          <div className={`${styles.testiHeader} ${styles.sr}`}>
            <span className={styles.labelTeal}>Real users</span>
            <h2 className={styles.sectionH2}>Loved by thousands of <span className={styles.accentTeal}>Indians</span></h2>
          </div>
          <div className={styles.testiGrid}>
            {testimonials.map(({ name, role, avatar, text, rating }, i) => (
              <div key={name} className={`${styles.testiCard} ${styles.sr}`} style={{ animationDelay: `${i * 0.14}s` }}>
                <div className={styles.testiStars}>
                  {[...Array(rating)].map((_, j) => <span key={j} className={styles.testiStar}>★</span>)}
                </div>
                <p className={styles.testiText}>"{text}"</p>
                <div className={styles.testiAuthor}>
                  <div className={styles.testiAvatar}>{avatar}</div>
                  <div>
                    <p className={styles.testiName}>{name}</p>
                    <p className={styles.testiRole}>{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ════════ CONTACT ════════ */}
      <section id="contact" className={styles.contactSection}>
        <div className={styles.contactInner}>
          <div className={`${styles.contactHeader} ${styles.sr}`}>
            <span className={styles.labelTeal}>Get in touch</span>
            <h2 className={styles.sectionH2}>Contact <span className={styles.accentTeal}>Us</span></h2>
            <p className={styles.contactSubtitle}>Have questions or feedback? We'd love to hear from you.</p>
          </div>

          {/* Clean info strip — no icons */}
          <div className={`${styles.contactInfoStrip} ${styles.sr}`}>
            <div className={styles.contactInfoItem}>
              <span className={styles.contactInfoType}>Email us</span>
              <a href="mailto:support@financevue.in" className={styles.contactInfoValue}>support@financevue.in</a>
              <span className={styles.contactInfoNote}>Replies within 24 hours</span>
            </div>
            <div className={styles.contactInfoItem}>
              <span className={styles.contactInfoType}>Call us</span>
              <a href="tel:+919876543210" className={styles.contactInfoValue}>+91 98765 43210</a>
              <span className={styles.contactInfoNote}>Mon – Fri, 10 am – 6 pm IST</span>
            </div>
            <div className={styles.contactInfoItem}>
              <span className={styles.contactInfoType}>Find us</span>
              <span className={styles.contactInfoValue}>Chandigarh, India</span>
              <span className={styles.contactInfoNote}>Punjab · 160017</span>
            </div>
          </div>

          <div className={`${styles.contactFormBox} ${styles.sr}`}>
            <h3 className={styles.contactFormTitle}>Send us a message</h3>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerGrid}>
            <div>
              <div className={styles.footerBrand}>
                <div className={styles.footerLogoBox}><img src="/src/assets/Logo.svg" alt="FinanceVU Logo" /></div>
           
              </div>
              <p className={styles.footerTagline}>AI-powered personal finance for modern India.</p>
              <div className={styles.footerSocials}>
                {[{ Icon: FaTwitter, href: '#' },{ Icon: FaGithub, href: '#' },{ Icon: FaLinkedin, href: '#' }].map(({ Icon, href }, i) => (
                  <a key={i} href={href} className={styles.footerSocial}><Icon /></a>
                ))}
              </div>
            </div>
            <div>
              <p className={styles.footerColTitle}>Product</p>
              {['Features', 'Compare', 'Reviews', 'Get Started'].map(item => (
                <a key={item} href="#" className={styles.footerLink}>{item}</a>
              ))}
            </div>
            <div>
              <p className={styles.footerColTitle}>Company</p>
              {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'].map(item => (
                <a key={item} href="#" className={styles.footerLink}>{item}</a>
              ))}
            </div>
            <div>
              <p className={styles.footerColTitle}>Stay Updated</p>
              <p className={styles.footerNewsletterDesc}>Get financial tips and product updates in your inbox.</p>
              <div className={styles.footerNewsletterRow}>
                <input type="email" placeholder="your@email.com" className={styles.footerNewsletterInput} />
                <button className={styles.footerNewsletterBtn}>→</button>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p className={styles.footerBottomText}>© 2026 FinanceVU. All rights reserved.</p>
            <p className={styles.footerBottomText}>Made with Love in India</p>
          </div>
        </div>
      </footer>

    </div>
  )
}