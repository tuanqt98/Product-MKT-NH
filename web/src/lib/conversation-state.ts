import {
  ConversationMessageRecord,
  ConversationRecord,
  createId,
  updateDb,
  readDb,
} from '@/lib/local-db';

export type Message = ConversationMessageRecord;
export type Conversation = ConversationRecord;

function customerIdForConversation(conversationId: string) {
  return `cust_${conversationId.replace(/[^a-zA-Z0-9]/g, '_')}`;
}

function inferTagsAndScore(messages: ConversationMessageRecord[]) {
  const text = messages.map((message) => message.text).join(' ').toLowerCase();
  const tags = new Set<string>();
  let score = 20;

  if (/(giá|bao nhiêu|báo giá|quote|price)/i.test(text)) {
    tags.add('hỏi giá');
    score += 25;
  }
  if (/(in|bao bì|tem|nhãn|hộp|túi|catalog|card)/i.test(text)) {
    tags.add('nhu cầu in ấn');
    score += 15;
  }
  if (/(gấp|hôm nay|ngày mai|tuần này|urgent)/i.test(text)) {
    tags.add('cần gấp');
    score += 20;
  }
  if (/(số lượng|sl|\d+ cái|\d+ hộp|\d+ tem)/i.test(text)) {
    tags.add('có số lượng');
    score += 15;
  }
  if (/(khiếu nại|lỗi|trễ|không hài lòng)/i.test(text)) {
    tags.add('cần xử lý');
    score = Math.max(score, 60);
  }

  return {
    tags: Array.from(tags),
    leadScore: Math.min(score, 100),
  };
}

/** Lấy hoặc tạo mới conversation */
export function getOrCreateConversation(conversationId: string, customerName?: string): Conversation {
  return updateDb((db) => {
    if (!db.conversations[conversationId]) {
      const now = new Date().toISOString();
      const customerId = customerIdForConversation(conversationId);
      db.customers[customerId] = db.customers[customerId] || {
        id: customerId,
        name: customerName || `Khách #${conversationId.slice(-4)}`,
        channel: 'facebook',
        externalId: conversationId,
        tags: [],
        leadScore: 20,
        status: 'new',
        createdAt: now,
        updatedAt: now,
      };
      db.conversations[conversationId] = {
        id: conversationId,
        customerId,
        customerName: customerName || db.customers[customerId].name,
        messages: [],
        status: 'ai_handling',
        lastMessageAt: now,
        unreadCount: 0,
        tags: [],
        leadScore: 20,
        createdAt: now,
        updatedAt: now,
      };
    }
    return db.conversations[conversationId];
  });
}

export function upsertConversationPatch(conversationId: string, patch: Partial<Conversation>) {
  return updateDb((db) => {
    const current = db.conversations[conversationId];
    if (!current) return null;
    const updated = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    db.conversations[conversationId] = updated;
    const customer = db.customers[updated.customerId];
    if (customer) {
      customer.name = updated.customerName || customer.name;
      customer.tags = Array.from(new Set([...(customer.tags || []), ...(updated.tags || [])]));
      customer.leadScore = Math.max(customer.leadScore || 0, updated.leadScore || 0);
      customer.updatedAt = new Date().toISOString();
    }
    return updated;
  });
}

export function replaceConversationMessages(conversationId: string, messages: ConversationMessageRecord[]) {
  return updateDb((db) => {
    const conv = db.conversations[conversationId];
    if (!conv) return null;
    const intelligence = inferTagsAndScore(messages);
    conv.messages = messages;
    conv.lastMessageAt = messages[messages.length - 1]?.timestamp || conv.lastMessageAt;
    conv.tags = Array.from(new Set([...(conv.tags || []), ...intelligence.tags]));
    conv.leadScore = Math.max(conv.leadScore || 0, intelligence.leadScore);
    conv.updatedAt = new Date().toISOString();

    const customer = db.customers[conv.customerId];
    if (customer) {
      customer.tags = Array.from(new Set([...(customer.tags || []), ...conv.tags]));
      customer.leadScore = Math.max(customer.leadScore || 0, conv.leadScore || 0);
      customer.updatedAt = new Date().toISOString();
    }
    return conv;
  });
}

/** Thêm tin nhắn vào conversation */
export function addMessage(conversationId: string, message: Omit<Message, 'id' | 'timestamp'>): Message {
  return updateDb((db) => {
    const conv = db.conversations[conversationId];
    if (!conv) throw new Error('Conversation not found');

    const msg: Message = {
      ...message,
      id: createId('msg'),
      timestamp: new Date().toISOString(),
    };

    conv.messages.push(msg);
    conv.lastMessageAt = msg.timestamp;
    conv.updatedAt = msg.timestamp;
    if (message.source === 'customer') conv.unreadCount += 1;

    const intelligence = inferTagsAndScore(conv.messages);
    conv.tags = Array.from(new Set([...(conv.tags || []), ...intelligence.tags]));
    conv.leadScore = Math.max(conv.leadScore || 0, intelligence.leadScore);
    return msg;
  });
}

/** Đánh dấu conversation đang được người thật xử lý (Handover) */
export function pauseAIForConversation(conversationId: string, pauseMinutes: number) {
  updateDb((db) => {
    const conv = db.conversations[conversationId];
    if (!conv) return;
    const pauseUntil = new Date(Date.now() + pauseMinutes * 60 * 1000);
    conv.status = 'human_handling';
    conv.pausedUntil = pauseUntil.toISOString();
    conv.updatedAt = new Date().toISOString();
  });
}

/** Kích hoạt lại AI cho conversation */
export function resumeAIForConversation(conversationId: string) {
  updateDb((db) => {
    const conv = db.conversations[conversationId];
    if (!conv) return;
    conv.status = 'ai_handling';
    conv.pausedUntil = undefined;
    conv.updatedAt = new Date().toISOString();
  });
}

/** Kiểm tra AI có được phép trả lời conversation này không */
export function isAIAllowedForConversation(conversationId: string): boolean {
  const db = readDb();
  const conv = db.conversations[conversationId];
  if (!conv) return true;

  if (conv.status === 'human_handling') {
    if (conv.pausedUntil && new Date() > new Date(conv.pausedUntil)) {
      resumeAIForConversation(conversationId);
      return true;
    }
    return false;
  }

  return conv.status === 'ai_handling';
}

/** Lấy tất cả conversations (cho Inbox UI) */
export function getAllConversations(): Conversation[] {
  const db = readDb();
  return Object.values(db.conversations).sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );
}

/** Lấy một conversation theo ID */
export function getConversation(conversationId: string): Conversation | null {
  const db = readDb();
  return db.conversations[conversationId] || null;
}

/** Đánh dấu đã đọc */
export function markAsRead(conversationId: string) {
  updateDb((db) => {
    const conv = db.conversations[conversationId];
    if (conv) {
      conv.unreadCount = 0;
      conv.updatedAt = new Date().toISOString();
    }
  });
}
