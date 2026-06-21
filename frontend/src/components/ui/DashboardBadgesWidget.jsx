import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useTheme } from '../../context/ThemeContext';
import { card, text, subtext } from '../../utils/cn';
import { MdEmojiEvents, MdWorkspacePremium } from 'react-icons/md';

export default function DashboardBadgesWidget() {
  const { dark } = useTheme();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/budgets/badges')
      .then(res => setBadges(res.data.slice(0, 3))) // Show only top 3 recent achievements to save space
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || badges.length === 0) return null;

  return (
    <div className={`${card(dark)} p-5 flex flex-col h-full`}>
      {/* Widget Section Title */}
      <div className="flex items-center justify-between mb-5 border-b pb-3 dark:border-[#1A1A1A] border-gray-50">
        <div className="flex items-center gap-2">
          <MdEmojiEvents className="text-xl text-yellow-500" />
          <p className={`text-[11px] font-bold uppercase tracking-wider ${dark ? 'text-[#555]' : 'text-[#AAA]'}`}>
            Milestones & Rewards
          </p>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${dark ? 'bg-[#1A1A1A] text-[#888]' : 'bg-gray-100 text-gray-500'}`}>
          Wall
        </span>
      </div>

      {/* Mini Scrolling List */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] custom-scrollbar pr-1">
        {badges.map((badge) => {
          const isMaster = badge.badgeType === 'BUDGET_MASTER';

          return (
            <div
              key={badge.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-colors
                ${dark ? 'border-[#1A1A1A] bg-[#141414]/50 hover:bg-[#141414]' : 'border-gray-50 bg-gray-50/50 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                {/* Visual Icon Badge */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm
                  ${isMaster ? 'bg-yellow-100/80 text-yellow-600' : 'bg-blue-100/80 text-blue-600'}
                  ${dark && isMaster ? 'bg-yellow-900/20 text-yellow-400' : ''}
                  ${dark && !isMaster ? 'bg-blue-900/20 text-blue-400' : ''}
                `}>
                  <MdWorkspacePremium className="text-lg" />
                </div>

                <div>
                  <p className={`text-[13px] font-semibold tracking-tight ${text(dark)}`}>
                    ₹{badge.amountSaved.toLocaleString('en-IN')} Rollover
                  </p>
                  <p className={`text-[11px] mt-0.5 capitalize ${subtext(dark)}`}>
                    {badge.category.toLowerCase()} • <span className="uppercase text-[9px] font-bold">{badge.rewardMonth}</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}