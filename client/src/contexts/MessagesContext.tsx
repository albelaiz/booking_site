
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { messagesApi } from "../lib/api";

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
  updatedAt: string;
}

interface MessagesContextType {
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateMessageStatus: (id: number, status: Message['status']) => Promise<void>;
  deleteMessage: (id: number) => Promise<void>;
  refreshMessages: () => Promise<void>;
  loading: boolean;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const MessagesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const data = await messagesApi.getAll();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const addMessage = async (messageData: Omit<Message, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    try {
      await messagesApi.create(messageData);
      await fetchMessages(); // Refresh to get the latest messages
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  };

  const updateMessageStatus = async (id: number, status: Message['status']) => {
    try {
      await messagesApi.update(id.toString(), { status });
      await fetchMessages(); // Refresh to get the latest messages
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  };

  const deleteMessage = async (id: number) => {
    try {
      await messagesApi.delete(id.toString());
      await fetchMessages(); // Refresh to get the latest messages
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  };

  return (
    <MessagesContext.Provider value={{ 
      messages, 
      addMessage, 
      updateMessageStatus, 
      deleteMessage, 
      refreshMessages: fetchMessages,
      loading 
    }}>
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
