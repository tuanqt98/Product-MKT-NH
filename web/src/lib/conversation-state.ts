import fs from 'fs';
import path from 'path';

/**
 * Conversation State Manager
 * Quản lý trạng thái từng cuộc hội thoại: AI đang trả lời hay đã bàn giao cho người thật.
 * Lưu lịch sử tin nhắn và gợi ý AI cho chế độ Co-pilot.
 */

export interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  text: string;
  timestamp: string;
  source: 'customer' | 'ai' | 'admin'; // Ai gửi tin nhắn này
  aiSuggestion?: string; // Gợi ý AI (dùng cho chế độ Co-pilot)
  status: 'sent' | 'pending' | 'suggested'; // sent = đã gửi, pending = chờ, suggested = AI gợi ý chờ duyệt
}

export interface Conversation {
  id: string; // Facebook sender ID
  customerName: string;
  avatarUrl?: string;
  messages: Message[];
  status: 'ai_handling' | 'human_handling' | 'paused';
  pausedUntil?: string; // ISO date - AI tạm dừng đến khi nào
  lastMessageAt: string;
  unreadCount: number;
  createdAt: string;
}

export interface ConversationStore {
  conversations: Record<string, Conversation>;
  updatedAt: string;
}

const STORE_PATH = path.join(process.cwd(), 'data', 'conversations.json');

function ensureDataDir() {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readStore(): ConversationStore {
  try {
    ensureDataDir();
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('[ConversationState] Error reading store:', err);
  }
  return { conversations: {}, updatedAt: new Date().toISOString() };
}

function writeStore(store: ConversationStore) {
  ensureDataDir();
  store.updatedAt = new Date().toISOString();
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

/** Lấy hoặc tạo mới conversation */
export function getOrCreateConversation(senderId: string, senderName?: string): Conversation {
  const store = readStore();
  if (!store.conversations[senderId]) {
    store.conversations[senderId] = {
      id: senderId,
      customerName: senderName || `Khách #${senderId.slice(-4)}`,
      messages: [],
      status: 'ai_handling',
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
      createdAt: new Date().toISOString(),
    };
    writeStore(store);
  }
  return store.conversations[senderId];
}

/** Thêm tin nhắn vào conversation */
export function addMessage(senderId: string, message: Omit<Message, 'id' | 'timestamp'>): Message {
  const store = readStore();
  const conv = store.conversations[senderId];
  if (!conv) return null as any;

  const msg: Message = {
    ...message,
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
  };

  conv.messages.push(msg);
  conv.lastMessageAt = msg.timestamp;
  if (message.source === 'customer') {
    conv.unreadCount += 1;
  }
  writeStore(store);
  return msg;
}

/** Đánh dấu conversation đang được người thật xử lý (Handover) */
export function pauseAIForConversation(senderId: string, pauseMinutes: number) {
  const store = readStore();
  const conv = store.conversations[senderId];
  if (!conv) return;

  const pauseUntil = new Date(Date.now() + pauseMinutes * 60 * 1000);
  conv.status = 'human_handling';
  conv.pausedUntil = pauseUntil.toISOString();
  writeStore(store);
  console.log(`[Handover] AI paused for ${senderId} until ${pauseUntil.toLocaleString()}`);
}

/** Kích hoạt lại AI cho conversation */
export function resumeAIForConversation(senderId: string) {
  const store = readStore();
  const conv = store.conversations[senderId];
  if (!conv) return;

  conv.status = 'ai_handling';
  conv.pausedUntil = undefined;
  writeStore(store);
}

/** Kiểm tra AI có được phép trả lời conversation này không */
export function isAIAllowedForConversation(senderId: string): boolean {
  const store = readStore();
  const conv = store.conversations[senderId];
  if (!conv) return true; // Conversation mới → AI được phép

  if (conv.status === 'human_handling') {
    // Kiểm tra xem đã hết thời gian tạm dừng chưa
    if (conv.pausedUntil) {
      const pauseEnd = new Date(conv.pausedUntil);
      if (new Date() > pauseEnd) {
        // Hết thời gian → tự động bật lại AI
        resumeAIForConversation(senderId);
        return true;
      }
    }
    return false;
  }

  return conv.status === 'ai_handling';
}

/** Lấy tất cả conversations (cho Inbox UI) */
export function getAllConversations(): Conversation[] {
  const store = readStore();
  return Object.values(store.conversations).sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );
}

/** Lấy một conversation theo ID */
export function getConversation(senderId: string): Conversation | null {
  const store = readStore();
  return store.conversations[senderId] || null;
}

/** Đánh dấu đã đọc */
export function markAsRead(senderId: string) {
  const store = readStore();
  const conv = store.conversations[senderId];
  if (conv) {
    conv.unreadCount = 0;
    writeStore(store);
  }
}
