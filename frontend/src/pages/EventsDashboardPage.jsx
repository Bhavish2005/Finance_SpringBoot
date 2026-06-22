import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventApi } from '../api/eventApi';
import { useTheme } from '../context/ThemeContext';
import { card, text, subtext } from '../utils/cn';
import { MdGroup, MdAdd, MdFlightTakeoff } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function EventsDashboardPage() {
  const { dark } = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventApi.getEvents()
      .then(res => setEvents(res.data))
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Events...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${text(dark)}`}>Groups & Trips</h1>
          <p className={`text-sm ${subtext(dark)}`}>Split expenses effortlessly with friends.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          <MdAdd /> New Trip
        </button>
      </div>

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
    </div>
  );
}