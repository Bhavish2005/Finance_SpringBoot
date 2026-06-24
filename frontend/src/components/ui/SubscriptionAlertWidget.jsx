// import { useState, useEffect } from 'react';
// import api from '../../api/axiosConfig';
// import { useTheme } from '../../context/ThemeContext';
// import { 
//   MdNotificationsActive, 
//   MdClose, 
//   MdAutoFixHigh, 
//   MdContentCopy, 
//   MdCheck, 
//   MdTrendingUp, 
//   MdLocalOffer, 
//   MdTrendingDown 
// } from 'react-icons/md';
// import toast from 'react-hot-toast';

// export default function SubscriptionAlertWidget() {
//   const { dark } = useTheme();
//   const [anomalies, setAnomalies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isOpen, setIsOpen] = useState(false);
//   const [emailDrafts, setEmailDrafts] = useState({});
//   const [generating, setGenerating] = useState(false);
//   const [copied, setCopied] = useState(null);

//   useEffect(() => {
//     api.get('/dashboard/anomalies')
//       .then(res => setAnomalies(res.data))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);
//   useEffect(() => {
//     if (!user) return;

//     const handleNotificationPing = () => {
//         console.log("🔔 Bell Icon heard the ping! Fetching new count...");
//         fetchCount(); // Your function that calls the /unread-count API
//     };
    
//     // Ensure these strings match perfectly!
//     window.addEventListener('websocket-notification', handleNotificationPing);
//     return () => window.removeEventListener('websocket-notification', handleNotificationPing);
//   }, [user]);

//   // 1. Calculate unread count (checks for both isRead and read due to how Java maps booleans)
//   const unreadCount = anomalies.filter(anomaly => !anomaly.isRead && !anomaly.read).length;

//   // 2. The new handler to open the bubble and clear the notifications
//   const handleOpenBubble = async () => {
//     setIsOpen(true);
    
//     // Only hit the server if there are actually unread alerts
//     if (unreadCount > 0) {
//       try {
//         await api.put('/dashboard/anomalies/mark-read');
//         // Instantly update local state so the badge disappears without reloading
//         setAnomalies(anomalies.map(a => ({ ...a, isRead: true, read: true })));
//       } catch (err) {
//         console.error('Failed to mark alerts as read');
//       }
//     }
//   };

//   const handleGenerateEmail = async (anomaly) => {
//     setGenerating(anomaly.merchant);
//     try {
//       const res = await api.post('/chat/dispute-email', {
//         merchant: anomaly.merchant,
//         oldPrice: anomaly.oldPrice,
//         newPrice: anomaly.newPrice
//       });
//       setEmailDrafts(prev => ({ ...prev, [anomaly.merchant]: res.data.email }));
//       toast.success('AI Negotiation Draft Ready!');
//     } catch {
//       toast.error('Failed to generate email');
//     } finally {
//       setGenerating(null);
//     }
//   };

//   const handleCopy = (merchant, text) => {
//     navigator.clipboard.writeText(text);
//     setCopied(merchant);
//     toast.success('Copied!');
//     setTimeout(() => setCopied(null), 2000);
//   };

//   // Only hide while loading. If 0 anomalies, we still render the button!
//   if (loading) return null;

//   return (
//     <>
//       {/* 1. Floating Bubble Button - NOW ALWAYS VISIBLE */}
//       <div className={`fixed bottom-6 right-24 z-40 ${isOpen ? 'hidden' : 'flex'}`}>
//         {/* Only show the breathing ring if there are UNREAD anomalies */}
//         {unreadCount > 0 && (
//           <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-40 animate-ping"></span>
//         )}
        
//         <button
//           onClick={handleOpenBubble} 
//           className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30 transition-transform hover:scale-105 bg-teal-600 hover:bg-teal-700 text-white"
//         >
//           <MdNotificationsActive className="text-2xl" />
          
//           {/* Dynamic Notification Badge Counter (Only show if > 0) */}
//           {unreadCount > 0 && (
//             <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-[#141414]">
//               {unreadCount}
//             </span>
//           )}
//         </button>
//       </div>

//       {/* 2. Floating Action Drawer / Panel */}
//       <div className={`fixed bottom-6 right-6 w-80 sm:w-[420px] rounded-2xl shadow-2xl border flex flex-col z-50 transition-all transform origin-bottom-right
//         ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}
//         ${dark ? 'bg-[#141414] border-[#2A2A2A]' : 'bg-white border-gray-200'}
//         `} style={{ height: '520px', maxHeight: '85vh' }}>
        
