import { useState, useRef, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useTheme } from '../../context/ThemeContext';
import { MdChat, MdClose, MdSend, MdAutoAwesome } from 'react-icons/md';

export default function AiChatWidget() {
  const { dark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hi! I'm your AI Advisor. Ask me anything about your recent spending." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // const handleSend = async (e) => {
  //   e.preventDefault();
  //   if (!input.trim() || loading) return;

  //   const userMsg = input.trim();
  //   setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
  //   setInput('');
  //   setLoading(true);

  //   try {
  //     const res = await api.post('/chat', { question: userMsg });
  //     setMessages(prev => [...prev, { sender: 'ai', text: res.data.answer }]);
  //   } catch (error) {
  //     setMessages(prev => [...prev, { sender: 'ai', text: "Error connecting to AI." }]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    
    // 1. Create the new history array including the user's new message
    const chatHistory = [...messages, { sender: 'user', text: userMsg }];
    
    // 2. Update the UI instantly
    setMessages(chatHistory);
    setInput('');
    setLoading(true);

    try {
      // 3. Send the FULL history array to the backend
      const res = await api.post('/chat', { history: chatHistory });
      
      setMessages(prev => [...prev, { sender: 'ai', text: res.data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Error connecting to AI." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 z-50
          ${isOpen ? 'hidden' : 'flex'} 
          ${dark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'}`}
      >
        <MdAutoAwesome className="text-2xl" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-80 sm:w-96 rounded-2xl shadow-2xl border flex flex-col z-50 transition-all transform origin-bottom-right
        ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}
        ${dark ? 'bg-[#141414] border-[#2A2A2A]' : 'bg-white border-gray-200'}
        `} style={{ height: '500px', maxHeight: '80vh' }}>
        
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b rounded-t-2xl
          ${dark ? 'bg-[#1A1A1A] border-[#2A2A2A]' : 'bg-blue-50 border-blue-100'}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <MdAutoAwesome className="text-white text-sm" />
            </div>
            <h3 className={`font-semibold text-sm ${dark ? 'text-white' : 'text-blue-900'}`}>FinanceVUE AI</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className={dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}>
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm
                ${msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : dark ? 'bg-[#2A2A2A] text-gray-200 rounded-bl-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className={`px-4 py-3 rounded-2xl rounded-bl-none flex gap-1
                ${dark ? 'bg-[#2A2A2A]' : 'bg-gray-100'}`}>
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className={`p-3 border-t flex gap-2
          ${dark ? 'border-[#2A2A2A]' : 'border-gray-200'}`}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your spending..."
            className={`flex-1 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${dark ? 'bg-[#0A0A0A] text-white border border-[#2A2A2A]' : 'bg-gray-50 border border-gray-300'}`}
          />
          <button type="submit" disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center disabled:opacity-50 transition-opacity">
            <MdSend className="text-lg" />
          </button>
        </form>
      </div>
    </>
  );
}