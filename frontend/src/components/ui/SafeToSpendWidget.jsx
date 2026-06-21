import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useTheme } from '../../context/ThemeContext';
import { card, text, subtext, iconBox } from '../../utils/cn';
import { MdShield, MdReceipt, MdShoppingCart } from 'react-icons/md';

export default function SafeToSpendWidget() {
  const { dark } = useTheme();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard/safe-to-spend').then(res => setData(res.data)).catch(console.error);
  }, []);

  if (!data) return null;

  return (
    <div className={`${card(dark)} p-6 mb-6 relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500 opacity-10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MdShield className="text-emerald-500 text-xl" />
            <h2 className={`font-semibold ${text(dark)}`}>Safe to Spend</h2>
          </div>
          <p className={`text-xs ${subtext(dark)}`}>Guilt-free allowance for the rest of the month</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-emerald-500">₹{data.safeToSpend.toLocaleString('en-IN')}</p>
          <p className={`text-xs font-medium mt-1 ${text(dark)}`}>
            ₹{data.dailyGuiltFree.toLocaleString('en-IN')} / day
          </p>
        </div>
      </div>

      {/* Progress Bar Visualizer */}
      <div className="w-full h-3 rounded-full flex overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800">
        <div style={{ width: `${(data.upcomingBills / data.totalBalance) * 100}%` }} className="bg-red-400"></div>
        <div style={{ width: `${(data.reservedForNecessities / data.totalBalance) * 100}%` }} className="bg-blue-400"></div>
        <div style={{ flex: 1 }} className="bg-emerald-400"></div>
      </div>

      {/* Breakdown Legend */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className={`p-3 rounded-xl border ${dark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50'}`}>
          <div className="flex items-center gap-1.5 text-red-500 mb-1 font-medium">
            <MdReceipt /> Reserved for Bills
          </div>
          <p className={`text-lg font-semibold ${text(dark)}`}>₹{data.upcomingBills.toLocaleString('en-IN')}</p>
        </div>
        
        <div className={`p-3 rounded-xl border ${dark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50'}`}>
          <div className="flex items-center gap-1.5 text-blue-500 mb-1 font-medium">
            <MdShoppingCart /> Est. Daily Needs
          </div>
          <p className={`text-lg font-semibold ${text(dark)}`}>₹{data.reservedForNecessities.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
}