import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { eventApi } from '../api/eventApi';
import { card, text, subtext } from '../utils/cn';
import toast from 'react-hot-toast';
import { MdCheckCircle, MdPayment, MdGroup } from 'react-icons/md';

export default function EventSettlementPage() {
  const { eventId } = useParams(); // Gets the event ID from the URL (e.g., /events/123/settle)
  const { user } = useAuth();
  const { dark } = useTheme();
  
  const [debts, setDebts] = useState([]);
  const [pendingSettlements, setPendingSettlements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    try {
      const [debtsRes, settlementsRes] = await Promise.all([
        eventApi.getDebts(eventId),
        eventApi.getPendingSettlements(eventId)
      ]);
      setDebts(debtsRes.data);
      setPendingSettlements(settlementsRes.data);
    } catch (err) {
      toast.error('Failed to load event data');
    } finally {
      setLoading(false);
    }
  };

  const handleInitiatePayment = async (payeeId, amount) => {
    try {
      await eventApi.initiatePayment(eventId, payeeId, amount);
      toast.success('Payment initiated! Waiting for confirmation.');
      fetchData(); // Refresh lists
    } catch (err) {
      toast.error('Failed to initiate payment');
    }
  };

  const handleConfirmPayment = async (settlementId) => {
    try {
      await eventApi.confirmPayment(settlementId);
      // This will instantly trigger the WebSocket popup on the other user's screen!
      toast.success('Payment confirmed! Ledgers updated.');
      fetchData(); // Refresh lists
    } catch (err) {
      toast.error('Failed to confirm payment');
    }
  };

  if (loading) return <div className={`p-10 text-center ${subtext(dark)}`}>Loading ledgers...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600`}>
          <MdGroup className="text-xl" />
        </div>
        <div>
          <h1 className={`text-2xl font-bold ${text(dark)}`}>Trip Settlement</h1>
          <p className={`text-sm ${subtext(dark)}`}>Optimized to the minimum required transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: Simplified Debts */}
        <div className={`${card(dark)} p-6`}>
          <h2 className={`text-sm font-bold uppercase tracking-wider mb-4 ${subtext(dark)}`}>
            Who Owes Who
          </h2>
          {debts.length === 0 ? (
            <p className={`text-sm ${subtext(dark)}`}>Everyone is settled up!</p>
          ) : (
            <div className="space-y-4">
              {debts.map((debt, idx) => {
                const isMeOweing = debt.debtorId === user.id;
                
                return (
                  <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between
                    ${dark ? 'bg-[#141414] border-[#2A2A2A]' : 'bg-gray-50 border-gray-100'}`}>
                    <div>
                      <p className={`text-sm font-semibold ${text(dark)}`}>
                        {isMeOweing ? 'You' : debt.debtorName} <span className="font-normal text-gray-500">owe</span> {debt.creditorId === user.id ? 'You' : debt.creditorName}
                      </p>
                      <p className="text-lg font-bold text-red-500">₹{debt.amount.toLocaleString()}</p>
                    </div>
                    
                    {isMeOweing && (
                      <button 
                        onClick={() => handleInitiatePayment(debt.creditorId, debt.amount)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <MdPayment /> Pay Now
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Pending Confirmations */}
        <div className={`${card(dark)} p-6`}>
          <h2 className={`text-sm font-bold uppercase tracking-wider mb-4 ${subtext(dark)}`}>
            Pending Confirmations
          </h2>
          {pendingSettlements.length === 0 ? (
            <p className={`text-sm ${subtext(dark)}`}>No pending payments to confirm.</p>
          ) : (
            <div className="space-y-4">
              {pendingSettlements.map((settlement) => {
                const amIReceiving = settlement.payee.id === user.id;

                return (
                  <div key={settlement.id} className={`p-4 rounded-xl border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-900/50 flex items-center justify-between`}>
                    <div>
                      <p className={`text-sm font-semibold ${text(dark)}`}>
                        {settlement.payer.name} sent <span className="text-emerald-500">₹{settlement.amount}</span>
                      </p>
                      <p className={`text-xs ${subtext(dark)}`}>
                        {amIReceiving ? 'Waiting for your confirmation' : 'Waiting for them to confirm'}
                      </p>
                    </div>

                    {amIReceiving && (
                      <button 
                        onClick={() => handleConfirmPayment(settlement.id)}
                        className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                      >
                        <MdCheckCircle /> Confirm Receipt
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}