import fs from 'fs';
import path from 'path';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  variation?: 'A' | 'B';
}

export interface ChatSessionRecord {
  id: string;
  skillId: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  lastMessage?: string;
  messagesA: ChatMessage[];
  messagesB: ChatMessage[];
}

export interface CustomerRecord {
  id: string;
  name: string;
  channel: 'facebook' | 'zalo' | 'website' | 'manual';
  externalId?: string;
  phone?: string;
  email?: string;
  tags: string[];
  leadScore: number;
  status: 'new' | 'consulting' | 'quoted' | 'won' | 'lost';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationMessageRecord {
  id: string;
  senderId: string;
  senderName?: string;
  text: string;
  timestamp: string;
  source: 'customer' | 'ai' | 'admin';
  aiSuggestion?: string;
  status: 'sent' | 'pending' | 'suggested';
}

export interface ConversationRecord {
  id: string;
  customerId: string;
  customerName: string;
  customerPSID?: string;
  avatarUrl?: string;
  messages: ConversationMessageRecord[];
  status: 'ai_handling' | 'human_handling' | 'paused';
  pausedUntil?: string;
  lastMessageAt: string;
  unreadCount: number;
  summary?: string;
  tags: string[];
  leadScore: number;
  nextAction?: string;
  lastAnalyzedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedOutputRecord {
  id: string;
  title: string;
  skillId?: string;
  sessionId?: string;
  content: string;
  tags: string[];
  type: 'plan' | 'copy' | 'script' | 'report' | 'brief' | 'asset' | 'other';
  createdAt: string;
  updatedAt: string;
}

export interface ContentItemRecord {
  id: string;
  title: string;
  channel: 'facebook' | 'tiktok' | 'zalo' | 'linkedin' | 'website' | 'other';
  status: 'draft' | 'review' | 'approved' | 'scheduled' | 'published';
  scheduledAt?: string;
  content: string;
  sourceOutputId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyReportRecord {
  id: string;
  title: string;
  weekStart: string;
  weekEnd: string;
  summary: string;
  highlights: string[];
  risks: string[];
  actionPlan: string[];
  createdAt: string;
}

export interface IntegrationLogRecord {
  id: string;
  service: 'gemini' | 'facebook' | 'zalo' | 'system';
  level: 'info' | 'warning' | 'error';
  message: string;
  createdAt: string;
}

export interface AppDb {
  chatSessions: Record<string, ChatSessionRecord>;
  customers: Record<string, CustomerRecord>;
  conversations: Record<string, ConversationRecord>;
  savedOutputs: Record<string, SavedOutputRecord>;
  contentItems: Record<string, ContentItemRecord>;
  weeklyReports: Record<string, WeeklyReportRecord>;
  integrationLogs: IntegrationLogRecord[];
  updatedAt: string;
}

const LEGACY_DB_PATH = path.join(process.cwd(), 'data', 'app-db.json');
const DB_PATH = process.env.LOCAL_DB_PATH?.trim()
  ? path.resolve(process.env.LOCAL_DB_PATH.trim())
  : path.resolve(process.cwd(), '..', '.runtime', 'app-db.json');

const emptyDb = (): AppDb => ({
  chatSessions: {},
  customers: {},
  conversations: {},
  savedOutputs: {},
  contentItems: {},
  weeklyReports: {},
  integrationLogs: [],
  updatedAt: new Date().toISOString(),
});

let memoryDb: AppDb = emptyDb();

function ensureDataDir() {
  if (process.env.VERCEL) return;
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function readDb(): AppDb {
  if (process.env.VERCEL) return memoryDb;
  try {
    ensureDataDir();
    const sourcePath = fs.existsSync(DB_PATH)
      ? DB_PATH
      : fs.existsSync(LEGACY_DB_PATH)
        ? LEGACY_DB_PATH
        : null;
    if (!sourcePath) return memoryDb;
    const parsed = JSON.parse(fs.readFileSync(sourcePath, 'utf8')) as Partial<AppDb>;
    return {
      ...emptyDb(),
      ...parsed,
      chatSessions: parsed.chatSessions || {},
      customers: parsed.customers || {},
      conversations: parsed.conversations || {},
      savedOutputs: parsed.savedOutputs || {},
      contentItems: parsed.contentItems || {},
      weeklyReports: parsed.weeklyReports || {},
      integrationLogs: parsed.integrationLogs || [],
    };
  } catch (error) {
    console.error('[LocalDb] read failed:', error);
    return memoryDb;
  }
}

export function writeDb(db: AppDb) {
  db.updatedAt = new Date().toISOString();
  memoryDb = db;
  if (process.env.VERCEL) return;
  try {
    ensureDataDir();
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  } catch (error) {
    console.error('[LocalDb] write failed:', error);
  }
}

export function updateDb<T>(mutator: (db: AppDb) => T): T {
  const db = readDb();
  const result = mutator(db);
  writeDb(db);
  return result;
}

export function addIntegrationLog(log: Omit<IntegrationLogRecord, 'id' | 'createdAt'>) {
  return updateDb((db) => {
    const record: IntegrationLogRecord = {
      ...log,
      id: createId('log'),
      createdAt: new Date().toISOString(),
    };
    db.integrationLogs.unshift(record);
    db.integrationLogs = db.integrationLogs.slice(0, 200);
    return record;
  });
}
