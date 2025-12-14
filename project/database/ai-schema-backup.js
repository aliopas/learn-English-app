// ============================================
// AI CONVERSATIONS TABLE SCHEMA (BACKUP)
// ============================================
// هذا الملف يحتوي على schema جدول AI للاستخدام المستقبلي
// لتفعيله: انسخ المحتوى إلى database/schema.js

import { pgTable, uuid, text, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const aiConversations = pgTable('ai_conversations', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    scenario: text('scenario').notNull(),
    message: text('message').notNull(),
    role: text('role').notNull(),
    corrections: jsonb('corrections').default(sql`'[]'::jsonb`).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    userCreatedIdx: index('idx_ai_conversations_user').on(table.userId, table.createdAt),
    scenarioIdx: index('idx_ai_conversations_scenario').on(table.userId, table.scenario),
}));

// ============================================
// كيفية التفعيل:
// ============================================
// 1. افتح database/schema.js
// 2. احذف التعليقات من جدول aiConversations
// 3. شغل: npm run db:generate
// 4. شغل: npm run db:push
// 5. افتح src/pages/AITutor.jsx
// 6. غير FEATURE_DISABLED = false
// ============================================
