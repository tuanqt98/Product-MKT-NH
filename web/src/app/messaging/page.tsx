"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Bot,
  User,
  Send,
  RefreshCw,
  Check,
  CheckCheck,
  Sparkles,
  PauseCircle,
  PlayCircle,
  ChevronLeft,
  Inbox,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  text: string;
  timestamp: string;
  source: 'customer' | 'ai' | 'admin';
  aiSuggestion?: string;
  status: 'sent' | 'pending' | 'suggested';
}

interface Conversation {
  id: string;
  customerName: string;
  avatarUrl?: string;
  messages: Message[];
  status: 'ai_handling' | 'human_handling' | 'paused';
  pausedUntil?: string;
  lastMessageAt: string;
  unreadCount: number;
  createdAt: string;
  summary?: string;
  tags?: string[];
  leadScore?: number;
  nextAction?: string;
  lastAnalyzedAt?: string;
}

const CONVERSATION_REFRESH_MS = 30000;
const AUTO_REPLY_POLL_MS = 60000;

export default function MessagingInbox() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lấy danh sách conversations
  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/messaging/conversations');
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Lấy chi tiết conversation
  const fetchConversation = async (id: string) => {
    try {
      const res = await fetch(`/api/messaging/conversations?id=${id}`);
      const data = await res.json();
      setSelectedConv(data);
    } catch (err) {
      console.error('Failed to fetch conversation:', err);
    }
  };

  useEffect(() => {
    const firstLoad = window.setTimeout(() => {
      void fetchConversations();
    }, 0);
    // Auto-refresh danh sách định kỳ, chỉ khi tab đang mở.
    const interval = setInterval(() => {
      if (!document.hidden) void fetchConversations();
    }, CONVERSATION_REFRESH_MS);
    
    // Poll auto-reply nhẹ hơn để tránh gây tải và hot reload liên tục ở môi trường local.
    const pollInterval = setInterval(async () => {
      if (document.hidden) return;
      try {
        await fetch('/api/facebook/auto-reply');
        // Sau khi AI trả lời xong, làm mới danh sách để thấy tin nhắn mới
        void fetchConversations();
        if (selectedId) void fetchConversation(selectedId);
      } catch (err) {
        console.error('Fast polling error:', err);
      }
    }, AUTO_REPLY_POLL_MS);

    return () => {
      clearTimeout(firstLoad);
      clearInterval(interval);
      clearInterval(pollInterval);
    };
  }, [selectedId]);

  useEffect(() => {
    if (selectedId) {
      const timer = window.setTimeout(() => {
        void fetchConversation(selectedId);
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [selectedId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConv?.messages]);

  // Gửi tin nhắn
  const handleSend = async () => {
    if (!replyText.trim() || !selectedId) return;
    setSending(true);
    try {
      await fetch('/api/messaging/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_message',
          conversationId: selectedId,
          message: replyText.trim(),
        }),
      });
      setReplyText('');
      await fetchConversation(selectedId);
      await fetchConversations();
    } catch (err) {
      console.error('Failed to send:', err);
    } finally {
      setSending(false);
    }
  };

  // Duyệt gợi ý AI
  const handleApproveSuggestion = async (suggestion: string) => {
    if (!selectedId) return;
    setSending(true);
    try {
      await fetch('/api/messaging/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve_suggestion',
          conversationId: selectedId,
          message: suggestion,
        }),
      });
      await fetchConversation(selectedId);
      await fetchConversations();
    } catch (err) {
      console.error('Failed to approve:', err);
    } finally {
      setSending(false);
    }
  };

  // Bật/tắt AI cho conversation
  const handleToggleAI = async (convId: string, currentStatus: string) => {
    const action = currentStatus === 'ai_handling' ? 'pause_ai' : 'resume_ai';
    try {
      await fetch('/api/messaging/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, conversationId: convId }),
      });
      await fetchConversations();
      if (selectedId === convId) await fetchConversation(convId);
    } catch (err) {
      console.error('Failed to toggle AI:', err);
    }
  };

  const handleAnalyzeConversation = async () => {
    if (!selectedId) return;
    setAnalyzing(true);
    try {
      const res = await fetch('/api/messaging/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analyze_conversation', conversationId: selectedId }),
      });
      const data = await res.json();
      if (data.conversation) setSelectedConv(data.conversation);
      await fetchConversations();
    } catch (err) {
      console.error('Failed to analyze conversation:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)}p`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ai_handling':
        return { text: 'AI đang trực', color: 'bg-emerald-500/20 text-emerald-400', icon: Bot };
      case 'human_handling':
        return { text: 'Người trực', color: 'bg-blue-500/20 text-blue-400', icon: User };
      case 'paused':
        return { text: 'Tạm dừng', color: 'bg-amber-500/20 text-amber-400', icon: PauseCircle };
      default:
        return { text: status, color: 'bg-white/10 text-white/60', icon: AlertCircle };
    }
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  // Tìm tin nhắn gợi ý AI chưa gửi
  const pendingSuggestions = selectedConv?.messages.filter(m => m.status === 'suggested') || [];
  const latestSuggestion = pendingSuggestions[pendingSuggestions.length - 1];

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg text-primary">
            <Inbox size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Hộp thư Messenger</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              {conversations.length} cuộc hội thoại
              {totalUnread > 0 && <span className="text-primary font-bold"> · {totalUnread} chưa đọc</span>}
              <span className="inline-flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                AI ENGINE LIVE
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={() => { fetchConversations(); if (selectedId) fetchConversation(selectedId); }}
          className="p-3 glass rounded-xl border border-white/5 hover:border-primary/30 transition-all hover:rotate-180 duration-500"
        >
          <RefreshCw size={16} />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex gap-0 lg:gap-6 min-h-0 overflow-hidden rounded-[2rem] lg:rounded-[2.5rem]">
        {/* Conversation List */}
        <div className={cn(
          "w-full lg:w-96 glass border border-white/5 flex flex-col rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden",
          mobileShowChat ? "hidden lg:flex" : "flex"
        )}>
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm cuộc hội thoại..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <span className="text-xs">Đang tải...</span>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                  <MessageSquare size={32} className="text-white/20" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white/40">Chưa có tin nhắn nào</p>
                  <p className="text-xs text-white/20 mt-1">Tin nhắn từ Fanpage sẽ hiển thị tại đây khi có khách hàng nhắn tin.</p>
                </div>
              </div>
            ) : (
              conversations.map((conv) => {
                const lastMsg = conv.messages[conv.messages.length - 1];
                const badge = getStatusBadge(conv.status);
                return (
                  <button
                    key={conv.id}
                    onClick={() => { setSelectedId(conv.id); setMobileShowChat(true); }}
                    className={cn(
                      "w-full p-4 flex items-start gap-3 text-left transition-all border-b border-white/5 hover:bg-white/5",
                      selectedId === conv.id && "bg-primary/10 border-l-2 border-l-primary"
                    )}
                  >
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {conv.customerName.charAt(0).toUpperCase()}
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-black text-white">
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold truncate">{conv.customerName}</h4>
                        <span className="text-[10px] text-muted-foreground shrink-0">{formatTime(conv.lastMessageAt)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {lastMsg?.source === 'ai' && '🤖 '}
                        {lastMsg?.source === 'admin' && '👤 '}
                        {lastMsg?.text || 'Chưa có tin nhắn'}
                      </p>
                      <div className={cn("inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider", badge.color)}>
                        <badge.icon size={10} />
                        {badge.text}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {typeof conv.leadScore === 'number' && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-black text-primary">
                            Lead {conv.leadScore}
                          </span>
                        )}
                        {(conv.tags || []).slice(0, 2).map((tag) => (
                          <span key={tag} className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-bold text-white/40">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={cn(
          "flex-1 glass border border-white/5 flex flex-col rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden",
          !mobileShowChat ? "hidden lg:flex" : "flex"
        )}>
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setMobileShowChat(false); setSelectedId(null); }}
                    className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {selectedConv.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{selectedConv.customerName}</h4>
                    <span className="text-[10px] text-muted-foreground">ID: {selectedConv.id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(() => {
                    const badge = getStatusBadge(selectedConv.status);
                    return (
                      <div className={cn("flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider", badge.color)}>
                        <badge.icon size={12} />
                        {badge.text}
                      </div>
                    );
                  })()}
                  <button
                    onClick={() => handleToggleAI(selectedConv.id, selectedConv.status)}
                    className={cn(
                      "p-2 rounded-xl border transition-all text-xs font-bold",
                      selectedConv.status === 'ai_handling'
                        ? "border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                        : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                    )}
                    title={selectedConv.status === 'ai_handling' ? 'Tạm dừng AI' : 'Bật lại AI'}
                  >
                    {selectedConv.status === 'ai_handling' ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
                  </button>
                  <button
                    onClick={handleAnalyzeConversation}
                    disabled={analyzing}
                    className="px-3 py-2 rounded-xl border border-primary/20 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider hover:bg-primary/20 disabled:opacity-50"
                  >
                    {analyzing ? 'Đang phân tích...' : 'AI phân tích'}
                  </button>
                </div>
              </div>

              {(selectedConv.summary || selectedConv.tags?.length || selectedConv.leadScore) && (
                <div className="mx-4 mt-4 rounded-2xl border border-primary/10 bg-primary/5 p-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">CRM Intelligence</p>
                      <p className="mt-2 text-sm text-white/70">{selectedConv.summary || 'Chưa có tóm tắt hội thoại.'}</p>
                      {selectedConv.nextAction && (
                        <p className="mt-2 text-xs text-emerald-300">Việc tiếp theo: {selectedConv.nextAction}</p>
                      )}
                    </div>
                    <div className="shrink-0 rounded-2xl bg-white/5 px-4 py-3 text-center">
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Lead Score</p>
                      <p className="text-2xl font-black text-primary">{selectedConv.leadScore || 0}</p>
                    </div>
                  </div>
                  {selectedConv.tags?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedConv.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-white/60">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {selectedConv.messages.map((msg) => {
                  const isCustomer = msg.source === 'customer';
                  const isAI = msg.source === 'ai';
                  const isSuggestion = msg.status === 'suggested';

                  return (
                    <div key={msg.id} className={cn("flex", isCustomer ? "justify-start" : "justify-end")}>
                      <div className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-3 relative group",
                        isCustomer && "bg-white/10 text-white",
                        isAI && !isSuggestion && "bg-emerald-600/20 text-emerald-100 border border-emerald-500/20",
                        isAI && isSuggestion && "bg-amber-600/10 text-amber-100 border border-amber-500/30 border-dashed",
                        !isCustomer && !isAI && "bg-primary/20 text-primary-foreground border border-primary/20"
                      )}>
                        {/* Source badge */}
                        <div className="flex items-center gap-1.5 mb-1">
                          {isCustomer && <User size={10} className="text-white/40" />}
                          {isAI && <Bot size={10} className={isSuggestion ? "text-amber-400" : "text-emerald-400"} />}
                          {!isCustomer && !isAI && <User size={10} className="text-primary/60" />}
                          <span className="text-[9px] font-bold uppercase tracking-wider opacity-50">
                            {isCustomer ? 'Khách' : isAI ? (isSuggestion ? 'Gợi ý AI' : 'AI') : 'Bạn'}
                          </span>
                        </div>

                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                        <div className="flex items-center justify-between mt-1.5 gap-2">
                          <span className="text-[9px] opacity-40">{formatTime(msg.timestamp)}</span>
                          {msg.status === 'sent' && <CheckCheck size={12} className="opacity-40" />}
                        </div>

                        {/* Nút duyệt gợi ý AI */}
                        {isSuggestion && (
                          <div className="mt-3 pt-3 border-t border-amber-500/20 flex gap-2">
                            <button
                              onClick={() => handleApproveSuggestion(msg.text)}
                              disabled={sending}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
                            >
                              <Check size={14} />
                              Duyệt & Gửi
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* AI Suggestion Banner */}
              {latestSuggestion && (
                <div className="mx-4 mb-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3">
                  <Sparkles size={16} className="text-amber-400 shrink-0" />
                  <p className="text-xs text-amber-200 flex-1 truncate">
                    AI gợi ý: &quot;{latestSuggestion.text.slice(0, 80)}...&quot;
                  </p>
                  <button
                    onClick={() => handleApproveSuggestion(latestSuggestion.text)}
                    className="px-3 py-1.5 bg-amber-500/20 text-amber-300 rounded-lg text-[10px] font-bold hover:bg-amber-500/30 transition-colors shrink-0"
                  >
                    Gửi ngay
                  </button>
                </div>
              )}

              {/* Reply Input */}
              <div className="p-4 border-t border-white/5">
                <div className="flex items-end gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Nhập tin nhắn trả lời..."
                      rows={1}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 pr-12 text-sm resize-none placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!replyText.trim() || sending}
                    className={cn(
                      "p-3 rounded-2xl transition-all",
                      replyText.trim()
                        ? "bg-primary text-white shadow-lg shadow-primary/25 hover:scale-105 active:scale-95"
                        : "bg-white/5 text-white/30"
                    )}
                  >
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center gap-6 p-12 text-center">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-600/10 flex items-center justify-center">
                  <MessageSquare size={48} className="text-white/10" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Zap size={18} className="text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black text-white/40">Chọn cuộc hội thoại</h3>
                <p className="text-xs text-white/20 mt-2 max-w-sm leading-relaxed">
                  Chọn một cuộc hội thoại ở bên trái để xem tin nhắn và trả lời khách hàng. AI sẽ hỗ trợ bạn soạn thảo nội dung.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
