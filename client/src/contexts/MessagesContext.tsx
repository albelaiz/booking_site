
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

interface MessagesContextType {
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'status' | 'createdAt'>) => void;
  updateMessageStatus: (id: string, status: Message['status']) => void;
  deleteMessage: (id: string) => void;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const MessagesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (messageData: Omit<Message, 'id' | 'status' | 'createdAt'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Date.now().toString(),
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  const updateMessageStatus = (id: string, status: Message['status']) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, status } : msg
      )
    );
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  return (
    <MessagesContext.Provider value={{ messages, addMessage, updateMessageStatus, deleteMessage }}>
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};
