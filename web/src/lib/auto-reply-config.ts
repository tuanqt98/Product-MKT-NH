import fs from 'fs';
import path from 'path';

/**
 * Auto-Reply Configuration Manager
 * Lưu trữ cấu hình AI Auto-Reply vào file JSON trên server.
 * Trong production nên dùng database, nhưng JSON file phù hợp cho MVP.
 */

export interface AutoReplyConfig {
  enabled: boolean;
  mode: 'full' | 'suggestion'; // full = AI tự gửi, suggestion = AI gợi ý chờ duyệt
  pauseDurationMinutes: number; // Thời gian tạm dừng khi có người thật trả lời
  activeHours: {
    enabled: boolean;
    startHour: number; // 0-23
    endHour: number;   // 0-23
  };
  greeting: string; // Tin nhắn chào mừng tùy chỉnh
  updatedAt: string;
}

const CONFIG_PATH = path.join(process.cwd(), 'data', 'auto-reply-config.json');

const DEFAULT_CONFIG: AutoReplyConfig = {
  enabled: false,
  mode: 'suggestion',
  pauseDurationMinutes: 30,
  activeHours: {
    enabled: false,
    startHour: 22,
    endHour: 7,
  },
  greeting: 'Xin chào! Cảm ơn bạn đã liên hệ Nhật Hàn. Mình có thể giúp gì cho bạn ạ? 😊',
  updatedAt: new Date().toISOString(),
};

function ensureDataDir() {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getConfig(): AutoReplyConfig {
  // Ưu tiên đọc từ Biến môi trường (cho Vercel Production)
  const envEnabled = process.env.AUTO_REPLY_ENABLED === 'true';
  const envMode = process.env.AUTO_REPLY_MODE as 'full' | 'suggestion';

  try {
    ensureDataDir();
    let fileConfig = {};
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
      fileConfig = JSON.parse(raw);
    }
    
    return { 
      ...DEFAULT_CONFIG, 
      ...fileConfig,
      // Overwrite bằng env nếu có
      enabled: process.env.AUTO_REPLY_ENABLED ? envEnabled : (fileConfig as any).enabled ?? DEFAULT_CONFIG.enabled,
      mode: envMode || (fileConfig as any).mode || DEFAULT_CONFIG.mode
    };
  } catch (err) {
    console.error('[AutoReplyConfig] Error reading config:', err);
  }
  return { ...DEFAULT_CONFIG, enabled: envEnabled || DEFAULT_CONFIG.enabled };
}

export function saveConfig(config: Partial<AutoReplyConfig>): AutoReplyConfig {
  ensureDataDir();
  const current = getConfig();
  const updated: AutoReplyConfig = {
    ...current,
    ...config,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2), 'utf8');
  return updated;
}

/**
 * Kiểm tra xem AI có được phép trả lời ở thời điểm hiện tại không
 * Dựa trên cấu hình khung giờ hoạt động
 */
export function isWithinActiveHours(config: AutoReplyConfig): boolean {
  if (!config.activeHours.enabled) return true; // Không giới hạn giờ → luôn active

  const now = new Date();
  const currentHour = now.getHours(); // Giờ Việt Nam (server timezone)
  const { startHour, endHour } = config.activeHours;

  // Ví dụ: startHour=22, endHour=7 → AI hoạt động từ 22h đêm đến 7h sáng
  if (startHour <= endHour) {
    return currentHour >= startHour && currentHour < endHour;
  } else {
    // Trường hợp qua nửa đêm
    return currentHour >= startHour || currentHour < endHour;
  }
}
