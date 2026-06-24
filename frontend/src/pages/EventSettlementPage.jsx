// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useTheme } from '../context/ThemeContext';
// import { eventApi } from '../api/eventApi';
// import api from '../api/axiosConfig'; // For fetching accounts
// import { card, text, subtext } from '../utils/cn';
// import toast from 'react-hot-toast';
// import { MdCheckCircle, MdPayment, MdGroup, MdAdd, MdClose, MdAccountBalanceWallet } from 'react-icons/md';
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// export default function EventSettlementPage() {
//   const { eventId } = useParams();
//   const { user } = useAuth();
//   const { dark } = useTheme();
  
//   const [debts, setDebts] = useState([]);
//   const [pendingSettlements, setPendingSettlements] = useState([]);
//   const [accounts, setAccounts] = useState([]);
//   const [expenses, setExpenses] = useState([]); // Analytics Data
//   const [loading, setLoading] = useState(true);

//   // Modals State
//   const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
//   const [expenseData, setExpenseData] = useState({ description: '', totalAmount: '' });
  
//   const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
//   const [inviteEmail, setInviteEmail] = useState('');

//   // Secure Checkout Modal State
//   const [payModal, setPayModal] = useState({ isOpen: false, payeeId: null, payeeName: '', amount: 0 });
//   const [selectedAccountId, setSelectedAccountId] = useState('');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [refreshTrigger, setRefreshTrigger] = useState(0);

//     useEffect(() => {
//     const handleAutoRefresh = () => {
//       console.log("🔄 WebSocket Ping Received! Forcing UI refresh..."); // Changes the state, forcing React to re-fetch
    
//     setTimeout(() => {
//         setRefreshTrigger(prev => prev + 1); 
//       }, 500);
//     };
    
//     window.addEventListener('websocket-update', handleAutoRefresh);
//     return () => window.removeEventListener('websocket-update', handleAutoRefresh);
//   }, []);
//   useEffect(() => {
//     fetchData();
//   }, [eventId,refreshTrigger]);

//   const fetchData = async () => {
//     try {
//       const [debtsRes, settlementsRes, accountsRes, expensesRes] = await Promise.all([
//         eventApi.getDebts(eventId),
//         eventApi.getPendingSettlements(eventId),
//         api.get('/accounts'), // Fetch user's bank accounts
//         eventApi.getEventExpenses(eventId) // Fetch ledger history
//       ]);
//       setDebts(debtsRes.data);
//       setPendingSettlements(settlementsRes.data);
//       setAccounts(accountsRes.data);
//       setExpenses(expensesRes.data);
//     } catch (err) {
//       toast.error('Failed to load event data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Handlers ---
//   const handleAddExpense = async (e) => {
//     e.preventDefault();
//     setIsProcessing(true);
//     try {
//       await eventApi.addExpense(eventId, { description: expenseData.description, totalAmount: parseFloat(expenseData.totalAmount), paidByUserId: user.id });
//       toast.success('Bill added successfully!');
//       setIsExpenseModalOpen(false);
//       setExpenseData({ description: '', totalAmount: '' });
//       fetchData();
//     } catch (err) { toast.error('Failed to add expense'); } 
//     finally { setIsProcessing(false); }
//   };

//   const handleInviteFriend = async (e) => {
//     e.preventDefault();
//     setIsProcessing(true);
//     try {
//       await eventApi.inviteFriend(eventId, inviteEmail);
//       toast.success(`Invite sent to ${inviteEmail}!`);
//       setIsInviteModalOpen(false);
//       setInviteEmail('');
//     } catch (err) { toast.error(err.response?.data || 'Failed to send invite'); } 
//     finally { setIsProcessing(false); }
//   };

//   // --- SECURE CHECKOUT LOGIC ---
//   const handleOpenPayModal = (payeeId, payeeName, amount) => {
//     setPayModal({ isOpen: true, payeeId, payeeName, amount });
//     setSelectedAccountId('');
//   };

