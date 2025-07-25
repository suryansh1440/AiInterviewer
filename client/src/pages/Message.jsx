import React, { useState } from 'react';
import MessageSidebar from '../components/MessageSidebar';
import MessageContainer from '../components/MessageContainer';
import { useMessageStore } from '../store/useMessageStore';

const Message = () => {
  // Demo data for contacts
  const demoContacts = [
    { id: 1, name: 'Henry Jackson', status: 'offline', avatar: '/avatar.png' },
    { id: 2, name: 'Alexander Martin', status: 'offline', avatar: '/avatar.png' },
    { id: 3, name: 'Daniel Rodriguez', status: 'offline', avatar: '/avatar.png' },
    { id: 4, name: 'Srijal Singh', status: 'online', avatar: '/avatar.png' },
    { id: 5, name: 'Bhvyi', status: 'online', avatar: '/avatar.png' },
    { id: 6, name: 'Jon', status: 'online', avatar: '/avatar.png' },
    { id: 7, name: 'Vinamra Patel', status: 'offline', avatar: '/avatar.png' },
  ];

  // Demo data for messages
  const demoMessages = [
    { id: 1, senderId: 4, receiverId: 0, content: 'Byyyy', time: '22:39' },
    { id: 2, senderId: 0, receiverId: 4, content: 'ok', time: '22:39' },
    { id: 3, senderId: 0, receiverId: 4, content: 'hiii', time: '11:23' },
    { id: 4, senderId: 0, receiverId: 5, content: 'hiii', time: '11:24' },
    { id: 5, senderId: 0, receiverId: 6, content: 'Hiii', time: '10:51' },
  ];

  const {users,getUsers,getMessages} = useMessageStore();

  // Set Srijal Singh as the default active contact
  const [activeContact, setActiveContact] = useState(demoContacts.find(contact => contact.id === 4));

  return (
    <div className='flex w-full h-[calc(100vh-120px)] bg-base-100 rounded-lg shadow-md overflow-hidden'>
      <MessageSidebar 
        contacts={demoContacts} 
        activeContact={activeContact} 
        setActiveContact={setActiveContact} 
      />
      <MessageContainer 
        activeContact={activeContact} 
        messages={demoMessages} 
      />
    </div>
  );
};

export default Message;
