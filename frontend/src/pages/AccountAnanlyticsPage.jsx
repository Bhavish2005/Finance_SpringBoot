import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useTheme } from '../context/ThemeContext';
import { card, text, subtext, iconBox } from '../utils/cn';
import { MdArrowBack, MdAccountBalanceWallet, MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import toast from 'react-hot-toast';

export default function AccountAnalyticsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/accounts/${id}/analytics`)
      .then(res => setData(res.data))
      .catch(() => toast.error('Failed to load account analytics'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className={subtext(dark)}>Loading account data...</p>
    </div>
  );

  if (!data) return (
    <div className="flex flex-col items-center justify-center h-64">
      <p className="text-red-500 font-medium mb-4">Account not found.</p>
      <button 
        onClick={() => navigate(-1)} 
        className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${dark ? 'bg-[#1A1A1A] text-white hover:bg-[#2A2A2A]' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
      >
        Go Back
      </button>
    </div>
  );

  const chartData = [
    { name: 'Income', value: data.monthlyIncome, color: '#10B981' },
    { name: 'Expenses', value: data.monthlyExpense, color: '#EF4444' }
  ].filter(d => d.value > 0);

  
  const tooltipStyle = {
    backgroundColor: dark ? '#141414' : '#fff',
    border: `1px solid ${dark ? '#262626' : '#E5E5E5'}`,
    borderRadius: '8px',
    fontSize: '12px',
    color: dark ? '#FAFAFA' : '#111',
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      
      {/* 1. Enhanced Header with Proper Margin and Alignment */}
      <div className="flex items-center gap-5 mb-8 pt-10 sm:pt-12">
        <button
          onClick={() => navigate(-1)}
          className={`p-2 rounded-xl border transition-colors ${dark ? 'border-[#2A2A2A] hover:bg-[#1A1A1A] text-gray-400' : 'border-gray-200 hover:bg-gray-50 text-gray-500'}`}
        >
          <MdArrowBack className="text-xl" />
        </button>

        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${iconBox(dark)}`}>
            <MdAccountBalanceWallet className={`text-lg ${dark ? 'text-[#555]' : 'text-[#AAA]'}`} />
          </div>
          <div>
            <h1 className={`text-[22px] font-bold leading-none tracking-tight ${text(dark)}`}>
              {data.accountName}
            </h1>
            <p className={`text-xs mt-1 capitalize font-medium ${subtext(dark)}`}>
              {data.accountType.replace('_', ' ').toLowerCase()} Account
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Column: Stats & Donut Chart */}
        <div className="lg:col-span-1 space-y-5">
          
          {/* Minimalist Balance Card */}
          <div className={`${card(dark)} p-6 hover:shadow-sm transition-shadow`}>
            <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${dark ? 'text-[#555]' : 'text-[#AAA]'}`}>
              Current Balance
            </p>
            <p className={`text-3xl font-bold tracking-tight ${Number(data.balance) >= 0 ? text(dark) : 'text-red-500'}`}>
              ₹{Number(data.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Polished Donut Chart */}
          <div className={`${card(dark)} p-6`}>
            <p className={`text-[11px] font-bold uppercase tracking-wider mb-6 ${dark ? 'text-[#555]' : 'text-[#AAA]'}`}>
              This Month's Cashflow
            </p>
            <div className="h-56 w-full">
              {chartData.length === 0 ? (
                <div className={`flex items-center justify-center h-full text-sm ${subtext(dark)}`}>
                  No cashflow recorded this month
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                    />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Premium Transaction List */}
        <div className={`lg:col-span-2 ${card(dark)} p-6 flex flex-col`}>
          <div className="flex items-center justify-between mb-4">
            <p className={`text-[11px] font-bold uppercase tracking-wider ${dark ? 'text-[#555]' : 'text-[#AAA]'}`}>
              Account Transactions
            </p>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${dark ? 'bg-[#1A1A1A] text-[#888]' : 'bg-gray-100 text-gray-500'}`}>
              {data.transactions.length} Records
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-1" style={{ maxHeight: '460px' }}>
            {data.transactions.length === 0 ? (
              <div className={`text-center py-12 text-sm ${subtext(dark)}`}>
                No transactions found for this account.
              </div>
            ) : (
              data.transactions.map((tx) => (
                <div
                  key={tx.id}
                  className={`flex justify-between items-center p-3 rounded-xl border-b last:border-0 transition-colors
                    ${dark ? 'border-[#1A1A1A] hover:bg-[#141414]' : 'border-gray-50 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Modern Transaction Icon */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                      ${tx.type === 'INCOME' ? 'bg-emerald-100/50 text-emerald-600' : 'bg-red-100/50 text-red-600'}
                      ${dark && tx.type === 'INCOME' ? 'bg-emerald-900/20 text-emerald-400' : ''}
                      ${dark && tx.type === 'EXPENSE' ? 'bg-red-900/20 text-red-400' : ''}
                    `}>
                      {tx.type === 'INCOME' ? <MdTrendingUp className="text-lg" /> : <MdTrendingDown className="text-lg" />}
                    </div>

                    <div>
                      <p className={`text-[13px] font-semibold truncate max-w-[180px] sm:max-w-[300px] ${text(dark)}`}>
                        {tx.description || tx.category}
                      </p>
                      <p className={`text-[11px] mt-0.5 ${subtext(dark)}`}>
                        {tx.category} • {tx.date}
                      </p>
                    </div>
                  </div>

                  <p className={`text-[13px] font-bold whitespace-nowrap tracking-tight ${tx.type === 'INCOME' ? 'text-emerald-500' : text(dark)}`}>
                    {tx.type === 'INCOME' ? '+' : '−'}₹{Number(tx.amount).toLocaleString('en-IN')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}