import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { messagesAPI, conversationsAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || (process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '') : 'http://localhost:5000');

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user._id) {
        const newSocket = io(SOCKET_URL);
        
        newSocket.on('connect', () => {
            newSocket.emit('join_room', user._id);
        });

        newSocket.on('receive_message', (message) => {
            setMessages(prev => {
                const conversationMessages = prev[message.conversationId] || [];
                // Prevent duplicate messages if sender is the same client (handled by HTTP res too)
                if (conversationMessages.some(m => m._id && m._id === message._id)) {
                    return prev;
                }
                return {
                    ...prev,
                    [message.conversationId]: [...conversationMessages, message]
                };
            });
        });

        setSocket(newSocket);

        return () => newSocket.close();
    }
  }, [user]);

  const fetchConversations = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await conversationsAPI.getConversations(userId);
      if (result.success) {
        setConversations(result.conversations);
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      setError('Failed to fetch conversations');
      return { success: false, error: 'Failed to fetch conversations' };
    } finally {
      setLoading(false);
    }
  }, []);

  const createConversation = useCallback(async (participants) => {
    setLoading(true);
    setError(null);
    try {
      const result = await conversationsAPI.createConversation(participants);
      if (result.success) {
        setConversations([...conversations, result.conversation]);
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      setError('Failed to create conversation');
      return { success: false, error: 'Failed to create conversation' };
    } finally {
      setLoading(false);
    }
  }, [conversations]);

  const fetchMessages = useCallback(async (conversationId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await messagesAPI.getMessages(conversationId);
      if (result.success !== false) {
        setMessages(prev => ({
          ...prev,
          [conversationId]: result.messages || result
        }));
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      setError('Failed to fetch messages');
      return { success: false, error: 'Failed to fetch messages' };
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (conversationId, senderId, text) => {
    setLoading(true);
    setError(null);
    try {
      const result = await messagesAPI.sendMessage(conversationId, senderId, text);
      if (result.success !== false) {
        const newMessage = result.message || result;
        setMessages(prev => {
          const conversationMessages = prev[conversationId] || [];
          if (conversationMessages.some(m => m._id && m._id === newMessage._id)) return prev;
          return {
             ...prev,
             [conversationId]: [...conversationMessages, newMessage]
          };
        });
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      setError('Failed to send message');
      return { success: false, error: 'Failed to send message' };
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (conversationId) => {
    try {
      const result = await messagesAPI.markAsRead(conversationId);
      if (result.success) {
        setMessages(prev => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).map(msg => ({
            ...msg,
            read: true
          }))
        }));
      }
      return result;
    } catch (err) {
      return { success: false, error: 'Failed to mark as read' };
    }
  }, []);

  const value = {
    conversations,
    messages,
    loading,
    error,
    fetchConversations,
    createConversation,
    fetchMessages,
    sendMessage,
    markAsRead
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