//   const submitSecurePayment = async (e) => {
//     e.preventDefault();
//     if (!selectedAccountId) return toast.error("Please select a bank account to pay from.");
    
//     const account = accounts.find(a => a.id === selectedAccountId);
//     if (account.balance < payModal.amount) {
//         return toast.error(`Insufficient Funds! Your ${account.name} only has ₹${account.balance}.`);
//     }

//     setIsProcessing(true);
//     try {
//       await eventApi.initiatePayment(eventId, payModal.payeeId, payModal.amount, selectedAccountId);
//       toast.success('Payment initiated securely!');
//       setPayModal({ isOpen: false, payeeId: null, payeeName: '', amount: 0 });
//       fetchData(); 
//     } catch (err) { toast.error('Failed to initiate payment'); }
//     finally { setIsProcessing(false); }
//   };

//   const handleConfirmPayment = async (settlementId) => {
//     try {
//       await eventApi.confirmPayment(settlementId);
//       toast.success('Payment confirmed! Ledger Updated.');
//       fetchData(); 
//     } catch (err) { toast.error(err.response?.data?.message || 'Failed to confirm payment'); }
//   };

//   // --- Chart Data Processing ---
//   const pieDataMap = expenses.reduce((acc, curr) => {
//     acc[curr.paidBy.name] = (acc[curr.paidBy.name] || 0) + curr.totalAmount;
//     return acc;
//   }, {});
//   const pieData = Object.keys(pieDataMap).map(key => ({ name: key, value: pieDataMap[key] }));
//   const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

//   if (loading) return <div className={`p-10 text-center ${subtext(dark)}`}>Loading ledgers...</div>;

