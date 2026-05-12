"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Send, ArrowLeft, Bot, User, Loader2, Copy, CheckCircle2, Sparkles,
  Download, Trash2, History, X, ImagePlus, Share2, Globe, Columns, 
  MessageSquare, Plus, Edit2, Layout
} from 'lucide-react';
import { cn } from '@/lib/utils';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  variation?: 'A' | 'B';
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  lastMessage?: string;
}

export default function SkillExecutionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [skill, setSkill] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // 2.2: Session Management
  const [sessionId, setSessionId] = useState<string>("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [showSessions, setShowSessions] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  // 2.5: Comparison Mode
  const [isCompareMode, setIsCompareMode] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesB, setMessagesB] = useState<Message[]>([]); // For variation B in compare mode
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ base64: string; mimeType: string; preview: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollRefB = useRef<HTMLDivElement>(null);

  // Initialize sessions and current sessionId
  useEffect(() => {
    if (id) {
      const savedSessions = localStorage.getItem(`nh-sessions-${id}`);
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions);
        setSessions(parsed);
        if (parsed.length > 0) {
          setSessionId(parsed[0].id);
        } else {
          createNewSession();
        }
      } else {
        createNewSession();
      }
    }
  }, [id]);

  // Load messages when sessionId changes
  useEffect(() => {
    if (id && sessionId) {
      const savedA = localStorage.getItem(`nh-chat-${id}-${sessionId}-A`);
      const savedB = localStorage.getItem(`nh-chat-${id}-${sessionId}-B`);
      
      if (savedA) {
        try { setMessages(JSON.parse(savedA)); } catch { setMessages([]); }
      } else {
        setMessages([]);
      }

      if (savedB) {
        try { setMessagesB(JSON.parse(savedB)); } catch { setMessagesB([]); }
      } else {
        setMessagesB([]);
      }
    }
  }, [id, sessionId]);

  // Save messages and update session last message
  useEffect(() => {
    if (id && sessionId && (messages.length > 0 || messagesB.length > 0)) {
      localStorage.setItem(`nh-chat-${id}-${sessionId}-A`, JSON.stringify(messages));
      localStorage.setItem(`nh-chat-${id}-${sessionId}-B`, JSON.stringify(messagesB));
      
      // Update session list with last message
      const lastMsg = messages[messages.length - 1]?.content || "";
      if (lastMsg) {
        setSessions(prev => {
          const updated = prev.map(s => s.id === sessionId ? { ...s, lastMessage: lastMsg } : s);
          localStorage.setItem(`nh-sessions-${id}`, JSON.stringify(updated));
          return updated;
        });
      }
    }
  }, [messages, messagesB, id, sessionId]);

  const createNewSession = () => {
    const newId = uuidv4();
    const newSession: ChatSession = {
      id: newId,
      title: `Hội thoại mới ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      createdAt: Date.now()
    };
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    setSessionId(newId);
    setMessages([]);
    setMessagesB([]);
    localStorage.setItem(`nh-sessions-${id}`, JSON.stringify(updatedSessions));
    setShowSessions(false);
  };

  const deleteSession = (sid: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== sid);
    setSessions(updated);
    localStorage.setItem(`nh-sessions-${id}`, JSON.stringify(updated));
    localStorage.removeItem(`nh-chat-${id}-${sid}-A`);
    localStorage.removeItem(`nh-chat-${id}-${sid}-B`);
    if (sessionId === sid) {
      if (updated.length > 0) setSessionId(updated[0].id);
      else createNewSession();
    }
  };

  const renameSession = (sid: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const session = sessions.find(s => s.id === sid);
    if (session) {
      setEditingSessionId(sid);
      setEditTitle(session.title);
    }
  };

  const saveTitle = () => {
    if (editingSessionId) {
      const updated = sessions.map(s => s.id === editingSessionId ? { ...s, title: editTitle } : s);
      setSessions(updated);
      localStorage.setItem(`nh-sessions-${id}`, JSON.stringify(updated));
      setEditingSessionId(null);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert('Hình ảnh quá lớn. Vui lòng chọn ảnh dưới 4MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      setSelectedImage({ base64, mimeType: file.type, preview: result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: uuidv4(), role: 'user', content: input, image: selectedImage?.preview };
    
    setMessages(prev => [...prev, userMessage]);
    if (isCompareMode) setMessagesB(prev => [...prev, userMessage]);

    const currentInput = input;
    const currentImage = selectedImage;
    setInput("");
    setSelectedImage(null);
    setIsLoading(true);

    try {
      // Logic for Variation A
      const fetchVariation = async (variationName: 'A' | 'B', history: Message[]) => {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            messages: [...history, userMessage], 
            skillId: id,
            variation: variationName, // API handles this for diversity
            image: currentImage ? { base64: currentImage.base64, mimeType: currentImage.mimeType } : undefined
          })
        });

        if (!response.ok) throw new Error("Lỗi kết nối máy chủ");

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let assistantMessage: Message = { id: uuidv4(), role: 'assistant', content: "", variation: variationName };
        
        if (variationName === 'A') setMessages(prev => [...prev, assistantMessage]);
        else setMessagesB(prev => [...prev, assistantMessage]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            assistantMessage.content += chunk;
            if (variationName === 'A') {
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { ...assistantMessage };
                return updated;
              });
            } else {
              setMessagesB(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { ...assistantMessage };
                return updated;
              });
            }
          }
        }
      };

      if (isCompareMode) {
        // Run both in parallel for comparison
        await Promise.all([
          fetchVariation('A', messages),
          fetchVariation('B', messagesB)
        ]);
      } else {
        await fetchVariation('A', messages);
      }

    } catch (error: any) {
      const errorMessage: Message = { id: uuidv4(), role: 'assistant', content: `⚠️ **Lỗi:** ${error.message}` };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = useCallback((text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const exportPDF = useCallback(() => {
    const aiMessages = messages.filter(m => m.role === 'assistant').map(m => m.content).join('\n\n---\n\n');
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>${skill?.name} - Export</title><style>body{font-family:sans-serif;padding:40px;line-height:1.6;}</style></head>
          <body><h1>${skill?.name}</h1>${aiMessages.replace(/\n/g, '<br>')}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }, [messages, skill]);

  const handlePostToFacebook = async (content: string, msgId: string) => {
    setIsPublishing(msgId);
    try {
      const response = await fetch('/api/facebook/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const data = await response.json();
      if (data.success) alert("🎉 Đã đăng bài thành công!");
      else alert(`❌ Lỗi: ${data.error}`);
    } catch (error: any) {
      alert(`❌ Lỗi kết nối: ${error.message}`);
    } finally {
      setIsPublishing(null);
    }
  };

  useEffect(() => {
    fetch(`/api/skills/${id}`)
      .then(res => res.json())
      .then(data => { setSkill(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (scrollRefB.current) scrollRefB.current.scrollTop = scrollRefB.current.scrollHeight;
  }, [messagesB]);

  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background relative overflow-hidden">
      
      {/* 2.2: Sidebar Quản lý cuộc hội thoại */}
      <div className={cn(
        "absolute inset-y-0 left-0 w-80 glass border-r z-50 transition-transform duration-300 transform",
        showSessions ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2">
              <History size={18} />
              Lịch sử chat
            </h3>
            <button onClick={() => setShowSessions(false)} className="p-2 hover:bg-white/5 rounded-lg">
              <X size={18} />
            </button>
          </div>
          
          <button 
            onClick={createNewSession}
            className="w-full flex items-center justify-center gap-2 p-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-2xl transition-all mb-4 font-bold text-sm"
          >
            <Plus size={18} />
            Cuộc hội thoại mới
          </button>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {sessions.map(s => (
              <div 
                key={s.id}
                onClick={() => { setSessionId(s.id); setShowSessions(false); }}
                className={cn(
                  "group p-4 rounded-2xl cursor-pointer transition-all border",
                  sessionId === s.id ? "bg-primary/20 border-primary/30" : "bg-white/5 border-transparent hover:bg-white/10"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {editingSessionId === s.id ? (
                      <input 
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={saveTitle}
                        onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
                        className="bg-background border border-primary/50 rounded px-1 w-full outline-none"
                        onClick={e => e.stopPropagation()}
                      />
                    ) : (
                      <p className="font-semibold text-sm truncate">{s.title}</p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(s.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => renameSession(s.id, e)} className="p-1 hover:text-primary"><Edit2 size={12} /></button>
                    <button onClick={(e) => deleteSession(s.id, e)} className="p-1 hover:text-red-400"><Trash2 size={12} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="p-4 flex justify-between items-center bg-background/50 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowSessions(true)} 
              className="px-3 py-2 hover:bg-primary/20 rounded-xl transition-colors text-primary bg-primary/10 flex items-center gap-2 border border-primary/20"
            >
              <History size={18} />
              <span className="text-xs font-bold">Lịch sử</span>
            </button>
            <button onClick={() => router.push('/')} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-lg font-bold truncate max-w-[200px] md:max-w-md">{skill?.name}</h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Chế độ thực thi</p>
            </div>
          </div>

          <div className="flex gap-2">
            {/* 2.5: Nút bật chế độ so sánh */}
            <button 
              onClick={() => setIsCompareMode(!isCompareMode)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border",
                isCompareMode ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "glass hover:bg-accent border-white/5"
              )}
            >
              <Columns size={14} />
              {isCompareMode ? "Đang so sánh" : "So sánh A/B"}
            </button>
            
            <button onClick={exportPDF} className="glass px-4 py-2 rounded-xl text-xs font-bold hover:bg-accent border-white/5 flex items-center gap-2">
              <Download size={14} />
              Xuất PDF
            </button>
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden relative">
          {/* Cột A (Luôn hiện) */}
          <div className={cn(
            "flex-1 flex flex-col transition-all duration-500",
            isCompareMode ? "border-r border-white/10" : ""
          )}>
            {isCompareMode && <div className="p-2 bg-indigo-600/20 text-center text-[10px] font-black uppercase tracking-tighter border-b border-indigo-500/20">Phương án A</div>}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <ChatMessageList messages={messages} onCopy={copyMessage} onShare={handlePostToFacebook} isPublishing={isPublishing} copiedId={copiedId} skill={skill} setInput={setInput} />
            </div>
          </div>

          {/* Cột B (Chỉ hiện khi so sánh) */}
          {isCompareMode && (
            <div className="flex-1 flex flex-col bg-white/[0.02] animate-in slide-in-from-right duration-500">
              <div className="p-2 bg-emerald-600/20 text-center text-[10px] font-black uppercase tracking-tighter border-b border-emerald-500/20 text-emerald-400">Phương án B (Khác biệt)</div>
              <div ref={scrollRefB} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <ChatMessageList messages={messagesB} onCopy={copyMessage} onShare={handlePostToFacebook} isPublishing={isPublishing} copiedId={copiedId} skill={skill} setInput={setInput} />
              </div>
            </div>
          )}

          {isLoading && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full flex items-center gap-3 border border-primary/50 animate-bounce">
              <Loader2 className="animate-spin text-primary" size={16} />
              <span className="text-xs font-bold">AI đang suy nghĩ...</span>
            </div>
          )}
        </main>

        <footer className="p-6 bg-background/80 backdrop-blur-xl border-t border-white/5">
          {selectedImage && (
            <div className="mb-4 flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/10 animate-in fade-in slide-in-from-bottom-4">
              <img src={selectedImage.preview} alt="Preview" className="w-16 h-16 rounded-xl object-cover ring-2 ring-primary/20" />
              <div className="flex-1">
                <p className="text-xs font-bold text-primary">Hình ảnh đã sẵn sàng</p>
                <p className="text-[10px] text-muted-foreground">AI sẽ phân tích hình ảnh này để tối ưu nội dung.</p>
              </div>
              <button onClick={() => setSelectedImage(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={18} /></button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-end gap-3">
            <div className="flex-1 relative">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "absolute left-4 bottom-3 p-2 rounded-xl transition-all",
                  selectedImage ? "bg-primary text-white" : "hover:bg-white/10 text-white/40"
                )}
              >
                <ImagePlus size={20} />
              </button>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder={isCompareMode ? "Nhập yêu cầu để so sánh 2 phương án..." : "Nhập yêu cầu của bạn..."}
                rows={1}
                className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 pl-14 pr-14 focus:border-primary/50 outline-none transition-all resize-none max-h-48 custom-scrollbar"
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-3 bottom-2.5 p-3 bg-primary text-primary-foreground rounded-2xl hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-primary/20"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
        </footer>
      </div>
    </div>
  );
}

// Sub-component for message list
function ChatMessageList({ messages, onCopy, onShare, isPublishing, copiedId, skill, setInput }: any) {
  if (messages.length === 0) return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary animate-pulse">
        <Sparkles size={32} />
      </div>
      <div className="max-w-xs">
        <h3 className="font-bold">Sẵn sàng thực thi</h3>
        <p className="text-xs text-muted-foreground mt-1">Sử dụng các gợi ý bên dưới hoặc nhập yêu cầu tự do.</p>
      </div>
      {skill?.suggestions && (
        <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
          {skill.suggestions.map((s: string, i: number) => (
            <button key={i} onClick={() => setInput(s)} className="p-3 text-left bg-white/5 border border-white/10 rounded-2xl text-xs hover:border-primary/50 hover:bg-primary/5 transition-all truncate">
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return messages.map((m: any) => (
    <div key={m.id} className={cn("flex gap-4 group", m.role === 'user' ? "flex-row-reverse" : "")}>
      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0", m.role === 'user' ? "bg-indigo-600" : "bg-primary")}>
        {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div className={cn(
        "relative p-4 rounded-3xl text-sm max-w-[90%]",
        m.role === 'user' ? "bg-indigo-600/20 rounded-tr-none" : "bg-white/5 rounded-tl-none border border-white/10"
      )}>
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
          {m.role === 'assistant' && (
            <button onClick={() => onShare(m.content, m.id)} disabled={isPublishing !== null} className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/20">
              {isPublishing === m.id ? <Loader2 size={10} className="animate-spin" /> : <Share2 size={10} />}
            </button>
          )}
          <button onClick={() => onCopy(m.content, m.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15">
            {copiedId === m.id ? <CheckCircle2 size={10} className="text-green-400" /> : <Copy size={10} />}
          </button>
        </div>
        {m.image && <img src={m.image} alt="Attached" className="max-w-[150px] rounded-xl mb-3" />}
        {m.role === 'assistant' ? <MarkdownRenderer content={m.content} /> : <div className="whitespace-pre-wrap">{m.content}</div>}
      </div>
    </div>
  ));
}
