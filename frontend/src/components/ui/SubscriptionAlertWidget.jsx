import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useTheme } from '../../context/ThemeContext';
import { MdNotificationsActive, MdClose, MdAutoFixHigh, MdContentCopy, MdCheck, MdTrendingUp, MdLocalOffer } from 'react-icons/md';
import toast from 'react-hot-toast';
import {MdTrendingDown} from 'react-icons/md';
export default function SubscriptionAlertWidget() {
  const { dark } = useTheme();
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [emailDrafts, setEmailDrafts] = useState({});
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    api.get('/dashboard/anomalies')
      .then(res => setAnomalies(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleGenerateEmail = async (anomaly) => {
    setGenerating(anomaly.merchant);
    try {
      const res = await api.post('/chat/dispute-email', {
        merchant: anomaly.merchant,
        oldPrice: anomaly.oldPrice,
        newPrice: anomaly.newPrice
      });
      setEmailDrafts(prev => ({ ...prev, [anomaly.merchant]: res.data.email }));
      toast.success('AI Negotiation Draft Ready!');
    } catch {
      toast.error('Failed to generate email');
    } finally {
      setGenerating(null);
    }
  };

  const handleCopy = (merchant, text) => {
    navigator.clipboard.writeText(text);
    setCopied(merchant);
    toast.success('Copied!');
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading || anomalies.length === 0) return null;

  return (
    <>
      {/* 1. Floating Bubble Button with "Urgent Breathe" (Radar Ping) */}
      <div className={`fixed bottom-6 right-24 z-40 ${isOpen ? 'hidden' : 'flex'}`}>
        {/* The breathing/pinging background layer */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-40 animate-ping"></span>
        
        {/* The solid, non-fading main button */}
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30 transition-transform hover:scale-105 bg-teal-600 hover:bg-teal-700 text-white"
        >
          <MdNotificationsActive className="text-2xl" />
          
          {/* Dynamic Notification Badge Counter */}
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-[#141414]">
            {anomalies.length}
          </span>
        </button>
      </div>

      {/* 2. Floating Action Drawer / Panel */}
      <div className={`fixed bottom-6 right-6 w-80 sm:w-[420px] rounded-2xl shadow-2xl border flex flex-col z-50 transition-all transform origin-bottom-right
        ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}
        ${dark ? 'bg-[#141414] border-[#2A2A2A]' : 'bg-white border-gray-200'}
        `} style={{ height: '520px', maxHeight: '85vh' }}>
        
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b rounded-t-2xl
          ${dark ? 'bg-[#1A1A1A] border-[#2A2A2A]' : 'bg-teal-50 border-teal-100'}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center shadow-sm">
              <MdNotificationsActive className="text-white text-sm" />
            </div>
            <h3 className={`font-semibold text-sm ${dark ? 'text-white' : 'text-teal-900'}`}>
              Subscription Sentinel ({anomalies.length})
            </h3>
          </div>
          <button onClick={() => setIsOpen(false)} className={dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}>
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {anomalies.map((anomaly, idx) => {
            const isDrop = anomaly.type === 'DROP';
            const suggestedReducedPrice = anomaly.oldPrice; 

            return (
              <div key={idx} className="space-y-4">
                {/* Metric Card (Changes Color based on HIKE or DROP) */}
                <div className={`p-4 rounded-xl border ${dark ? 'bg-[#1E1E1E] border-[#2A2A2A]' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`font-bold text-base ${dark ? 'text-white' : 'text-gray-900'}`}>{anomaly.merchant}</span>
                    
                    {/* Dynamic Badge */}
                    {/* {isDrop ? (
                      <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <MdTrendingDown /> -{anomaly.percentageChange.toFixed(0)}%
                      </span>
                    ) : (
                      <span className="text-xs bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <MdTrendingUp /> +{anomaly.percentageChange.toFixed(0)}%
                      </span>
                    )} */}
                    {/* Dynamic Badge */}
                    {isDrop ? (
                      <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <MdTrendingDown /> {-1*(anomaly.percentageChange || anomaly.percentageIncrease || 0).toFixed(0)}%
                      </span>
                    ) : (
                      <span className="text-xs bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <MdTrendingUp /> {(anomaly.percentageChange || anomaly.percentageIncrease || 0).toFixed(0)}%
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                    <div>
                      <p className="text-gray-400">Previous Bill</p>
                      <p className={`text-sm font-semibold ${dark ? 'text-gray-200' : 'text-gray-800'}`}>₹{anomaly.oldPrice}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">New Detected Bill</p>
                      <p className={`text-sm font-bold ${isDrop ? 'text-emerald-500' : 'text-red-500'}`}>₹{anomaly.newPrice}</p>
                    </div>
                  </div>
                </div>

                {/* AI Action Area (Only show for Hikes!) */}
                {isDrop ? (
                   <div className={`p-4 rounded-xl border border-dashed ${dark ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-emerald-50 border-emerald-200'}`}>
                     <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                       🎉 Savings Detected
                     </p>
                     <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                       Great news! Your subscription price decreased. You saved <span className="font-bold text-emerald-500">₹{(anomaly.oldPrice - anomaly.newPrice).toFixed(2)}</span> this billing cycle.
                     </p>
                   </div>
                ) : (
                  <>
                    <div className={`p-4 rounded-xl border border-dashed ${dark ? 'bg-teal-950/20 border-teal-900/50' : 'bg-teal-50/50 border-teal-200'}`}>
                      <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                        <MdLocalOffer /> Retention Strategy Target
                      </p>
                      <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                        We recommend pushing their retention desk down to your historical rate of <span className="font-bold text-teal-600 dark:text-teal-400">₹{suggestedReducedPrice}</span> or downgrading.
                      </p>
                    </div>

                    <div>
                      {!emailDrafts[anomaly.merchant] ? (
                        <button 
                          onClick={() => handleGenerateEmail(anomaly)}
                          disabled={generating === anomaly.merchant}
                          className="w-full flex items-center justify-center gap-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 shadow-md shadow-teal-500/20"
                        >
                          <MdAutoFixHigh />
                          {generating === anomaly.merchant ? 'Drafting Counter-Strategy...' : 'Generate AI Negotiation Email'}
                        </button>
                      ) : (
                        <div className="relative mt-2">
                          {/* ... existing email draft rendering ... */}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