//   return (
//     <div className="max-w-5xl mx-auto space-y-6 pb-10 relative">
      
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600`}><MdGroup className="text-xl" /></div>
//           <div><h1 className={`text-2xl font-bold ${text(dark)}`}>Trip Settlement</h1><p className={`text-sm ${subtext(dark)}`}>Bank-grade Double-Entry ledgers</p></div>
//         </div>
//         <div className="flex items-center gap-2">
//           <button onClick={() => setIsInviteModalOpen(true)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${dark ? 'bg-[#141414] border-[#2A2A2A] text-white hover:bg-[#1A1A1A]' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
//             <MdGroup className="text-lg" /> Invite Friend
//           </button>
//           <button onClick={() => setIsExpenseModalOpen(true)} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-500/20 transition-all">
//             <MdAdd className="text-lg" /> Add Shared Bill
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* LEFT COLUMN: Debts */}
//         <div className={`${card(dark)} p-6`}>
//           <h2 className={`text-sm font-bold uppercase tracking-wider mb-4 ${subtext(dark)}`}>Who Owes Who</h2>
//           {debts.length === 0 ? (<p className={`text-sm ${subtext(dark)}`}>Everyone is settled up!</p>) : (
//             <div className="space-y-4">
//               {debts.map((debt, idx) => {
//                 const isMeOweing = debt.debtorId === user.id;
//                 return (
//                   <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between ${dark ? 'bg-[#141414] border-[#2A2A2A]' : 'bg-gray-50 border-gray-100'}`}>
//                     <div>
//                       <p className={`text-sm font-semibold ${text(dark)}`}>{isMeOweing ? 'You' : debt.debtorName} <span className="font-normal text-gray-500">owe</span> {debt.creditorId === user.id ? 'You' : debt.creditorName}</p>
//                       <p className="text-lg font-bold text-red-500">₹{debt.amount.toLocaleString()}</p>
//                     </div>
//                     {isMeOweing && (
//                       <button onClick={() => handleOpenPayModal(debt.creditorId, debt.creditorName, debt.amount)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"><MdPayment /> Pay Now</button>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* RIGHT COLUMN: Pending */}
//         <div className={`${card(dark)} p-6`}>
//           <h2 className={`text-sm font-bold uppercase tracking-wider mb-4 ${subtext(dark)}`}>Pending Confirmations</h2>
//           {pendingSettlements.length === 0 ? (<p className={`text-sm ${subtext(dark)}`}>No pending payments.</p>) : (
//             <div className="space-y-4">
//               {pendingSettlements.map((s) => {
//                 const amIReceiving = s.payee.id === user.id;
//                 return (
//                   <div key={s.id} className={`p-4 rounded-xl border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-900/50 flex items-center justify-between`}>
//                     <div>
//                       <p className={`text-sm font-semibold ${text(dark)}`}>{s.payer.name} sent <span className="text-emerald-500">₹{s.amount}</span></p>
//                       <p className={`text-xs ${subtext(dark)}`}>{amIReceiving ? 'Waiting for your confirmation' : 'Waiting for them to confirm'}</p>
//                     </div>
//                     {amIReceiving && (
//                       <button onClick={() => handleConfirmPayment(s.id)} className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm"><MdCheckCircle /> Confirm Receipt</button>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* TRIP ANALYTICS SECTION */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//          {/* Ledger History */}
//          <div className={`md:col-span-2 ${card(dark)} p-6`}>
//             <h2 className={`text-sm font-bold uppercase tracking-wider mb-4 ${subtext(dark)}`}>Ledger History (Bills Added)</h2>
//             <div className="max-h-64 overflow-y-auto space-y-3 custom-scrollbar pr-2">
//                 {expenses.length === 0 ? <p className={subtext(dark)}>No bills added yet.</p> : expenses.map(exp => (
//                     <div key={exp.id} className={`p-3 rounded-xl border flex justify-between items-center ${dark ? 'border-[#2A2A2A] bg-[#141414]' : 'border-gray-100 bg-gray-50'}`}>
//                         <div>
//                             <p className={`font-semibold text-sm ${text(dark)}`}>{exp.description}</p>
//                             <p className={`text-xs ${subtext(dark)}`}>Paid by {exp.paidBy.id === user.id ? 'You' : exp.paidBy.name}</p>
//                         </div>
//                         <p className="font-bold text-blue-500">₹{exp.totalAmount.toLocaleString()}</p>
//                     </div>
//                 ))}
//             </div>
//          </div>
//          {/* Pie Chart */}
//          <div className={`${card(dark)} p-6 flex flex-col items-center justify-center`}>
//             <h2 className={`text-sm font-bold uppercase tracking-wider mb-2 w-full text-left ${subtext(dark)}`}>Who Funded The Trip</h2>
//             {expenses.length === 0 ? <div className={`text-center py-10 ${subtext(dark)}`}>Not enough data</div> : (
//                 <div className="w-full h-48">
//                     <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                             <Tooltip contentStyle={{ backgroundColor: dark ? '#1A1A1A' : '#fff', border: 'none', borderRadius: '8px' }} />
//                             <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
//                                 {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
//                             </Pie>
//                         </PieChart>
//                     </ResponsiveContainer>
//                 </div>
//             )}
//          </div>
//       </div>

//       {/* --- MODALS BELOW --- */}

//       {/* Secure Checkout / Pay Modal */}
//       {payModal.isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
//           <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl relative ${dark ? 'bg-[#1A1A1A] border border-[#2A2A2A]' : 'bg-white border border-gray-100'}`}>
//             <button onClick={() => setPayModal({isOpen: false})} className={`absolute top-4 right-4 ${subtext(dark)} hover:text-red-500`}><MdClose className="text-xl" /></button>
//             <h2 className={`text-xl font-bold mb-1 ${text(dark)}`}>Secure Checkout</h2>
//             <p className={`text-sm mb-6 ${subtext(dark)}`}>Paying <span className="font-bold text-blue-500">{payModal.payeeName}</span> ₹{payModal.amount.toLocaleString()}</p>
            
