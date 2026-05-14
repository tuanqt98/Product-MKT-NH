"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Send, ArrowLeft, Bot, User, Loader2, Copy, CheckCircle2, Sparkles,
  Download, Trash2, History, X, ImagePlus, Share2, Columns, 
  Edit2, Settings2, Zap, Plus
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
  
  const [sessionId, setSessionId] = useState<string>("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [showSessions, setShowSessions] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isCompareMode, setIsCompareMode] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesB, setMessagesB] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ base64: string; mimeType: string; preview: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollRefB = useRef<HTMLDivElement>(null);

  // Khởi tạo sessions
  useEffect(() => {
    if (id) {
      const savedSessions = localStorage.getItem(`nh-sessions-${id}`);
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions);
        setSessions(parsed);
        if (parsed.length > 0) setSessionId(parsed[0].id);
        else createNewSession();
      } else {
        createNewSession();
      }
    }
  }, [id]);

  // Nhận diện xu hướng từ Radar
  useEffect(() => {
    const pendingTrend = localStorage.getItem('pending_trend');
    if (pendingTrend && id === '04-script-video') {
      const trendData = JSON.parse(pendingTrend);
      const welcomeMsg: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: `👋 **Chào Sếp! Tôi đã sẵn sàng lên kịch bản cho xu hướng: ${trendData.title}**\n\nTôi thấy xu hướng này đang rất "hot" vì: *${trendData.whyHot}*.\n\nSếp muốn tôi viết kịch bản Video theo hướng nào cho Nhật Hàn ạ?\n1. **Review sản phẩm** thực tế\n2. **Kể chuyện (Storytelling)** về quá trình in ấn\n3. **Hài hước/Bắt trend** TikTok\n\nSếp cứ ra lệnh, tôi triển ngay!`
      };
      setMessages([welcomeMsg]);
      localStorage.removeItem('pending_trend');
    }
  }, [id]);

  // Load tin nhắn
  useEffect(() => {
    if (id && sessionId) {
      const savedA = localStorage.getItem(`nh-chat-${id}-${sessionId}-A`);
      const savedB = localStorage.getItem(`nh-chat-${id}-${sessionId}-B`);
      if (savedA && messages.length === 0) setMessages(JSON.parse(savedA));
      if (savedB && messagesB.length === 0) setMessagesB(JSON.parse(savedB));
    }
  }, [id, sessionId]);

  // Lưu tin nhắn
  useEffect(() => {
    if (id && sessionId && (messages.length > 0 || messagesB.length > 0)) {
      localStorage.setItem(`nh-chat-${id}-${sessionId}-A`, JSON.stringify(messages));
      localStorage.setItem(`nh-chat-${id}-${sessionId}-B`, JSON.stringify(messagesB));
      
      const lastMsg = messages[messages.length - 1]?.content || "";
      if (lastMsg && !lastMsg.includes('Chào Sếp!')) {
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
    const newSession = { id: newId, title: `Hội thoại mới ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, createdAt: Date.now() };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    setSessionId(newId);
    setMessages([]);
    setMessagesB([]);
    localStorage.setItem(`nh-sessions-${id}`, JSON.stringify(updated));
    setShowSessions(false);
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
      const fetchVariation = async (variationName: 'A' | 'B', history: Message[]) => {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [...history, userMessage], skillId: id, variation: variationName, image: currentImage ? { base64: currentImage.base64, mimeType: currentImage.mimeType } : undefined })
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
            assistantMessage.content += decoder.decode(value, { stream: true });
            if (variationName === 'A') setMessages(prev => { const updated = [...prev]; updated[updated.length - 1] = { ...assistantMessage }; return updated; });
            else setMessagesB(prev => { const updated = [...prev]; updated[updated.length - 1] = { ...assistantMessage }; return updated; });
          }
        }
      };
      if (isCompareMode) await Promise.all([fetchVariation('A', messages), fetchVariation('B', messagesB)]);
      else await fetchVariation('A', messages);
    } catch (error: any) {
      setMessages(prev => [...prev, { id: uuidv4(), role: 'assistant', content: `⚠️ **Lỗi:** ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const exportPDF = useCallback(() => {
    const chatContent = messages.filter(m => m.role === 'assistant')
      .map(m => `
        <div class="message-container">
          <div class="content">${m.content}</div>
        </div>
      `).join('<hr>');

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${skill?.name || 'Marketing Report'}</title>
            <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
            <style>
              body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
              h1 { color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
              .message-container { margin-bottom: 30px; }
              table { border-collapse: collapse; width: 100%; margin: 20px 0; border: 1px solid #e2e8f0; }
              th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
              th { bg-color: #f8fafc; font-weight: bold; color: #4f46e5; }
              tr:nth-child(even) { background-color: #f1f5f9; }
              blockquote { border-left: 4px solid #4f46e5; padding-left: 20px; color: #64748b; font-style: italic; }
              code { background: #f1f5f9; padding: 2px 4px; rounded: 4px; font-size: 0.9em; }
              hr { border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0; }
            </style>
          </head>
          <body>
            <h1>${skill?.name || 'Nhật Hàn AI - Marketing Report'}</h1>
            <div id="content"></div>
            <script>
              document.getElementById('content').innerHTML = marked.parse(\`${messages.filter(m => m.role === 'assistant').map(m => m.content).join('\n\n---\n\n').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
              setTimeout(() => { window.print(); }, 500);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }, [messages, skill]);

  useEffect(() => {
    fetch(`/api/skills/${id}`).then(res => res.json()).then(data => { setSkill(data); setLoading(false); });
  }, [id]);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background relative overflow-hidden">
      {/* Session Sidebar */}
      <div className={cn("absolute inset-y-0 left-0 w-80 glass border-r z-50 transition-transform duration-300 transform", showSessions ? "translate-x-0" : "-translate-x-full")}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2"><History size={18} /> Lịch sử chat</h3>
            <button onClick={() => setShowSessions(false)} className="p-2 hover:bg-white/5 rounded-lg"><X size={18} /></button>
          </div>
          <button onClick={createNewSession} className="w-full flex items-center justify-center gap-2 p-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-2xl mb-4 font-bold text-sm"><Plus size={18} /> Cuộc hội thoại mới</button>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {sessions.map(s => (
              <div key={s.id} onClick={() => { setSessionId(s.id); setShowSessions(false); }} className={cn("group p-4 rounded-2xl cursor-pointer transition-all border", sessionId === s.id ? "bg-primary/20 border-primary/30" : "bg-white/5 border-transparent hover:bg-white/10")}>
                <p className="font-semibold text-sm truncate">{s.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="p-4 flex justify-between items-center bg-background/50 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowSessions(true)} className="px-3 py-2 hover:bg-primary/20 rounded-xl transition-colors text-primary bg-primary/10 flex items-center gap-2 border border-primary/20"><History size={18} /><span className="text-xs font-bold">Lịch sử</span></button>
            <button onClick={() => router.push('/')} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ArrowLeft size={20} /></button>
            <div><h2 className="text-lg font-bold">{skill?.name}</h2><p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Chế độ thực thi</p></div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={exportPDF} 
              className="glass px-4 py-2 rounded-xl text-xs font-bold hover:bg-accent border-white/5 flex items-center gap-2"
            >
              <Download size={14} />
              Xuất PDF
            </button>
            
            <button onClick={() => setIsCompareMode(!isCompareMode)} className={cn("px-4 py-2 rounded-xl text-xs font-bold border transition-all", isCompareMode ? "bg-primary text-white" : "glass")}>
              <Columns size={14} className="inline mr-2" /> {isCompareMode ? "Đang so sánh" : "So sánh A/B"}
            </button>
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden relative">
          <div className={cn("flex-1 flex flex-col overflow-y-auto p-6 space-y-6 custom-scrollbar", isCompareMode ? "border-r border-white/10" : "")} ref={scrollRef}>
            <ChatMessageList messages={messages} skill={skill} setInput={setInput} isLoading={isLoading} />
          </div>
          {isCompareMode && (
            <div className="flex-1 flex flex-col bg-white/[0.02] overflow-y-auto p-6 space-y-6 custom-scrollbar" ref={scrollRefB}>
              <ChatMessageList messages={messagesB} skill={skill} setInput={setInput} isLoading={isLoading} />
            </div>
          )}
        </main>

        <footer className="p-6 bg-background/80 backdrop-blur-xl border-t border-white/5">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-end gap-3">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Nhập yêu cầu của bạn..." rows={1} className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 px-6 focus:border-primary/50 outline-none transition-all resize-none" />
            <button type="submit" disabled={isLoading || !input.trim()} className="p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20"><Send size={20} /></button>
          </form>
        </footer>
      </div>
    </div>
  );
}

function ChatMessageList({ messages, skill, setInput, isLoading }: any) {
  if (messages.length === 0 && !isLoading) return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary animate-pulse"><Sparkles size={32} /></div>
      <div className="max-w-xs"><h3 className="font-bold">Sẵn sàng thực thi</h3><p className="text-xs text-muted-foreground">Sử dụng các gợi ý bên dưới hoặc nhập yêu cầu tự do.</p></div>
      {skill?.suggestions && (
        <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
          {skill.suggestions.map((s: string, i: number) => (
            <button key={i} onClick={() => setInput(s)} className="p-3 text-left bg-white/5 border border-white/10 rounded-2xl text-xs hover:border-primary/50 transition-all">{s}</button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {messages.map((m: any) => (
        <div key={m.id} className={cn("flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300", m.role === 'user' ? "flex-row-reverse" : "")}>
          <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0", m.role === 'user' ? "bg-indigo-600" : "bg-primary shadow-lg shadow-primary/20")}>
            {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
          </div>
          <div className={cn("p-4 rounded-3xl text-sm max-w-[85%] shadow-sm", m.role === 'user' ? "bg-indigo-600 text-white" : "bg-white/5 border border-white/10")}>
            {m.role === 'assistant' ? <MarkdownRenderer content={m.content} /> : <div className="whitespace-pre-wrap">{m.content}</div>}
          </div>
        </div>
      ))}
      
      {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
        <AIThinkingIndicator />
      )}
    </>
  );
}

function AIThinkingIndicator() {
  const [dots, setDots] = useState("");
  const [status, setStatus] = useState("Đang khởi tạo AI...");

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 400);

    const statuses = [
      "Đang phân tích SKILL.md...",
      "Đang đọc dữ liệu In Nhật Hàn...",
      "Đang lên kịch bản tối ưu...",
      "Đang chuẩn bị nội dung...",
      "AI đang suy nghĩ..."
    ];
    let i = 0;
    const statusInterval = setInterval(() => {
      i = (i + 1) % statuses.length;
      setStatus(statuses[i]);
    }, 1500);

    return () => {
      clearInterval(dotInterval);
      clearInterval(statusInterval);
    };
  }, []);

  return (
    <div className="flex gap-4 animate-in fade-in duration-500">
      <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 animate-pulse shadow-lg shadow-primary/30">
        <Bot size={16} />
      </div>
      <div className="p-5 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-3 min-w-[200px]">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
        </div>
        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] animate-pulse">
          {status}
        </p>
      </div>
    </div>
  );
}
