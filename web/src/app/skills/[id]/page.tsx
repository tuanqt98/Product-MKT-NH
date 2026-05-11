"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Send, 
  ArrowLeft, 
  Bot, 
  User, 
  Loader2, 
  Copy, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SkillExecutionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [skill, setSkill] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage], skillId: id })
      });

      // Handle error responses (JSON with error message)
      if (!response.ok) {
        let errorMsg = "Lỗi kết nối máy chủ";
        let detailedError = "";
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
          detailedError = errorData.details || "";
        } catch {}
        const errorMessage = { 
          id: (Date.now() + 1).toString(), 
          role: 'assistant', 
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

      // If no content received, show warning
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

  useEffect(() => {
    fetch(`/api/skills/${id}`)
      .then(res => res.json())
      .then(data => {
        setSkill(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] space-y-6">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold">{skill?.name}</h2>
            <p className="text-sm text-muted-foreground">{skill?.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="glass px-4 py-2 rounded-xl text-xs font-bold hover:bg-accent transition-colors flex items-center gap-2">
            <Copy size={14} />
            Sao chép kết quả
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 glass rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col relative">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center text-primary animate-pulse">
                <Sparkles size={40} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Bắt đầu thực hiện Skill</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Hãy nhập yêu cầu cụ thể của bạn. Tôi sẽ kết hợp ngữ cảnh Nhật Hàn và kỹ năng "{skill?.name}" để tạo ra kết quả tốt nhất.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 w-full">
                <button 
                  onClick={() => setInput("Lập kế hoạch cho dịch vụ in ấn ngay")}
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs text-left"
                >
                  "Lập kế hoạch cho dịch vụ in ấn ngay"
                </button>
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div 
                key={m.id} 
                className={cn(
                  "flex gap-4 max-w-[85%]",
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
                  "p-5 rounded-[2rem] text-sm leading-relaxed",
                  m.role === 'user' ? "bg-indigo-600/20 rounded-tr-none" : "bg-white/5 rounded-tl-none border border-white/10"
                )}>
                  <div className="whitespace-pre-wrap">{m.content}</div>
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
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
            className="relative flex items-center"
          >
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập yêu cầu thực thi..."
              className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 pl-6 pr-16 focus:border-primary/50 outline-none transition-all"
            />
            <button 
              type="submit"
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
