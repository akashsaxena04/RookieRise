import React, { useState, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI } from '../services/api';
import './ChatPage.css';

function ChatPage() {
  const { conversations, messages, fetchConversations, fetchMessages, sendMessage } = useChat();
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [userMap, setUserMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConversations = async () => {
      await fetchConversations(user._id);
      setLoading(false);
    };
    loadConversations();
  }, [user._id, fetchConversations]);

  useEffect(() => {
    if (conversations.length > 0) {
      setUserMap(prev => {
        const newMap = { ...prev };
        conversations.forEach(conv => {
           conv.participants.forEach(p => {
              if (p && typeof p === 'object' && p._id) {
                 newMap[p._id] = p;
              }
           });
        });
        return newMap;
      });
    }
  }, [conversations]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
      
      // Load user info for participants
      selectedConversation.participants.forEach(async (p) => {
        const participantId = typeof p === 'object' ? p._id : p;
        if (participantId !== user._id && !userMap[participantId]) {
          const result = await usersAPI.getUserById(participantId);
          if (result.success) {
            setUserMap(prev => ({
              ...prev,
              [participantId]: result.user
            }));
          }
        }
      });
    }
  }, [selectedConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    await sendMessage(selectedConversation._id, user._id, messageText);
    setMessageText('');
  };

  const conversationMessages = selectedConversation ? (messages[selectedConversation._id] || []) : [];
  const otherParticipantId = selectedConversation
    ? selectedConversation.participants.map(p => typeof p === 'object' ? p._id : p).find(id => id !== user._id)
    : null;
  const otherUser = otherParticipantId ? userMap[otherParticipantId] : null;

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Conversations List */}
        <aside className="conversations-sidebar">
          <h2>Messages</h2>
          {loading ? (
            <p className="loading-text">Loading conversations...</p>
          ) : conversations.length === 0 ? (
            <div className="empty-conversations">
              <p>No conversations yet</p>
              <p>Start chatting with recruiters!</p>
            </div>
          ) : (
            <div className="conversations-list">
              {conversations.map(conv => (
                <div
                  key={conv._id}
                  className={`conversation-item ${selectedConversation?._id === conv._id ? 'active' : ''}`}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <div className="conversation-info">
                    <p className="conversation-name">
                      {conv.participants
                        .map(p => typeof p === 'object' ? p._id : p)
                        .filter(id => id !== user._id)
                        .map(id => userMap[id]?.name || `User ${id.toString().substring(0, 4)}...`)
                        .join(', ')}
                    </p>
                    <p className="conversation-preview">
                      {conv.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Chat Area */}
        <main className="chat-main">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-header-info">
                  <h3>{otherUser?.name || 'User'}</h3>
                  {otherUser?.company && <p className="company-name">{otherUser.company}</p>}
                </div>
              </div>

              {/* Messages */}
              <div className="messages-area">
                {conversationMessages.length === 0 ? (
                  <div className="no-messages">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  conversationMessages.map(msg => (
                    <div
                      key={msg._id}
                      className={`message ${msg.senderId === user._id ? 'sent' : 'received'}`}
                    >
                      <div className="message-content">{msg.text}</div>
                      <span className="message-time">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="message-form">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="message-input"
                />
                <button type="submit" className="btn-send" disabled={!messageText.trim()}>
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="chat-empty">
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ChatPage;
