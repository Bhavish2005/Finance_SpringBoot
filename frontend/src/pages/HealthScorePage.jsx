import { useState, useEffect } from 'react'
import api from '../api/axiosConfig'
import { useTheme } from '../context/ThemeContext'
import { card, text, subtext, btn, iconBox } from '../utils/cn'
import toast from 'react-hot-toast'
import {
  MdFavorite, MdTrendingUp, MdTrackChanges,
  MdStar, MdAccountBalance, MdRefresh, MdLightbulb
} from 'react-icons/md'

function ScoreRing({ score }) {
  const radius       = 70
  const stroke       = 10
  const circumference = 2 * Math.PI * radius
  const offset       = circumference - (score / 100) * circumference
  const color =
    score >= 85 ? '#34D399' : score >= 70 ? '#60A5FA' :
    score >= 55 ? '#FCD34D' : score >= 40 ? '#FCA5A5' : '#F87171'

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="160" height="160">
        <circle cx="80" cy="80" r={radius} fill="none"
          stroke="#E5E7EB" strokeWidth={stroke} />
        <circle cx="80" cy="80" r={radius} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 80 80)"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="absolute text-center">
        <p className="text-4xl font-bold" style={{ color }}>{score}</p>
        <p className="text-xs text-gray-400 font-medium">/ 100</p>
      </div>
    </div>
  )
}

const COMPONENT_ICONS = {
  'Savings Rate':     MdTrendingUp,
  'Budget Adherence': MdTrackChanges,
  'Goal Progress':    MdStar,
  'Net Worth':        MdAccountBalance,
}

function ComponentBar({ label, score, max, message, dark }) {
  const pct = (score / max) * 100
  const color =
    pct >= 80 ? 'bg-green-200' : pct >= 60 ? 'bg-blue-200' :
    pct >= 40 ? 'bg-yellow-200' : 'bg-red-200'
  const Icon = COMPONENT_ICONS[label] || MdFavorite

  return (
    <div className={`${card(dark)} p-4`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`text-lg ${subtext(dark)}`} />
          <p className={`text-sm font-semibold ${text(dark)}`}>{label}</p>
        </div>
        <p className={`text-sm font-bold ${text(dark)}`}>
          {score}<span className={`font-normal ${subtext(dark)}`}>/{max}</span>
        </p>
      </div>
      <div className={`w-full rounded-full h-2 mb-2 ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className={`h-2 rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }} />
      </div>
      <p className={`text-xs ${subtext(dark)}`}>{message}</p>
    </div>
  )
}
export default function HealthScorePage() {
  const { dark } = useTheme()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchScore() }, [])

  const fetchScore = async () => {
    setLoading(true)
    try {
      const res = await api.get('/health-score')
      setData(res.data)
    } catch { toast.error('Failed to load health score') }
    finally { setLoading(false) }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className={subtext(dark)}>Calculating your score...</p>
    </div>
  )

  if (!data) return null

  const tips = getTips(data.components)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
  <div className="flex items-center gap-3">
    <div className={`w-8 h-8 ${iconBox(dark)}`}>
      <MdFavorite className={`text-[15px] ${dark ? 'text-[#555]' : 'text-[#AAA]'}`} />
    </div>
    <div>
      <h1 className={`text-[15px] font-semibold leading-none ${text(dark)}`}>Health Score</h1>
      <p className={`text-[11px] mt-0.5 ${subtext(dark)}`}>Based on savings, budgets, goals and net worth</p>
    </div>
  </div>
</div>

      {/* Score Card */}
      <div className={`${card(dark)} p-8 mb-6 text-center`}>
        <ScoreRing score={data.score} />
        <div className="mt-4">
          <div className="inline-block text-3xl font-bold px-4 py-1 rounded-xl mb-2"
            style={{ color: data.gradeColor, background: data.gradeColor + '15' }}>
            Grade: {data.grade}
          </div>
          <p className={`font-medium ${text(dark)}`}>{data.gradeMsg}</p>
        </div>

        {/* Mini breakdown */}
        <div className="flex justify-center gap-6 mt-6 text-sm">
          {data.components.map(c => (
            <div key={c.label} className="text-center">
              <p className={`font-semibold ${text(dark)}`}>{c.score}/{c.max}</p>
              <p className={`text-xs ${subtext(dark)}`}>{c.label.split(' ')[0]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Breakdown */}
      <h2 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${subtext(dark)}`}>
        Score Breakdown
      </h2>
      <div className="space-y-3 mb-6">
        {data.components.map(c => (
          <ComponentBar key={c.label} {...c} dark={dark} />
        ))}
      </div>

      {/* Tips */}
      {tips.length > 0 && (
        <>
          <h2 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${subtext(dark)}`}>
            How to Improve
          </h2>
          <div className="space-y-2 mb-6">
            {tips.map((tip, i) => (
              <div key={i}
                className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm border
                  ${dark ? 'bg-black-100 border-white-200 text-blue-50' : 'bg-blue-50 border-black-100 text-black-800'}`}>
                <MdLightbulb className=" text-base mt-0.5 flex-shrink-0" />
                {tip}
              </div>
            ))}
          </div>
        </>
      )}

      <button onClick={fetchScore}
        className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl border transition-colors
          ${dark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
        <MdRefresh className="text-base" /> Recalculate Score
      </button>
    </div>
  )
}

function getTips(components) {
  const tips = []
  const [savings, budget, goals, netWorth] = components
  if (savings.score  < 24) tips.push('Save at least 20% of your monthly income — automate transfers to savings account')
  if (budget.score   < 20) tips.push('Set budgets for your top spending categories and stay within limits')
  if (goals.score    < 15) tips.push('Create savings goals and contribute regularly — even small amounts add up')
  if (netWorth.score < 10) tips.push('Focus on reducing debts and growing your account balances consistently')
  if (tips.length    === 0) tips.push('You\'re doing great! Keep maintaining these healthy financial habits')
  return tips
}