//             <form onSubmit={submitSecurePayment} className="space-y-4">
//               <div>
//                 <label className={`block text-xs font-medium mb-2 ${subtext(dark)}`}>Select Funding Account</label>
//                 <div className="space-y-2 max-h-48 overflow-y-auto">
//                     {accounts.map(acc => (
//                         <div key={acc.id} onClick={() => setSelectedAccountId(acc.id)} 
//                              className={`p-3 rounded-xl border cursor-pointer flex justify-between items-center transition-all 
//                              ${selectedAccountId === acc.id ? 'border-blue-500 bg-blue-500/10' : (dark ? 'border-[#2A2A2A] hover:bg-[#2A2A2A]' : 'border-gray-200 hover:bg-gray-50')}
//                              ${acc.balance < payModal.amount ? 'opacity-50 cursor-not-allowed' : ''}`}>
//                             <div className="flex items-center gap-3">
//                                 <MdAccountBalanceWallet className={selectedAccountId === acc.id ? 'text-blue-500' : subtext(dark)} />
//                                 <div>
//                                     <p className={`text-sm font-bold ${text(dark)}`}>{acc.name}</p>
//                                     <p className={`text-xs ${acc.balance < payModal.amount ? 'text-red-500 font-medium' : subtext(dark)}`}>Balance: ₹{acc.balance.toLocaleString()}</p>
//                                 </div>
//                             </div>
//                             {selectedAccountId === acc.id && <MdCheckCircle className="text-blue-500 text-xl" />}
//                         </div>
//                     ))}
//                 </div>
//               </div>
//               <button type="submit" disabled={isProcessing || !selectedAccountId} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20">
//                 {isProcessing ? 'Processing Secure Transfer...' : 'Confirm & Transfer Funds'}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Add Expense Modal */}
//       {isExpenseModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
//           <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl relative ${dark ? 'bg-[#1A1A1A] border border-[#2A2A2A]' : 'bg-white border border-gray-100'}`}>
//             <button onClick={() => setIsExpenseModalOpen(false)} className={`absolute top-4 right-4 ${subtext(dark)}`}><MdClose className="text-xl" /></button>
//             <h2 className={`text-xl font-bold mb-4 ${text(dark)}`}>Add Shared Bill</h2>
//             <form onSubmit={handleAddExpense} className="space-y-4">
//               <div><label className={`block text-xs font-medium mb-1 ${subtext(dark)}`}>What was this for?</label><input type="text" required value={expenseData.description} onChange={(e) => setExpenseData({...expenseData, description: e.target.value})} className={`w-full p-3 rounded-xl text-sm border focus:ring-2 focus:ring-emerald-500 outline-none ${dark ? 'bg-[#141414] border-[#2A2A2A] text-white' : 'bg-gray-50 border-gray-200'}`} placeholder="e.g., Dinner" /></div>
//               <div><label className={`block text-xs font-medium mb-1 ${subtext(dark)}`}>Total Amount (₹)</label><input type="number" required min="1" step="0.01" value={expenseData.totalAmount} onChange={(e) => setExpenseData({...expenseData, totalAmount: e.target.value})} className={`w-full p-3 rounded-xl text-sm border focus:ring-2 focus:ring-emerald-500 outline-none ${dark ? 'bg-[#141414] border-[#2A2A2A] text-white' : 'bg-gray-50 border-gray-200'}`} placeholder="0.00" /></div>
//               <button type="submit" disabled={isProcessing} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-medium py-3 rounded-xl">{isProcessing ? 'Saving...' : 'Split & Save'}</button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Invite Modal */}
//       {isInviteModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
//           <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl relative ${dark ? 'bg-[#1A1A1A] border border-[#2A2A2A]' : 'bg-white border border-gray-100'}`}>
//             <button onClick={() => setIsInviteModalOpen(false)} className={`absolute top-4 right-4 ${subtext(dark)}`}><MdClose className="text-xl" /></button>
//             <h2 className={`text-xl font-bold mb-4 ${text(dark)}`}>Invite Friend</h2>
//             <form onSubmit={handleInviteFriend} className="space-y-4">
//               <div><input type="email" required value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className={`w-full p-3 rounded-xl text-sm border focus:ring-2 focus:ring-blue-500 outline-none ${dark ? 'bg-[#141414] border-[#2A2A2A] text-white' : 'bg-gray-50 border-gray-200'}`} placeholder="friend@example.com" /></div>
//               <button type="submit" disabled={isProcessing} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl">{isProcessing ? 'Inviting...' : 'Send Invite'}</button>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { eventApi } from '../api/eventApi';
import api from '../api/axiosConfig'; 
import { card, text, subtext } from '../utils/cn';
import toast from 'react-hot-toast';
import { MdCheckCircle, MdPayment, MdGroup, MdAdd, MdClose, MdAccountBalanceWallet } from 'react-icons/md';
// ---> NEW: Added BarChart imports!
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function EventSettlementPage() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const { dark } = useTheme();
  
  const [debts, setDebts] = useState([]);
  const [pendingSettlements, setPendingSettlements] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [expenses, setExpenses] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseData, setExpenseData] = useState({ description: '', totalAmount: '' });
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const [payModal, setPayModal] = useState({ isOpen: false, payeeId: null, payeeName: '', amount: 0 });
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const handleAutoRefresh = () => {
      console.log("🔄 WebSocket Ping Received! Forcing UI refresh..."); 
      setTimeout(() => setRefreshTrigger(prev => prev + 1), 500);
    };
    window.addEventListener('websocket-update', handleAutoRefresh);
    return () => window.removeEventListener('websocket-update', handleAutoRefresh);
  }, []);

  useEffect(() => {
    fetchData();
  }, [eventId, refreshTrigger]);

  const fetchData = async () => {
    try {
      const [debtsRes, settlementsRes, accountsRes, expensesRes] = await Promise.all([
        eventApi.getDebts(eventId),
        eventApi.getPendingSettlements(eventId),
        api.get('/accounts'), 
        eventApi.getEventExpenses(eventId) 
      ]);
      setDebts(debtsRes.data);
      setPendingSettlements(settlementsRes.data);
      setAccounts(accountsRes.data);
      setExpenses(expensesRes.data);
    } catch (err) {
      toast.error('Failed to load event data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await eventApi.addExpense(eventId, { description: expenseData.description, totalAmount: parseFloat(expenseData.totalAmount), paidByUserId: user.id });
      toast.success('Bill added successfully!');
      setIsExpenseModalOpen(false);
      setExpenseData({ description: '', totalAmount: '' });
      fetchData();
    } catch (err) { toast.error('Failed to add expense'); } 
    finally { setIsProcessing(false); }
  };

  const handleInviteFriend = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await eventApi.inviteFriend(eventId, inviteEmail);
      toast.success(`Invite sent to ${inviteEmail}!`);
      setIsInviteModalOpen(false);
      setInviteEmail('');
    } catch (err) { toast.error(err.response?.data || 'Failed to send invite'); } 
    finally { setIsProcessing(false); }
  };

  const handleOpenPayModal = (payeeId, payeeName, amount) => {
    setPayModal({ isOpen: true, payeeId, payeeName, amount });
    setSelectedAccountId('');
  };

  const submitSecurePayment = async (e) => {
    e.preventDefault();
    if (!selectedAccountId) return toast.error("Please select a bank account to pay from.");
    const account = accounts.find(a => a.id === selectedAccountId);
    if (account.balance < payModal.amount) return toast.error(`Insufficient Funds!`);
    setIsProcessing(true);
    try {
      await eventApi.initiatePayment(eventId, payModal.payeeId, payModal.amount, selectedAccountId);
      toast.success('Payment initiated securely!');
      setPayModal({ isOpen: false, payeeId: null, payeeName: '', amount: 0 });
      fetchData(); 
    } catch (err) { toast.error('Failed to initiate payment'); }
    finally { setIsProcessing(false); }
  };

  const handleConfirmPayment = async (settlementId) => {
    try {
      await eventApi.confirmPayment(settlementId);
      toast.success('Payment confirmed! Ledger Updated.');
      fetchData(); 
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to confirm payment'); }
  };

  // --- CHART 1: Original Funders (Pie Chart) ---
  const pieDataMap = expenses.reduce((acc, curr) => {
    acc[curr.paidBy.name] = (acc[curr.paidBy.name] || 0) + curr.totalAmount;
    return acc;
  }, {});
  const pieData = Object.keys(pieDataMap).map(key => ({ name: key, value: pieDataMap[key] }));
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // --- CHART 2: Actual Contributions (Bar Chart Math Trick) ---
  const processCurrentContributions = () => {
    if (expenses.length === 0) return [];

    const totalCost = expenses.reduce((sum, exp) => sum + exp.totalAmount, 0);
    
    // Find all unique participants
    const uniqueUsers = new Set();
    expenses.forEach(e => uniqueUsers.add(e.paidBy.name));
    debts.forEach(d => { uniqueUsers.add(d.debtorName); uniqueUsers.add(d.creditorName); });
    
    const userCount = uniqueUsers.size > 0 ? uniqueUsers.size : 1;
    const fairShare = totalCost / userCount;

    // Calculate Net Balance from outstanding debts
    const netBalances = {};
    Array.from(uniqueUsers).forEach(u => netBalances[u] = 0);
    debts.forEach(d => {
       netBalances[d.creditorName] += d.amount; // Creditor is overpaid
       netBalances[d.debtorName] -= d.amount;   // Debtor is underpaid
    });

    // Actual Contribution = Fair Share + Net Balance
    return Array.from(uniqueUsers).map(name => ({
       name, 
       amount: Math.max(0, Math.round(fairShare + netBalances[name])) 
    }));
  };
  const actualContributionData = processCurrentContributions();

  if (loading) return <div className={`p-10 text-center ${subtext(dark)}`}>Loading ledgers...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10 relative">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600`}><MdGroup className="text-xl" /></div>
          <div><h1 className={`text-2xl font-bold ${text(dark)}`}>Trip Settlement</h1><p className={`text-sm ${subtext(dark)}`}>Bank-grade Double-Entry ledgers</p></div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsInviteModalOpen(true)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${dark ? 'bg-[#141414] border-[#2A2A2A] text-white hover:bg-[#1A1A1A]' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
            <MdGroup className="text-lg" /> Invite Friend
          </button>
          <button onClick={() => setIsExpenseModalOpen(true)} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-500/20 transition-all">
            <MdAdd className="text-lg" /> Add Shared Bill
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: Debts */}
        <div className={`${card(dark)} p-6`}>
          <h2 className={`text-sm font-bold uppercase tracking-wider mb-4 ${subtext(dark)}`}>Who Owes Who</h2>
          {debts.length === 0 ? (<p className={`text-sm ${subtext(dark)}`}>Everyone is settled up!</p>) : (
            <div className="space-y-4">
              {debts.map((debt, idx) => {
                const isMeOweing = debt.debtorId === user.id;
                return (
                  <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between ${dark ? 'bg-[#141414] border-[#2A2A2A]' : 'bg-gray-50 border-gray-100'}`}>
                    <div>
                      <p className={`text-sm font-semibold ${text(dark)}`}>{isMeOweing ? 'You' : debt.debtorName} <span className="font-normal text-gray-500">owe</span> {debt.creditorId === user.id ? 'You' : debt.creditorName}</p>
                      <p className="text-lg font-bold text-red-500">₹{debt.amount.toLocaleString()}</p>
                    </div>
                    {isMeOweing && (
                      <button onClick={() => handleOpenPayModal(debt.creditorId, debt.creditorName, debt.amount)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"><MdPayment /> Pay Now</button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Pending */}
        <div className={`${card(dark)} p-6`}>
          <h2 className={`text-sm font-bold uppercase tracking-wider mb-4 ${subtext(dark)}`}>Pending Confirmations</h2>
          {pendingSettlements.length === 0 ? (<p className={`text-sm ${subtext(dark)}`}>No pending payments.</p>) : (
            <div className="space-y-4">
              {pendingSettlements.map((s) => {
                const amIReceiving = s.payee.id === user.id;
                return (
                  <div key={s.id} className={`p-4 rounded-xl border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-900/50 flex items-center justify-between`}>
                    <div>
                      <p className={`text-sm font-semibold ${text(dark)}`}>{s.payer.name} sent <span className="text-emerald-500">₹{s.amount}</span></p>
                      <p className={`text-xs ${subtext(dark)}`}>{amIReceiving ? 'Waiting for your confirmation' : 'Waiting for them to confirm'}</p>
                    </div>
                    {amIReceiving && (
                      <button onClick={() => handleConfirmPayment(s.id)} className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm"><MdCheckCircle /> Confirm Receipt</button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Ledger History */}
      <div className={`mt-6 ${card(dark)} p-6`}>
        <h2 className={`text-sm font-bold uppercase tracking-wider mb-4 ${subtext(dark)}`}>Ledger History (Bills Added)</h2>
        <div className="max-h-48 overflow-y-auto space-y-3 custom-scrollbar pr-2">
            {expenses.length === 0 ? <p className={subtext(dark)}>No bills added yet.</p> : expenses.map(exp => (
                <div key={exp.id} className={`p-3 rounded-xl border flex justify-between items-center ${dark ? 'border-[#2A2A2A] bg-[#141414]' : 'border-gray-100 bg-gray-50'}`}>
                    <div>
                        <p className={`font-semibold text-sm ${text(dark)}`}>{exp.description}</p>
                        <p className={`text-xs ${subtext(dark)}`}>Paid by {exp.paidBy.id === user.id ? 'You' : exp.paidBy.name}</p>
                    </div>
                    <p className="font-bold text-blue-500">₹{exp.totalAmount.toLocaleString()}</p>
                </div>
            ))}
        </div>
      </div>

      {/* VISUAL ANALYTICS - ROW FOR BOTH CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Original Pie Chart */}
         <div className={`${card(dark)} p-6 flex flex-col items-center justify-center`}>
            <h2 className={`text-sm font-bold uppercase tracking-wider w-full text-left mb-6 ${subtext(dark)}`}>Original Funders</h2>
            {expenses.length === 0 ? <div className={`text-center py-10 ${subtext(dark)}`}>Not enough data</div> : (
                <div className="w-full h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Tooltip contentStyle={{ backgroundColor: dark ? '#1A1A1A' : '#fff', border: 'none', borderRadius: '8px' }} />
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
         </div>

         {/* NEW: Actual Contribution Bar Chart */}
         <div className={`${card(dark)} p-6 flex flex-col items-center justify-center`}>
            <div className="w-full text-left mb-6">
                <h2 className={`text-sm font-bold uppercase tracking-wider ${subtext(dark)}`}>Current Settlement Status</h2>
                <p className={`text-[10px] ${subtext(dark)}`}>(Actual amount paid after settling debts)</p>
            </div>
            {actualContributionData.length === 0 ? <div className={`text-center py-10 ${subtext(dark)}`}>Not enough data</div> : (
                <div className="w-full h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={actualContributionData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" stroke={dark ? '#888' : '#aaa'} fontSize={12} tickLine={false} axisLine={false} width={80} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: dark ? '#1A1A1A' : '#fff', border: 'none', borderRadius: '8px' }} />
                            <Bar dataKey="amount" fill="#10B981" radius={[0, 4, 4, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
         </div>
      </div>

      {/* --- MODALS BELOW --- */}

      {/* Secure Checkout / Pay Modal */}
      {payModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl relative ${dark ? 'bg-[#1A1A1A] border border-[#2A2A2A]' : 'bg-white border border-gray-100'}`}>
            <button onClick={() => setPayModal({isOpen: false})} className={`absolute top-4 right-4 ${subtext(dark)} hover:text-red-500`}><MdClose className="text-xl" /></button>
            <h2 className={`text-xl font-bold mb-1 ${text(dark)}`}>Secure Checkout</h2>
            <p className={`text-sm mb-6 ${subtext(dark)}`}>Paying <span className="font-bold text-blue-500">{payModal.payeeName}</span> ₹{payModal.amount.toLocaleString()}</p>
            
            <form onSubmit={submitSecurePayment} className="space-y-4">
              <div>
                <label className={`block text-xs font-medium mb-2 ${subtext(dark)}`}>Select Funding Account</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {accounts.map(acc => (
                        <div key={acc.id} onClick={() => setSelectedAccountId(acc.id)} 
                             className={`p-3 rounded-xl border cursor-pointer flex justify-between items-center transition-all 
                             ${selectedAccountId === acc.id ? 'border-blue-500 bg-blue-500/10' : (dark ? 'border-[#2A2A2A] hover:bg-[#2A2A2A]' : 'border-gray-200 hover:bg-gray-50')}
                             ${acc.balance < payModal.amount ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <div className="flex items-center gap-3">
                                <MdAccountBalanceWallet className={selectedAccountId === acc.id ? 'text-blue-500' : subtext(dark)} />
                                <div>
                                    <p className={`text-sm font-bold ${text(dark)}`}>{acc.name}</p>
                                    <p className={`text-xs ${acc.balance < payModal.amount ? 'text-red-500 font-medium' : subtext(dark)}`}>Balance: ₹{acc.balance.toLocaleString()}</p>
                                </div>
                            </div>
                            {selectedAccountId === acc.id && <MdCheckCircle className="text-blue-500 text-xl" />}
                        </div>
                    ))}
                </div>
              </div>
              <button type="submit" disabled={isProcessing || !selectedAccountId} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20">
                {isProcessing ? 'Processing Secure Transfer...' : 'Confirm & Transfer Funds'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl relative ${dark ? 'bg-[#1A1A1A] border border-[#2A2A2A]' : 'bg-white border border-gray-100'}`}>
            <button onClick={() => setIsExpenseModalOpen(false)} className={`absolute top-4 right-4 ${subtext(dark)}`}><MdClose className="text-xl" /></button>
            <h2 className={`text-xl font-bold mb-4 ${text(dark)}`}>Add Shared Bill</h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div><label className={`block text-xs font-medium mb-1 ${subtext(dark)}`}>What was this for?</label><input type="text" required value={expenseData.description} onChange={(e) => setExpenseData({...expenseData, description: e.target.value})} className={`w-full p-3 rounded-xl text-sm border focus:ring-2 focus:ring-emerald-500 outline-none ${dark ? 'bg-[#141414] border-[#2A2A2A] text-white' : 'bg-gray-50 border-gray-200'}`} placeholder="e.g., Dinner" /></div>
              <div><label className={`block text-xs font-medium mb-1 ${subtext(dark)}`}>Total Amount (₹)</label><input type="number" required min="1" step="0.01" value={expenseData.totalAmount} onChange={(e) => setExpenseData({...expenseData, totalAmount: e.target.value})} className={`w-full p-3 rounded-xl text-sm border focus:ring-2 focus:ring-emerald-500 outline-none ${dark ? 'bg-[#141414] border-[#2A2A2A] text-white' : 'bg-gray-50 border-gray-200'}`} placeholder="0.00" /></div>
              <button type="submit" disabled={isProcessing} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-medium py-3 rounded-xl">{isProcessing ? 'Saving...' : 'Split & Save'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl relative ${dark ? 'bg-[#1A1A1A] border border-[#2A2A2A]' : 'bg-white border border-gray-100'}`}>
            <button onClick={() => setIsInviteModalOpen(false)} className={`absolute top-4 right-4 ${subtext(dark)}`}><MdClose className="text-xl" /></button>
            <h2 className={`text-xl font-bold mb-4 ${text(dark)}`}>Invite Friend</h2>
            <form onSubmit={handleInviteFriend} className="space-y-4">
              <div><input type="email" required value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className={`w-full p-3 rounded-xl text-sm border focus:ring-2 focus:ring-blue-500 outline-none ${dark ? 'bg-[#141414] border-[#2A2A2A] text-white' : 'bg-gray-50 border-gray-200'}`} placeholder="friend@example.com" /></div>
              <button type="submit" disabled={isProcessing} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl">{isProcessing ? 'Inviting...' : 'Send Invite'}</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}