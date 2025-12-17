import { pgTable, uuid, text, integer, boolean, timestamp, jsonb, index, serial, unique } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// ============================================
// 1. USERS TABLE
// ============================================
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    fullName: text('full_name'),
    passwordChanged: boolean('password_changed').default(false).notNull(),
    termsAccepted: boolean('terms_accepted').default(false),
    termsAcceptedAt: timestamp('terms_accepted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
}, (table) => ({
    emailIdx: index('idx_users_email').on(table.email),
}));

// ============================================
// 2. USER PROFILES TABLE
// ============================================
export const userProfiles = pgTable('user_profiles', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
    currentLevel: text('current_level').default('A1').notNull(),
    currentDay: integer('current_day').default(1).notNull(),
    listeningScore: integer('listening_score').default(0).notNull(),
    readingScore: integer('reading_score').default(0).notNull(),
    speakingScore: integer('speaking_score').default(0).notNull(),
    grammarScore: integer('grammar_score').default(0).notNull(),
    streakDays: integer('streak_days').default(0).notNull(),
    totalStudyMinutes: integer('total_study_minutes').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('idx_user_profiles_user_id').on(table.userId),
}));

// ============================================
// 3. LESSON PROGRESS TABLE
// ============================================
export const lessonProgress = pgTable('lesson_progress', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    dayNumber: integer('day_number').notNull(),
    lessonId: text('lesson_id').notNull(),
    completed: boolean('completed').default(false).notNull(),
    videoWatched: boolean('video_watched').default(false).notNull(),
    exercisesCompleted: boolean('exercises_completed').default(false).notNull(),
    score: integer('score').default(0).notNull(),
    timeSpentMinutes: integer('time_spent_minutes').default(0).notNull(),
    savedAnswers: jsonb('saved_answers'),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
    userDayIdx: index('idx_lesson_progress_user_day').on(table.userId, table.dayNumber),
    completedIdx: index('idx_lesson_progress_completed').on(table.userId, table.completed),
    userDayUnique: unique('lesson_progress_user_day_unique').on(table.userId, table.dayNumber),
}));

// ============================================
// 4. VOCABULARY PROGRESS TABLE
// ============================================
export const vocabularyProgress = pgTable('vocabulary_progress', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    word: text('word').notNull(),
    translation: text('translation').notNull(),
    level: text('level').notNull(),
    masteryLevel: integer('mastery_level').default(0).notNull(),
    nextReviewDate: timestamp('next_review_date', { withTimezone: true }).defaultNow().notNull(),
    reviewCount: integer('review_count').default(0).notNull(),
    correctCount: integer('correct_count').default(0).notNull(),
    lastReviewedAt: timestamp('last_reviewed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    nextReviewIdx: index('idx_vocabulary_next_review').on(table.userId, table.nextReviewDate),
    levelIdx: index('idx_vocabulary_level').on(table.userId, table.level),
}));

// ============================================
// 5. AI CONVERSATIONS TABLE (DISABLED - للاستخدام المستقبلي)
// ============================================
// export const aiConversations = pgTable('ai_conversations', {
//     id: uuid('id').primaryKey().defaultRandom(),
//     userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
//     scenario: text('scenario').notNull(),
//     message: text('message').notNull(),
//     role: text('role').notNull(),
//     corrections: jsonb('corrections').default(sql`'[]'::jsonb`).notNull(),
//     createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
// }, (table) => ({
//     userCreatedIdx: index('idx_ai_conversations_user').on(table.userId, table.createdAt),
//     scenarioIdx: index('idx_ai_conversations_scenario').on(table.userId, table.scenario),
// }));


// ============================================
// 6. DAILY TASKS TABLE
// ============================================
export const dailyTasks = pgTable('daily_tasks', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    dayNumber: integer('day_number').notNull(),
    taskType: text('task_type').notNull(),
    taskDescription: text('task_description').notNull(),
    completed: boolean('completed').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
}, (table) => ({
    userDayIdx: index('idx_daily_tasks_user_day').on(table.userId, table.dayNumber),
    completedIdx: index('idx_daily_tasks_completed').on(table.userId, table.completed),
}));

// ============================================
// 7. ACHIEVEMENTS TABLE
// ============================================
export const achievements = pgTable('achievements', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    achievementType: text('achievement_type').notNull(),
    achievementName: text('achievement_name').notNull(),
    description: text('description'),
    earnedAt: timestamp('earned_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    userEarnedIdx: index('idx_achievements_user').on(table.userId, table.earnedAt),
}));

// ============================================
// 8. LESSONS CONTENT TABLE
// ============================================
export const lessons = pgTable('lessons', {
    id: serial('id').primaryKey(),
    dayNumber: integer('day_number').notNull().unique(), // 1, 2, 3...
    level: text('level').notNull(), // A1, A2, etc.
    title: text('title').notNull(),
    description: text('description'),
    grammarTopic: text('grammar_topic'),
    documentContent: text('document_content'),
    readingText: text('reading_text'),
    videoUrl: text('video_url'),
    imageUrl: text('image_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
    levelIdx: index('idx_lessons_level').on(table.level),
    dayNumberIdx: index('idx_lessons_day_number').on(table.dayNumber),
}));

// ============================================
// 9. VOCABULARY CONTENT TABLE (10 words per day)
// ============================================
export const vocabulary = pgTable('vocabulary', {
    id: serial('id').primaryKey(),
    dayNumber: integer('day_number').notNull().unique(), // Direct link to day (1-30)

    // Word 1
    word: text('word').notNull(),
    translation: text('translation').notNull(),
    example: text('example'),

    // Word 2
    word1: text('word1'),
    translation1: text('translation1'),
    example1: text('example1'),

    // Word 3
    word2: text('word2'),
    translation2: text('translation2'),
    example2: text('example2'),

    // Word 4
    word3: text('word3'),
    translation3: text('translation3'),
    example3: text('example3'),

    // Word 5
    word4: text('word4'),
    translation4: text('translation4'),
    example4: text('example4'),

    // Word 6
    word5: text('word5'),
    translation5: text('translation5'),
    example5: text('example5'),

    // Word 7
    word6: text('word6'),
    translation6: text('translation6'),
    example6: text('example6'),

    // Word 8
    word7: text('word7'),
    translation7: text('translation7'),
    example7: text('example7'),

    // Word 9
    word8: text('word8'),
    translation8: text('translation8'),
    example8: text('example8'),

    // Word 10
    word9: text('word9'),
    translation9: text('translation9'),
    example9: text('example9'),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    dayNumberIdx: index('idx_vocabulary_day_number').on(table.dayNumber),
}));

// ============================================
// 10. EXERCISES CONTENT TABLE
// ============================================
export const exercises = pgTable('exercises', {
    id: serial('id').primaryKey(),
    lessonId: integer('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }).notNull(),
    type: text('type').notNull(), // multiple-choice, fill-blank, etc.
    question: text('question').notNull(),
    options: jsonb('options'), // Array of options for MCQ
    correctAnswer: text('correct_answer'),
    explanation: text('explanation'),
    difficulty: text('difficulty'), // easy, medium, hard
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    lessonIdIdx: index('idx_exercises_lesson_id').on(table.lessonId),
}));