//         {/* Header */}
//         <div className={`flex items-center justify-between px-4 py-3 border-b rounded-t-2xl
//           ${dark ? 'bg-[#1A1A1A] border-[#2A2A2A]' : 'bg-teal-50 border-teal-100'}`}>
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center shadow-sm">
//               <MdNotificationsActive className="text-white text-sm" />
//             </div>
//             <h3 className={`font-semibold text-sm ${dark ? 'text-white' : 'text-teal-900'}`}>
//               Subscription Sentinel ({anomalies.length})
//             </h3>
//           </div>
//           <button onClick={() => setIsOpen(false)} className={dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}>
//             <MdClose className="text-xl" />
//           </button>
//         </div>

//         {/* Content Area */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
//           {anomalies.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
//               <MdCheck className="text-5xl text-emerald-500 mb-3" />
//               <p className={`font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
//                 No anomalies detected!
//               </p>
//               <p className="text-xs text-gray-500 mt-1">
//                 Your subscriptions are stable.
//               </p>
//             </div>
//           ) : (
//             anomalies.map((anomaly, idx) => {
//               const isDrop = anomaly.type === 'DROP';
//               const suggestedReducedPrice = anomaly.oldPrice; 

//               return (
//                 <div key={idx} className="space-y-4">
//                   {/* Metric Card */}
//                   <div className={`p-4 rounded-xl border ${dark ? 'bg-[#1E1E1E] border-[#2A2A2A]' : 'bg-gray-50 border-gray-100'}`}>
//                     <div className="flex justify-between items-start mb-2">
//                       <span className={`font-bold text-base ${dark ? 'text-white' : 'text-gray-900'}`}>{anomaly.merchant}</span>
                      
//                       {isDrop ? (
//                         <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
//                           <MdTrendingDown /> {-1*(anomaly.percentageChange || anomaly.percentageIncrease || 0).toFixed(0)}%
//                         </span>
//                       ) : (
//                         <span className="text-xs bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
//                           <MdTrendingUp /> {(anomaly.percentageChange || anomaly.percentageIncrease || 0).toFixed(0)}%
//                         </span>
//                       )}
//                     </div>
                    
//                     <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
//                       <div>
//                         <p className="text-gray-400">Previous Bill</p>
//                         <p className={`text-sm font-semibold ${dark ? 'text-gray-200' : 'text-gray-800'}`}>₹{anomaly.oldPrice}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-400">New Detected Bill</p>
//                         <p className={`text-sm font-bold ${isDrop ? 'text-emerald-500' : 'text-red-500'}`}>₹{anomaly.newPrice}</p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* AI Action Area */}
//                   {isDrop ? (
//                      <div className={`p-4 rounded-xl border border-dashed ${dark ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-emerald-50 border-emerald-200'}`}>
//                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
//                          🎉 Savings Detected
//                        </p>
//                        <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
//                          Great news! Your subscription price decreased. You saved <span className="font-bold text-emerald-500">₹{(anomaly.oldPrice - anomaly.newPrice).toFixed(2)}</span> this billing cycle.
//                        </p>
//                      </div>
//                   ) : (
//                     <>
//                       <div className={`p-4 rounded-xl border border-dashed ${dark ? 'bg-teal-950/20 border-teal-900/50' : 'bg-teal-50/50 border-teal-200'}`}>
//                         <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1 mb-1">
//                           <MdLocalOffer /> Retention Strategy Target
//                         </p>
//                         <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
//                           We recommend pushing their retention desk down to your historical rate of <span className="font-bold text-teal-600 dark:text-teal-400">₹{suggestedReducedPrice}</span> or downgrading.
//                         </p>
//                       </div>

//                       <div>
//                         {!emailDrafts[anomaly.merchant] ? (
//                           <button 
//                             onClick={() => handleGenerateEmail(anomaly)}
//                             disabled={generating === anomaly.merchant}
//                             className="w-full flex items-center justify-center gap-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 shadow-md shadow-teal-500/20"
//                           >
//                             <MdAutoFixHigh />
//                             {generating === anomaly.merchant ? 'Drafting Counter-Strategy...' : 'Generate AI Negotiation Email'}
//                           </button>
//                         ) : (
//                           <div className="relative mt-2">
//                              <div className={`p-4 rounded-xl text-xs font-medium leading-relaxed whitespace-pre-wrap
//                                ${dark ? 'bg-[#1E1E1E] text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
//                                {emailDrafts[anomaly.merchant]}
//                              </div>
//                              <button
//                                onClick={() => handleCopy(anomaly.merchant, emailDrafts[anomaly.merchant])}
//                                className="absolute top-2 right-2 p-2 rounded-lg bg-teal-600/10 hover:bg-teal-600/20 text-teal-600 transition-colors"
//                                title="Copy to clipboard"
//                              >
//                                {copied === anomaly.merchant ? <MdCheck className="text-sm" /> : <MdContentCopy className="text-sm" />}
//                              </button>
//                           </div>
//                         )}
//                       </div>
//                     </>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>
//     </>
//   );
// }
import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useTheme } from '../../context/ThemeContext';
// ---> 1. ADD THIS IMPORT <---
import { useAuth } from '../../context/AuthContext'; 
import { 
  MdNotificationsActive, 
  MdClose, 
  MdAutoFixHigh, 
  MdContentCopy, 
  MdCheck, 
  MdTrendingUp, 
  MdLocalOffer, 
  MdTrendingDown 
} from 'react-icons/md';
import toast from 'react-hot-toast';

