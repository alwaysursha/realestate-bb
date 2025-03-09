'use client';

import { useState, useEffect } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Show popup after 10 seconds
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const dismissPopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-yellow-500 text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold">Real Estate Chat</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-[calc(100%-120px)] overflow-y-auto p-4">
            {/* Welcome Message */}
            <div className="mb-4">
              <div className="bg-yellow-50 text-yellow-800 rounded-lg p-3 max-w-[80%]">
                <p className="text-sm">👋 Hello! How can I help you today? I can assist you with:</p>
                <ul className="mt-2 text-sm list-disc list-inside">
                  <li>Property inquiries</li>
                  <li>Schedule viewings</li>
                  <li>Price information</li>
                  <li>Location details</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button with Popup */}
      <div className="relative">
        {/* Popup Message */}
        {!isOpen && showPopup && (
          <div className="absolute bottom-full right-0 mb-4 bg-gradient-to-r from-yellow-200 to-yellow-300 text-yellow-700 px-4 py-2.5 rounded-2xl shadow-lg border border-yellow-200 whitespace-nowrap animate-bounce-gentle transform transition-all duration-300 hover:scale-105 max-w-[200px]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-semibold animate-nudge inline-block tracking-wide">✨ Let's Talk! ✨</p>
              <button 
                onClick={dismissPopup}
                className="ml-1 text-yellow-600/80 hover:text-yellow-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-yellow-300 border-r border-b border-yellow-200"></div>
          </div>
        )}

        {/* Chat Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-yellow-500 text-white p-4 rounded-full shadow-lg hover:bg-yellow-600 transition-colors flex items-center justify-center hover:scale-110 transform duration-300"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
} 