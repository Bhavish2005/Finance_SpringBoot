import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventApi } from '../api/eventApi';
import { useTheme } from '../context/ThemeContext';
import { card, text, subtext } from '../utils/cn';
import { MdGroup, MdAdd, MdFlightTakeoff, MdClose } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function EventsDashboardPage() {
  const { dark } = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invites, setInvites] = useState([]);
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTripData, setNewTripData] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    eventApi.getEvents().then(res => setEvents(res.data)).catch(console.error);
    eventApi.getInvites().then(res => setInvites(res.data)).catch(console.error);
    setLoading(false);
  };
  const handleInviteResponse = async (inviteId, accept) => {
    try {
      await eventApi.respondToInvite(inviteId, accept);
      toast.success(accept ? 'Joined Trip!' : 'Invite Declined');
      fetchEvents(); // Refresh to show the new trip
    } catch (err) {
      toast.error('Failed to process invite');
    }
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await eventApi.createEvent(newTripData);
      toast.success('Trip created successfully!');
      setIsModalOpen(false);
      setNewTripData({ name: '', description: '' });
      fetchEvents(); // Refresh the list
    } catch (err) {
      toast.error('Failed to create trip');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Events...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${text(dark)}`}>Groups & Trips</h1>
          <p className={`text-sm ${subtext(dark)}`}>Split expenses effortlessly with friends.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <MdAdd /> New Trip
        </button>
      </div>
      {invites.length > 0 && (
        <div className="mb-6 space-y-3">
          <h2 className={`text-sm font-bold uppercase tracking-wider ${subtext(dark)}`}>Pending Invites</h2>
          {invites.map(invite => (
            <div key={invite.inviteId} className={`p-4 rounded-xl border flex items-center justify-between shadow-sm
              ${dark ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-100'}`}>
              <div>
                <p className={`text-sm font-semibold ${text(dark)}`}>
                  <span className="text-indigo-500">{invite.inviterName}</span> invited you to <span className="font-bold">"{invite.eventName}"</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleInviteResponse(invite.inviteId, false)} className="px-3 py-1.5 text-xs font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-lg">Decline</button>
                <button onClick={() => handleInviteResponse(invite.inviteId, true)} className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Accept & Join</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Grid of Trips */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.length === 0 ? (
          <div className="col-span-full p-10 text-center border border-dashed rounded-2xl dark:border-gray-800">
            <p className={subtext(dark)}>No active trips. Create one to start splitting bills!</p>
          </div>
        ) : (
          events.map(event => (
            <Link key={event.id} to={`/events/${event.id}/settle`} 
                  className={`${card(dark)} p-5 hover:shadow-lg transition-all hover:-translate-y-1 block`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <MdFlightTakeoff />
                </div>
                <div>
                  <h3 className={`font-bold ${text(dark)}`}>{event.name}</h3>
                  <p className={`text-xs ${subtext(dark)}`}>{event.status}</p>
                </div>
              </div>
              <p className={`text-sm mt-2 font-medium text-blue-500`}>View Ledgers & Settle Up →</p>
            </Link>
          ))
        )}
      </div>

      {/* Create Trip Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 
            ${dark ? 'bg-[#1A1A1A] border border-[#2A2A2A]' : 'bg-white border border-gray-100'}`}>
            
            <button onClick={() => setIsModalOpen(false)} className={`absolute top-4 right-4 ${subtext(dark)} hover:text-red-500`}>
              <MdClose className="text-xl" />
            </button>
            
            <h2 className={`text-xl font-bold mb-4 ${text(dark)}`}>Create a New Trip</h2>
            
            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div>
                <label className={`block text-xs font-medium mb-1 ${subtext(dark)}`}>Trip Name</label>
                <input 
                  type="text" required 
                  value={newTripData.name} onChange={(e) => setNewTripData({...newTripData, name: e.target.value})}
                  className={`w-full p-3 rounded-xl text-sm border focus:ring-2 focus:ring-blue-500 outline-none transition-all
                    ${dark ? 'bg-[#141414] border-[#2A2A2A] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  placeholder="e.g., Goa Trip 2026"
                />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${subtext(dark)}`}>Description (Optional)</label>
                <input 
                  type="text" 
                  value={newTripData.description} onChange={(e) => setNewTripData({...newTripData, description: e.target.value})}
                  className={`w-full p-3 rounded-xl text-sm border focus:ring-2 focus:ring-blue-500 outline-none transition-all
                    ${dark ? 'bg-[#141414] border-[#2A2A2A] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  placeholder="Weekend getaway..."
                />
              </div>
              <button 
                type="submit" disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-all"
              >
                {isSubmitting ? 'Creating...' : 'Create Trip'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}