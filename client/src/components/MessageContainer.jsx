import React, { useState, useRef, useEffect } from 'react';

const MessageContainer = ({ activeContact, messages }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages when messages change or active contact changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, activeContact]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    // In a real app, you would send the message to the server here
    console.log('Sending message:', newMessage);
    
    // Clear the input field
    setNewMessage('');
  };

  // If no active contact is selected, show a placeholder
  if (!activeContact) {
    return (
      <div className="flex-grow flex items-center justify-center bg-base-100">
        <div className="text-center p-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-base-content opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="mt-4 text-xl font-medium">Select a contact to start messaging</h3>
          <p className="mt-2 text-base-content opacity-60">Choose from your contacts list to start a conversation</p>
        </div>
      </div>
    );
  }

  // Filter messages for the active contact
  const contactMessages = messages.filter(
    msg => msg.senderId === activeContact.id || msg.receiverId === activeContact.id
  );

  return (
    <div className="flex-grow flex flex-col bg-base-100">
      {/* Header */}
      <div className="p-4 border-b border-base-300 flex items-center">
        <div className="avatar">
          <div className="w-10 h-10 rounded-full">
            <img src={activeContact.avatar || '/avatar.png'} alt={activeContact.name} />
          </div>
        </div>
        <div className="ml-3">
          <div className="font-medium">{activeContact.name}</div>
          <div className="text-xs opacity-70">
            {activeContact.status === 'online' ? 'Online' : 'Offline'}
          </div>
        </div>
        <button className="btn btn-ghost btn-circle ml-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {contactMessages.length === 0 ? (
          <div className="text-center py-8 text-base-content opacity-60">
            No messages yet. Start the conversation!
          </div>
        ) : (
          contactMessages.map((msg) => {
            const isMe = msg.senderId !== activeContact.id;
            return (
              <div key={msg.id} className={`chat ${isMe ? 'chat-end' : 'chat-start'}`}>
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img src={isMe ? '/avatar.png' : activeContact.avatar || '/avatar.png'} alt="" />
                  </div>
                </div>
                <div className="chat-header">
                  {isMe ? 'You' : activeContact.name}
                  <time className="text-xs opacity-50 ml-1">{msg.time}</time>
                </div>
                <div className={`chat-bubble ${isMe ? 'chat-bubble-primary' : ''}`}>{msg.content}</div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-base-300 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="input input-bordered flex-grow"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button 
          type="submit" 
          className="btn btn-primary btn-circle"
          disabled={newMessage.trim() === ''}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default MessageContainer;