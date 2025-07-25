import React, { useState } from 'react';

const MessageSidebar = ({ contacts, activeContact, setActiveContact }) => {
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  
  // Filter contacts based on online status if showOnlineOnly is true
  const filteredContacts = showOnlineOnly 
    ? contacts.filter(contact => contact.status === 'online')
    : contacts;

  return (
    <div className="h-full bg-base-200 w-72 flex flex-col border-r border-base-300">
      <div className="p-4 border-b border-base-300">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h10" />
          </svg>
          Contacts
        </h2>
        <div className="form-control mt-2">
          <label className="cursor-pointer label justify-start gap-2">
            <input 
              type="checkbox" 
              className="toggle toggle-sm toggle-primary" 
              checked={showOnlineOnly}
              onChange={() => setShowOnlineOnly(!showOnlineOnly)}
            />
            <span className="label-text">Show online only ({contacts.filter(c => c.status === 'online').length} online)</span>
          </label>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-grow scrollbar-hide">
        {filteredContacts.map((contact) => (
          <div 
            key={contact.id}
            className={`flex items-center p-3 hover:bg-base-300 cursor-pointer transition-colors ${activeContact?.id === contact.id ? 'bg-base-300' : ''}`}
            onClick={() => setActiveContact(contact)}
          >
            <div className="avatar relative">
              <div className="w-12 h-12 rounded-full">
                <img src={contact.avatar || '/avatar.png'} alt={contact.name} />
              </div>
              {contact.status === 'online' && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-base-200"></span>
              )}
            </div>
            <div className="ml-3 flex-grow">
              <div className="font-medium">{contact.name}</div>
              <div className="text-sm opacity-70 truncate">{contact.status === 'offline' ? 'Offline' : 'Online'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageSidebar;