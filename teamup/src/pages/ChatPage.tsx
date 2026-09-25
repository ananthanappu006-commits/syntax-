import React, { useState } from 'react';
import {
  MessageSquare,
  Users,
  Send,
  Paperclip,
  CheckCheck,
  Shield,
  Search,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ChatPage: React.FC = () => {
  const { conversations, messages, currentUser, sendMessage } = useApp();
  const [selectedConvId, setSelectedConvId] = useState<string>(
    conversations[0]?.id || ''
  );
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const activeConversation = conversations.find((c) => c.id === selectedConvId) || conversations[0];
  const activeMessages = activeConversation ? messages[activeConversation.id] || [] : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;
    sendMessage(activeConversation.id, inputText);
    setInputText('');
  };

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-uber">
      {/* Header Banner */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass-pill text-[12px] font-semibold text-[#ff4d15] mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" /> Direct Teammate &amp; Squad Channels
          </div>
          <h1 className="text-3xl sm:text-4xl font-moara font-bold text-slate-900 tracking-tight">
            Collaborator Messages
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time chat with matched candidates, team captains, and hackathon squad members.
          </p>
        </div>
      </div>

      <div className="h-[76vh] rounded-3xl liquid-glass border border-white/90 overflow-hidden flex flex-col md:flex-row shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)]">
        {/* Left: Conversations List */}
        <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-200/70 flex flex-col bg-white/40 backdrop-blur-xl">
          {/* Header */}
          <div className="p-4 border-b border-slate-200/60">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2 font-uber">
                <MessageSquare className="w-4 h-4 text-[#ff4d15]" />
                Conversations
              </h2>
              <span className="text-[11px] text-slate-500 font-medium px-2 py-0.5 rounded-full bg-slate-100">
                {conversations.length} Active
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-white/80 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15] transition"
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConversation?.id;
              const isTeamChat = conv.type === 'team';

              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-[#ff4d15]/8 border-l-4 border-[#ff4d15] shadow-xs'
                      : 'hover:bg-white/60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center font-bold text-xs shadow-xs ${
                    isTeamChat ? 'bg-[#ff4d15]/10 text-[#ff4d15]' : 'bg-slate-900 text-white'
                  }`}>
                    {isTeamChat ? (
                      <Users className="w-5 h-5 text-[#ff4d15]" />
                    ) : (
                      conv.title.slice(0, 2).toUpperCase()
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{conv.title}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                        {conv.lastMessageTimestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {conv.lastMessage || 'No messages yet.'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Area */}
        {activeConversation ? (
          <div className="flex-1 flex flex-col justify-between bg-white/30 backdrop-blur-xl">
            {/* Top Bar */}
            <div className="p-4 border-b border-slate-200/60 flex items-center justify-between bg-white/70">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shadow-xs ${
                  activeConversation.type === 'team'
                    ? 'bg-[#ff4d15]/10 text-[#ff4d15]'
                    : 'bg-slate-900 text-white'
                }`}>
                  {activeConversation.type === 'team' ? (
                    <Users className="w-4 h-4 text-[#ff4d15]" />
                  ) : (
                    activeConversation.title.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 font-uber">{activeConversation.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>
                      {activeConversation.type === 'team'
                        ? `${activeConversation.participantIds.length} Squad Members Online`
                        : 'Active Now'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {activeMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <div className="w-8 h-8 rounded-xl overflow-hidden bg-slate-200 shrink-0 shadow-xs border border-white">
                        <img
                          src={msg.senderAvatar}
                          alt={msg.senderName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div
                      className={`max-w-sm sm:max-w-md rounded-2xl p-3.5 text-xs leading-relaxed transition shadow-sm ${
                        isMe
                          ? 'bg-[#ff4d15] text-white rounded-br-xs shadow-[0_6px_20px_-4px_rgba(255,77,21,0.35)]'
                          : 'liquid-glass text-slate-800 rounded-bl-xs border border-white/80'
                      }`}
                    >
                      {!isMe && (
                        <div className="font-bold text-[10px] text-[#ff4d15] mb-1">
                          {msg.senderName}
                        </div>
                      )}
                      <div>{msg.text}</div>
                      <div
                        className={`text-[9px] mt-1.5 text-right flex items-center justify-end gap-1 ${
                          isMe ? 'text-white/80' : 'text-slate-400'
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                        {isMe && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-slate-200/60 bg-white/70">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message ${activeConversation.title}...`}
                  className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15] shadow-xs transition"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-3 rounded-2xl btn-primary-coral disabled:opacity-40 shadow-sm transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400 text-xs">
            Select a conversation to start messaging.
          </div>
        )}
      </div>
    </div>
  );
};