export default function SubscriptionAlertWidget() {
  const { dark } = useTheme();
  // ---> 2. GET THE USER <---
  const { user } = useAuth(); 
  
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [emailDrafts, setEmailDrafts] = useState({});
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(null);

  // ---> 3. CREATE A REUSABLE FETCH FUNCTION <---
  const fetchAnomalies = () => {
    api.get('/dashboard/anomalies')
      .then(res => setAnomalies(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // Initial load
  useEffect(() => {
    fetchAnomalies();
  }, []);

  // ---> 4. THE WEBSOCKET LISTENER <---
  useEffect(() => {
    if (!user) return;

    const handleNotificationPing = () => {
        console.log("🔔 Bell Icon heard the ping! Fetching new anomalies...");
        fetchAnomalies(); // Instantly fetch the new data and update the count!
    };
    
    window.addEventListener('websocket-update', handleNotificationPing);
    return () => window.removeEventListener('websocket-update', handleNotificationPing);
  }, [user]);

  // Calculate unread count 
  const unreadCount = anomalies.filter(anomaly => !anomaly.isRead && !anomaly.read).length;

  const handleOpenBubble = async () => {
    setIsOpen(true);
    
    if (unreadCount > 0) {
      try {
        await api.put('/dashboard/anomalies/mark-read');
        setAnomalies(anomalies.map(a => ({ ...a, isRead: true, read: true })));
      } catch (err) {
        console.error('Failed to mark alerts as read');
      }
    }
  };

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

  if (loading) return null;

  return (
    <>
      {/* Floating Bubble Button */}
      <div className={`fixed bottom-6 right-24 z-40 ${isOpen ? 'hidden' : 'flex'}`}>
        {unreadCount > 0 && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-40 animate-ping"></span>
        )}
        
        <button
          onClick={handleOpenBubble} 
          className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30 transition-transform hover:scale-105 bg-teal-600 hover:bg-teal-700 text-white"
        >
          <MdNotificationsActive className="text-2xl" />
          
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-[#141414]">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Floating Action Drawer / Panel */}
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
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {anomalies.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
              <MdCheck className="text-5xl text-emerald-500 mb-3" />
              <p className={`font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                No anomalies detected!
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Your subscriptions are stable.
              </p>
            </div>
          ) : (
            anomalies.map((anomaly, idx) => {
              const isDrop = anomaly.type === 'DROP';
              const suggestedReducedPrice = anomaly.oldPrice; 
              const pctChange = ((Math.abs(anomaly.newPrice - anomaly.oldPrice) / anomaly.oldPrice) * 100).toFixed(0);

              return (
                <div key={idx} className="space-y-4">
                  {/* Metric Card */}
                  <div className={`p-4 rounded-xl border ${dark ? 'bg-[#1E1E1E] border-[#2A2A2A]' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`font-bold text-base ${dark ? 'text-white' : 'text-gray-900'}`}>{anomaly.merchant}</span>
                      
                      {/* {isDrop ? (
                        <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <MdTrendingDown /> {-1*(anomaly.percentageChange || anomaly.percentageIncrease || 0).toFixed(0)}%
                        </span>
                      ) : (
                        <span className="text-xs bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <MdTrendingUp /> {(anomaly.percentageChange || anomaly.percentageIncrease || 0).toFixed(0)}%
                        </span>
                      )} */}
                      {isDrop ? (
  <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
    <MdTrendingDown /> -{pctChange}%
  </span>
) : (
  <span className="text-xs bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
    <MdTrendingUp /> +{pctChange}%
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

                  {/* AI Action Area */}
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
                             <div className={`p-4 rounded-xl text-xs font-medium leading-relaxed whitespace-pre-wrap
                               ${dark ? 'bg-[#1E1E1E] text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                               {emailDrafts[anomaly.merchant]}
                             </div>
                             <button
                               onClick={() => handleCopy(anomaly.merchant, emailDrafts[anomaly.merchant])}
                               className="absolute top-2 right-2 p-2 rounded-lg bg-teal-600/10 hover:bg-teal-600/20 text-teal-600 transition-colors"
                               title="Copy to clipboard"
                             >
                               {copied === anomaly.merchant ? <MdCheck className="text-sm" /> : <MdContentCopy className="text-sm" />}
                             </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}