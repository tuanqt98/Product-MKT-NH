"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Send, ArrowLeft, Bot, User, Loader2, Copy, CheckCircle2, Sparkles,
  Download, Trash2, History, X, ImagePlus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export default function SkillExecutionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [skill, setSkill] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ base64: string; mimeType: string; preview: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem(`nh-chat-${id}`);
      if (saved) {
        try { setMessages(JSON.parse(saved)); } catch {}
      }
    }
  }, [id]);

  // Save chat to localStorage whenever messages change
  useEffect(() => {
    if (id && messages.length > 0) {
      localStorage.setItem(`nh-chat-${id}`, JSON.stringify(messages));
    }
  }, [messages, id]);

  // Handle image selection
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

    const userMessage = { id: Date.now().toString(), role: 'user', content: input, image: selectedImage?.preview };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    const currentImage = selectedImage;
    setInput("");
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage], 
          skillId: id,
          image: currentImage ? { base64: currentImage.base64, mimeType: currentImage.mimeType } : undefined
        })
      });

      if (!response.ok) {
        let errorMsg = "Lỗi kết nối máy chủ";
        let detailedError = "";
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
          detailedError = errorData.details || "";
        } catch {}
        const errorMessage = { 
          id: (Date.now() + 1).toString(), role: 'assistant', 
          content: `⚠️ **Lỗi:** ${errorMsg}${detailedError ? `\n\n**Chi tiết kỹ thuật:**\n\`\`\`\n${detailedError}\n\`\`\`` : ""}` 
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: "" };
      setMessages(prev => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          assistantMessage.content += chunk;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { ...assistantMessage };
            return newMessages;
          });
        }
      }

      if (!assistantMessage.content.trim()) {
        assistantMessage.content = "⚠️ AI không trả về nội dung. Vui lòng thử lại sau 1 phút.";
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { ...assistantMessage };
          return newMessages;
        });
      }
    } catch (error: any) {
      const errorMessage = { id: (Date.now() + 2).toString(), role: 'assistant', content: `⚠️ **Lỗi kết nối:** ${error.message}` };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Copy single message
  const copyMessage = useCallback((text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  // Copy all AI responses
  const copyAllResults = useCallback(() => {
    const aiMessages = messages.filter(m => m.role === 'assistant').map(m => m.content).join('\n\n---\n\n');
    navigator.clipboard.writeText(aiMessages);
    setCopiedId('all');
    setTimeout(() => setCopiedId(null), 2000);
  }, [messages]);

  // Export as PDF (using print)
  const exportPDF = useCallback(() => {
    const aiMessages = messages.filter(m => m.role === 'assistant').map(m => m.content).join('\n\n---\n\n');
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${skill?.name || 'NH Marketing AI'} - Kết quả</title>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #1a1a2e; line-height: 1.8; }
            h1 { color: #0f3460; border-bottom: 3px solid #e94560; padding-bottom: 10px; }
            h2 { color: #16213e; margin-top: 24px; }
            h3 { color: #0f3460; }
            table { border-collapse: collapse; width: 100%; margin: 16px 0; }
            th, td { border: 1px solid #ddd; padding: 10px 14px; text-align: left; }
            th { background: #0f3460; color: white; }
            tr:nth-child(even) { background: #f8f9fa; }
            code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
            pre { background: #1a1a2e; color: #e0e0e0; padding: 16px; border-radius: 8px; overflow-x: auto; }
            pre code { background: none; color: inherit; }
            blockquote { border-left: 4px solid #e94560; margin: 16px 0; padding: 8px 16px; background: #fff5f5; }
            hr { border: none; border-top: 2px solid #eee; margin: 24px 0; }
            .header { display: flex; align-items: center; gap: 12px; margin-bottom: 30px; }
            .logo { width: 48px; height: 48px; background: #0f3460; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px; }
            .meta { color: #888; font-size: 12px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 12px; }
            ul, ol { padding-left: 20px; }
            li { margin-bottom: 4px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">NH</div>
            <div>
              <h1 style="margin:0; border:none; padding:0;">${skill?.name || 'NH Marketing AI'}</h1>
              <p style="margin:4px 0 0 0; color:#888;">Nhật Hàn - Giải Pháp Bao Bì & Nhãn Mác Chuyên Nghiệp</p>
            </div>
          </div>
          ${aiMessages.replace(/\n/g, '<br>')}
          <div class="meta">
            <p>📄 Được tạo bởi NH Marketing AI — ${new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
  }, [messages, skill]);

  // Clear chat history
  const clearHistory = useCallback(() => {
    setMessages([]);
    if (id) localStorage.removeItem(`nh-chat-${id}`);
  }, [id]);

  useEffect(() => {
    fetch(`/api/skills/${id}`)
      .then(res => res.json())
      .then(data => { setSkill(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] space-y-6">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold">{skill?.name}</h2>
            <p className="text-sm text-muted-foreground">{skill?.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {messages.length > 0 && (
            <>
              <button 
                onClick={clearHistory}
                className="glass px-3 py-2 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-colors flex items-center gap-1.5 text-red-400"
                title="Xóa lịch sử"
              >
                <Trash2 size={14} />
              </button>
              <button 
                onClick={exportPDF}
                className="glass px-4 py-2 rounded-xl text-xs font-bold hover:bg-accent transition-colors flex items-center gap-2"
              >
                <Download size={14} />
                Tải PDF
              </button>
            </>
          )}
          <button 
            onClick={copyAllResults}
            className="glass px-4 py-2 rounded-xl text-xs font-bold hover:bg-accent transition-colors flex items-center gap-2"
          >
            {copiedId === 'all' ? <CheckCircle2 size={14} className="text-green-400" /> : <Copy size={14} />}
            {copiedId === 'all' ? 'Đã sao chép!' : 'Sao chép kết quả'}
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 glass rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-lg mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center text-primary animate-pulse">
                <Sparkles size={40} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Bắt đầu thực hiện Skill</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Hãy nhập yêu cầu cụ thể của bạn. Tôi sẽ kết hợp ngữ cảnh Nhật Hàn và kỹ năng &quot;{skill?.name}&quot; để tạo ra kết quả tốt nhất.
                </p>
              </div>
              {skill?.suggestions && skill.suggestions.length > 0 && (
                <div className="w-full space-y-2">
                  <p className="text-[11px] text-white/30 uppercase tracking-wider font-semibold">💡 Gợi ý cho bạn</p>
                  <div className="grid grid-cols-1 gap-2 w-full">
                    {skill.suggestions.map((suggestion: string, idx: number) => (
                      <button 
                        key={idx}
                        onClick={() => setInput(suggestion)}
                        className="group px-4 py-3 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary/30 rounded-2xl text-xs text-left transition-all duration-200 flex items-start gap-3"
                      >
                        <span className="text-primary/60 group-hover:text-primary mt-0.5">→</span>
                        <span className="text-white/70 group-hover:text-white/90">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            messages.map((m) => (
              <div 
                key={m.id} 
                className={cn(
                  "flex gap-4 max-w-[85%] group",
                  m.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0",
                  m.role === 'user' ? "bg-indigo-600" : "bg-primary"
                )}>
                  {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={cn(
                  "relative p-5 rounded-[2rem] text-sm leading-relaxed",
                  m.role === 'user' ? "bg-indigo-600/20 rounded-tr-none" : "bg-white/5 rounded-tl-none border border-white/10"
                )}>
                  {/* Copy button per message */}
                  <button 
                    onClick={() => copyMessage(m.content, m.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/15 opacity-0 group-hover:opacity-100 transition-all"
                    title="Sao chép tin nhắn"
                  >
                    {copiedId === m.id ? <CheckCircle2 size={12} className="text-green-400" /> : <Copy size={12} className="text-white/40" />}
                  </button>
                  {/* Show attached image if any */}
                  {m.image && (
                    <img src={m.image} alt="Attached" className="max-w-[200px] rounded-xl mb-3 border border-white/10" />
                  )}
                  {/* Render Markdown for AI messages, plain text for user */}
                  {m.role === 'assistant' ? (
                    <MarkdownRenderer content={m.content} />
                  ) : (
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Loader2 className="animate-spin" size={20} />
              </div>
              <div className="bg-white/5 border border-white/10 h-20 w-64 rounded-[2rem] rounded-tl-none" />
            </div>
          )}
        </div>

        <div className="p-6 bg-background/50 border-t border-white/5">
          {/* Image Preview */}
          {selectedImage && (
            <div className="mb-3 flex items-center gap-3 bg-white/5 rounded-2xl p-3 border border-white/10">
              <img src={selectedImage.preview} alt="Preview" className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="text-xs text-white/60">Hình ảnh đã chọn</p>
                <p className="text-[10px] text-white/40">AI sẽ phân tích hình ảnh này khi bạn gửi tin nhắn</p>
              </div>
              <button onClick={() => setSelectedImage(null)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <X size={16} className="text-white/40" />
              </button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="relative flex items-center">
            {/* Hidden file input */}
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleImageSelect}
              className="hidden"
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-3 p-2 hover:bg-white/10 rounded-xl transition-colors z-10"
              title="Đính kèm hình ảnh"
            >
              <ImagePlus size={18} className={selectedImage ? "text-primary" : "text-white/40"} />
            </button>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={selectedImage ? "Mô tả yêu cầu cho hình ảnh này..." : "Nhập yêu cầu thực thi..."}
              className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-16 focus:border-primary/50 outline-none transition-all"
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-3 bg-primary text-primary-foreground rounded-2xl hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send size={20} />
            </button>
          </form>
          <p className="text-[10px] text-center text-muted-foreground mt-4">
            AI có thể nhầm lẫn. Hãy luôn kiểm tra lại kết quả trước khi triển khai thực tế.
          </p>
        </div>
      </div>
    </div>
  );
}
