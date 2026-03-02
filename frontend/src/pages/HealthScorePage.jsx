import { useState, useEffect } from 'react'
import api from '../api/axiosConfig'
import toast from 'react-hot-toast'

function ScoreRing({ score }) {
  const radius      = 70
  const stroke      = 10
  const circumference = 2 * Math.PI * radius
  const offset      = circumference - (score / 100) * circumference

  const color =
    score >= 85 ? '#10B981' :
    score >= 70 ? '#3B82F6' :
    score >= 55 ? '#F59E0B' :
    score >= 40 ? '#EF4444' : '#DC2626'

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="160" height="160">
        {/* Background ring */}
        <circle
          cx="80" cy="80" r={radius}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth={stroke}
        />
        {/* Score ring */}
        <circle
          cx="80" cy="80" r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 80 80)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      {/* Score text in center */}
      <div className="absolute text-center">
        <p className="text-4xl font-bold" style={{ color }}>
          {score}
        </p>
        <p className="text-xs text-gray-400 font-medium">out of 100</p>
      </div>
    </div>
  )
}

function ComponentBar({ label, score, max, message }) {
  const percentage = (score / max) * 100
  const color =
    percentage >= 80 ? 'bg-green-500' :
    percentage >= 60 ? 'bg-blue-500'  :
    percentage >= 40 ? 'bg-yellow-500': 'bg-red-500'

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-sm font-bold text-gray-700">
          {score}<span className="text-gray-400 font-normal">/{max}</span>
        </p>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-500">{message}</p>
    </div>
  )
}

export default function HealthScorePage() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchScore() }, [])

  const fetchScore = async () => {
    try {
      const res = await api.get('/health-score')
      setData(res.data)
    } catch {
      toast.error('Failed to load health score')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-400">Calculating your score...</p>
    </div>
  )

  if (!data) return null

  const tips = getTips(data.components)

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          💪 Financial Health Score
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Based on your savings, budgets, goals and net worth
        </p>
      </div>

      {/* Score Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 text-center">
        <ScoreRing score={data.score} />

        <div className="mt-4">
          <div
            className="inline-block text-3xl font-bold px-4 py-1 rounded-xl mb-2"
            style={{
              color: data.gradeColor,
              background: data.gradeColor + '15'
            }}
          >
            Grade: {data.grade}
          </div>
          <p className="text-gray-700 font-medium">{data.gradeMsg}</p>
        </div>

        {/* Score breakdown summary */}
        <div className="flex justify-center gap-6 mt-6 text-sm text-gray-500">
          <div className="text-center">
            <p className="font-semibold text-gray-800">
              {data.components[0].score}/{data.components[0].max}
            </p>
            <p>Savings</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-800">
              {data.components[1].score}/{data.components[1].max}
            </p>
            <p>Budgets</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-800">
              {data.components[2].score}/{data.components[2].max}
            </p>
            <p>Goals</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-800">
              {data.components[3].score}/{data.components[3].max}
            </p>
            <p>Net Worth</p>
          </div>
        </div>
      </div>

      {/* Component Breakdown */}
      <h2 className="text-base font-semibold text-gray-700 mb-3">
        Score Breakdown
      </h2>
      <div className="space-y-3 mb-6">
        {data.components.map((c) => (
          <ComponentBar
            key={c.label}
            label={c.label}
            score={c.score}
            max={c.max}
            message={c.message}
          />
        ))}
      </div>

      {/* Tips to improve */}
      {tips.length > 0 && (
        <>
          <h2 className="text-base font-semibold text-gray-700 mb-3">
            💡 How to Improve Your Score
          </h2>
          <div className="space-y-2">
            {tips.map((tip, i) => (
              <div
                key={i}
                className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-800"
              >
                {tip}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Refresh button */}
      <button
        onClick={fetchScore}
        className="w-full mt-6 border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium py-2.5 rounded-xl transition-colors"
      >
        🔄 Recalculate Score
      </button>
    </div>
  )
}

function getTips(components) {
  const tips = []
  const [savings, budget, goals, netWorth] = components

  if (savings.score < 24) {
    tips.push('💰 Try to save at least 20% of your monthly income — automate transfers to savings')
  }
  if (budget.score < 20) {
    tips.push('🎯 Set budgets for your top spending categories and stick to them')
  }
  if (goals.score < 15) {
    tips.push('⭐ Create savings goals and contribute regularly — even small amounts help')
  }
  if (netWorth.score < 10) {
    tips.push('📈 Focus on reducing debts and growing your account balances over time')
  }
  if (tips.length === 0) {
    tips.push('🌟 You\'re doing great! Keep maintaining these healthy financial habits')
  }

  return tips
}