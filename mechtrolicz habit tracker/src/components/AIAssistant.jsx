import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import {
  Sparkles,
  X,
  Send,
  Trash2,
  Bot,
  User,
  ChevronDown,
  Loader2,
  Zap,
  Target,
  TrendingUp,
  Clock
} from 'lucide-react';

// ─── Gemini Client Setup ────────────────────────────────────────────────────
// We call the API client-side with an API key stored in env (Vite exposes VITE_ prefixed vars)
// Users set VITE_GEMINI_API_KEY in a .env file at the project root.
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Fallback model cascade — tried in order when a model is unavailable (503/429/404)
const MODEL_CASCADE = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.5-flash-lite',
];

// ─── Quick Prompt Suggestions ────────────────────────────────────────────────
const QUICK_PROMPTS = [
  { icon: Target, label: 'Suggest habit goals', prompt: 'Suggest 5 smart daily habits for improving my productivity and health.' },
  { icon: TrendingUp, label: 'Improve my routine', prompt: 'Analyze my routine and suggest improvements to maximize consistency and energy.' },
  { icon: Clock, label: 'Morning routine tips', prompt: 'What is the best science-backed morning routine to build for sustained productivity?' },
  { icon: Zap, label: 'Motivation boost', prompt: 'Give me a motivational insight about habit building and how to push through difficult days.' },
];

// ─── Build System Context from User Data ─────────────────────────────────────
function buildSystemContext(data) {
  const totalHabits = data?.habits?.length || 0;
  const completedToday = data?.habits?.filter(h => {
    const today = new Date().toISOString().split('T')[0];
    const key = `${h.id}_${today}`;
    return data.completions?.[key]?.status === 'completed';
  }).length || 0;

  return `You are an expert AI Habit & Wellness Coach embedded inside the "Habit & Routine Planner" productivity app. 
Your role is to analyze user data, provide personalized insights, suggest improvements, motivate the user, and answer questions about habit formation, routines, nutrition, fitness, and productivity.

CURRENT USER DATA:
- Name: ${data?.user?.name || 'User'}
- Level: ${data?.user?.level || 1} — ${data?.user?.levelTitle || 'Beginner'}
- Current streak: ${data?.user?.streak || 0} days
- Longest streak: ${data?.user?.longestStreak || 0} days
- Total XP: ${data?.user?.currentXP || 0}
- Total Points: ${data?.user?.totalPoints || 0}
- Habits tracked: ${totalHabits}
- Completed today: ${completedToday} of ${totalHabits} habits

ACTIVE HABITS:
${data?.habits?.map(h => `  - ${h.name} (${h.category}, ${h.priority} priority, ${h.frequency}, ${h.target} ${h.unit}/day, streak: ${h.streak} days)`).join('\n') || '  None yet.'}

ACTIVE GOALS:
${data?.goals?.filter(g => g.status === 'active').map(g => `  - ${g.title}: ${g.currentProgress}/${g.target} ${g.unit}`).join('\n') || '  No active goals.'}

TODAY'S ROUTINE BLOCKS: ${data?.schedule?.length || 0} scheduled

INSTRUCTIONS:
- Be warm, motivating, and precise.
- Use the user's name when appropriate.
- Give actionable, specific advice grounded in behavioral science.
- Keep responses concise (under 300 words) unless the user asks for detail.
- Format responses using short paragraphs and bullet points for readability.
- Celebrate wins and streaks enthusiastically.`;
}

// ─── Main AI Assistant Component ─────────────────────────────────────────────
export default function AIAssistant({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: `👋 Hi ${data?.user?.name?.split(' ')[0] || 'there'}! I'm your **AI Habit Coach** powered by Gemini.\n\nI can see your progress — you're on a **${data?.user?.streak || 0}-day streak** and you've collected **${data?.user?.totalPoints || 0} points**!\n\nHow can I help you today? Ask me anything about habits, routines, nutrition, fitness, or motivation! 🚀`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(!GEMINI_API_KEY);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [activeApiKey, setActiveApiKey] = useState(GEMINI_API_KEY);
  const [chatSession, setChatSession] = useState(null);
  const [activeModel, setActiveModel] = useState(MODEL_CASCADE[0]);

  const messagesEndRef = useRef(null);
  const messagesAreaRef = useRef(null);
  const inputRef = useRef(null);
  const chatRef = useRef(null);

  // Auto-scroll messages container — use scrollTop on the container itself
  // NOT scrollIntoView() which bleeds scroll up to the window/body
  useEffect(() => {
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, isMinimized]);

  // Initialize a new Gemini chat session for a specific model
  const initChatSession = useCallback((apiKey, userData, model = MODEL_CASCADE[0]) => {
    if (!apiKey) return null;
    try {
      const ai = new GoogleGenAI({ apiKey });
      const session = ai.chats.create({
        model,
        config: {
          systemInstruction: buildSystemContext(userData),
          temperature: 0.85,
          maxOutputTokens: 600,
        }
      });
      return session;
    } catch (err) {
      console.error('Failed to create Gemini session:', err);
      return null;
    }
  }, []);

  // Create session when key is available
  useEffect(() => {
    if (activeApiKey && !chatSession) {
      const session = initChatSession(activeApiKey, data, activeModel);
      setChatSession(session);
    }
  }, [activeApiKey, chatSession, initChatSession, data, activeModel]);

  // Handle API key submission
  const handleApiKeySubmit = () => {
    const key = apiKeyInput.trim();
    if (!key) return;
    setActiveApiKey(key);
    setApiKeyMissing(false);
    setApiKeyInput('');
    setActiveModel(MODEL_CASCADE[0]);
    const session = initChatSession(key, data, MODEL_CASCADE[0]);
    setChatSession(session);
  };

  // Helper — is this error transient (worth trying next model)?
  const isTransientError = (err) => {
    const msg = err?.message || '';
    return msg.includes('503') || msg.includes('UNAVAILABLE') ||
           msg.includes('404') || msg.includes('NOT_FOUND') ||
           msg.includes('429') || msg.includes('quota');
  };

  // Send message to Gemini — with model fallback cascade
  const handleSendMessage = async (text) => {
    const msgText = (text || inputText).trim();
    if (!msgText || isLoading) return;

    setInputText('');
    const userMsg = { role: 'user', text: msgText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    let lastErr = null;
    // Try each model in order until one succeeds
    for (let i = 0; i < MODEL_CASCADE.length; i++) {
      const model = MODEL_CASCADE[i];
      try {
        // Re-create session if model changed or session missing
        let session = (model === activeModel && chatSession) ? chatSession : null;
        if (!session) {
          session = initChatSession(activeApiKey, data, model);
          if (!session) throw new Error('Could not initialize AI session.');
          setActiveModel(model);
          setChatSession(session);
        }

        const response = await session.sendMessage({ message: msgText });
        const responseText = response.text || 'I couldn\'t generate a response. Please try again.';

        // Show which model was used if it\'s not the primary
        const modelNote = i > 0 ? `\n\n_[Answered by ${model}]_` : '';
        setMessages(prev => [
          ...prev,
          { role: 'model', text: responseText + modelNote, timestamp: new Date() }
        ]);
        setIsLoading(false);
        return; // success — exit loop

      } catch (err) {
        lastErr = err;
        console.warn(`Model ${model} failed (${err.message}). Trying next...`);
        // Only fall through if it\'s a transient/availability error
        if (!isTransientError(err)) break;
        // Invalidate session for next model
        setChatSession(null);
      }
    }

    // All models failed
    console.error('All Gemini models failed:', lastErr);
    const errMsg = lastErr?.message?.includes('API_KEY') || lastErr?.message?.includes('400')
      ? '🔑 Invalid API key. Please check your Gemini API key and try again.'
      : `⚠️ All models are currently busy. Please try again in a moment.\n\n_Details: ${lastErr?.message || 'Unknown error'}_`;

    setMessages(prev => [
      ...prev,
      { role: 'error', text: errMsg, timestamp: new Date() }
    ]);
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'model',
      text: `Chat cleared! How can I help you next, ${data?.user?.name?.split(' ')[0] || 'there'}? 😊`,
      timestamp: new Date()
    }]);
    // Reset session so context is refreshed
    setChatSession(null);
  };

  const formatTime = (date) =>
    new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(date);

  const renderMessageText = (text) => {
    // Convert basic markdown to styled spans
    return text
      .split('\n')
      .map((line, i) => {
        // Bold
        const boldParsed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return (
          <span
            key={i}
            dangerouslySetInnerHTML={{ __html: boldParsed }}
            style={{ display: 'block' }}
          />
        );
      });
  };

  return (
    <>
      {/* ── Floating AI Button ─────────────────────────────────────────────── */}
      {!isOpen && (
        <button
          className="ai-assistant-fab"
          onClick={() => setIsOpen(true)}
          title="Open AI Habit Coach"
        >
          <div className="fab-glow-ring"></div>
          <Sparkles size={24} className="fab-icon" />
          <span className="fab-pulse-dot"></span>
        </button>
      )}

      {/* ── Chat Panel ─────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className={`ai-chat-panel ${isMinimized ? 'minimized' : ''}`} ref={chatRef}>
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-header-left">
              <div className="ai-avatar-glow">
                <Bot size={20} />
              </div>
              <div>
                <h4 className="ai-header-title">Habit AI Coach</h4>
                <span className="ai-header-status">
                  <span className="status-dot"></span>
                  Powered by Gemini
                </span>
              </div>
            </div>

            <div className="ai-header-actions">
              <button
                className="ai-header-btn"
                onClick={clearChat}
                title="Clear chat"
              >
                <Trash2 size={15} />
              </button>
              <button
                className="ai-header-btn"
                onClick={() => setIsMinimized(p => !p)}
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                <ChevronDown size={15} style={{ transform: isMinimized ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
              </button>
              <button
                className="ai-header-btn close-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* API Key Gate */}
              {apiKeyMissing ? (
                <div className="ai-api-key-gate">
                  <div className="api-key-icon">🔑</div>
                  <h4 className="api-key-title">Enter Gemini API Key</h4>
                  <p className="api-key-desc">
                    Paste your Google Gemini API key to activate the AI Coach.
                    Get one free at{' '}
                    <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="api-key-link">
                      aistudio.google.com
                    </a>
                  </p>
                  <div className="api-key-input-row">
                    <input
                      type="password"
                      className="api-key-input"
                      placeholder="AIza..."
                      value={apiKeyInput}
                      onChange={e => setApiKeyInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleApiKeySubmit()}
                      autoFocus
                    />
                    <button
                      className="api-key-submit-btn"
                      onClick={handleApiKeySubmit}
                      disabled={!apiKeyInput.trim()}
                    >
                      Activate
                    </button>
                  </div>
                  <p className="api-key-hint">
                    💡 For production: add <code>VITE_GEMINI_API_KEY=your_key</code> to a <code>.env</code> file at the project root.
                  </p>
                </div>
              ) : (
                <>
                  {/* Messages Area — ref used for direct scrollTop, NOT scrollIntoView */}
                  <div
                    className="ai-messages-area"
                    ref={messagesAreaRef}
                    style={{ overscrollBehavior: 'contain' }}
                  >
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`ai-message-row ${msg.role === 'user' ? 'user-row' : 'model-row'}`}
                      >
                        {msg.role !== 'user' && (
                          <div className="ai-msg-avatar model-avatar">
                            {msg.role === 'error' ? '⚠️' : <Bot size={14} />}
                          </div>
                        )}

                        <div className={`ai-message-bubble ${msg.role === 'user' ? 'user-bubble' : msg.role === 'error' ? 'error-bubble' : 'model-bubble'}`}>
                          <div className="bubble-text">
                            {renderMessageText(msg.text)}
                          </div>
                          <span className="bubble-time">{formatTime(msg.timestamp)}</span>
                        </div>

                        {msg.role === 'user' && (
                          <div className="ai-msg-avatar user-avatar">
                            <User size={14} />
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Loading indicator */}
                    {isLoading && (
                      <div className="ai-message-row model-row">
                        <div className="ai-msg-avatar model-avatar">
                          <Bot size={14} />
                        </div>
                        <div className="ai-message-bubble model-bubble typing-bubble">
                          <div className="typing-dots">
                            <span></span><span></span><span></span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Prompt Suggestions */}
                  {messages.length <= 1 && (
                    <div className="ai-quick-prompts">
                      {QUICK_PROMPTS.map((qp, i) => {
                        const Icon = qp.icon;
                        return (
                          <button
                            key={i}
                            className="ai-quick-prompt-btn"
                            onClick={() => handleSendMessage(qp.prompt)}
                            disabled={isLoading}
                          >
                            <Icon size={13} />
                            <span>{qp.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Input Row */}
                  <div className="ai-input-row">
                    <textarea
                      ref={inputRef}
                      className="ai-input-textarea"
                      placeholder="Ask me anything about habits, nutrition, fitness..."
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={1}
                      disabled={isLoading}
                    />
                    <button
                      className="ai-send-btn"
                      onClick={() => handleSendMessage()}
                      disabled={!inputText.trim() || isLoading}
                      title="Send message"
                    >
                      {isLoading
                        ? <Loader2 size={18} className="spin-icon" />
                        : <Send size={18} />
                      }
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
