# 🚀 دليل إعداد قاعدة البيانات - JavaScript

## 📋 الملفات المطلوبة:

### ✅ تم إنشاؤها:
1. **`database/schema.sql`** - ملف SQL الكامل لإنشاء جميع الجداول
2. **`database/migrate.js`** - سكريبت JavaScript لتنفيذ الـ migration
3. **`test-db.js`** - سكريبت لاختبار الاتصال بقاعدة البيانات
4. **`.env`** - ملف إعدادات قاعدة البيانات

---

## 🔧 الخطوات المطلوبة:

### 1️⃣ تثبيت المكتبات المطلوبة

```bash
cd project
npm install pg dotenv
```

**المكتبات:**
- `pg` - مكتبة PostgreSQL للاتصال بقاعدة البيانات
- `dotenv` - لقراءة متغيرات البيئة من ملف `.env`

---

### 2️⃣ إضافة كلمة المرور في `.env`

افتح ملف `project/.env` وغير السطر ده:

```env
VITE_DB_PASSWORD=YOUR_PASSWORD_HERE
```

بكلمة المرور الحقيقية من لوحة التحكم Aiven.

**الإعدادات الحالية:**
```env
VITE_DB_HOST=pg-37a55ba5-ali-6c4e.j.aivencloud.com
VITE_DB_PORT=15041
VITE_DB_NAME=defaultdb
VITE_DB_USER=avnadmin
VITE_DB_PASSWORD=كلمة_المرور_هنا
VITE_DB_SSL=true
```

---

### 3️⃣ اختبار الاتصال بقاعدة البيانات

قبل ما تعمل migration، جرب الاتصال الأول:

```bash
npm run db:test
```

**النتيجة المتوقعة:**
```
✅ Database connection successful!
Current time from database: 2024-12-09 16:20:00
PostgreSQL version: PostgreSQL 15.x
```

لو ظهر خطأ، تأكد من:
- كلمة المرور صحيحة
- الاتصال بالإنترنت شغال
- معلومات الاتصال صحيحة

---

### 4️⃣ تنفيذ الـ Migration (إنشاء الجداول)

بعد ما الاتصال ينجح، نفذ الأمر ده لإنشاء جميع الجداول:

```bash
npm run db:migrate
```

**هيعمل إيه:**
1. يتصل بقاعدة البيانات
2. يقرأ ملف `database/schema.sql`
3. ينفذ جميع الأوامر SQL
4. يعرض قائمة بالجداول اللي اتعملت

**الجداول اللي هتتعمل:**
- ✅ `users` - جدول المستخدمين
- ✅ `user_profiles` - ملفات المستخدمين التعليمية
- ✅ `lesson_progress` - تقدم الدروس
- ✅ `vocabulary_progress` - تقدم المفردات
- ✅ `ai_conversations` - محادثات الذكاء الاصطناعي
- ✅ `daily_tasks` - المهام اليومية
- ✅ `achievements` - الإنجازات

---

## 📊 الجداول بالتفصيل:

### 1. جدول `users`
```sql
- id (uuid)
- email (text, unique)
- password_hash (text)
- full_name (text)
- created_at (timestamp)
- updated_at (timestamp)
- last_login_at (timestamp)
```

### 2. جدول `user_profiles`
```sql
- id (uuid)
- user_id (uuid) → references users
- current_level (A1, A2, B1, B2, C1, C2)
- current_day (1-30)
- listening_score (0-100)
- reading_score (0-100)
- speaking_score (0-100)
- grammar_score (0-100)
- streak_days (عدد أيام التتابع)
- total_study_minutes (إجمالي وقت الدراسة)
```

### 3. جدول `lesson_progress`
```sql
- id (uuid)
- user_id (uuid)
- day_number (1-30)
- lesson_id (text)
- completed (boolean)
- video_watched (boolean)
- exercises_completed (boolean)
- score (0-100)
- time_spent_minutes
- completed_at (timestamp)
```

### 4. جدول `vocabulary_progress`
```sql
- id (uuid)
- user_id (uuid)
- word (text)
- translation (text)
- level (A1-C2)
- mastery_level (0-5) - نظام التكرار المتباعد
- next_review_date (timestamp)
- review_count (عدد المراجعات)
- correct_count (عدد الإجابات الصحيحة)
```

### 5. جدول `ai_conversations`
```sql
- id (uuid)
- user_id (uuid)
- scenario (text)
- message (text)
- role (user/assistant)
- corrections (jsonb) - تصحيحات القواعد
- created_at (timestamp)
```

### 6. جدول `daily_tasks`
```sql
- id (uuid)
- user_id (uuid)
- day_number (1-30)
- task_type (lesson/vocabulary/speaking/exercise)
- task_description (text)
- completed (boolean)
- completed_at (timestamp)
```

### 7. جدول `achievements`
```sql
- id (uuid)
- user_id (uuid)
- achievement_type (text)
- achievement_name (text)
- description (text)
- earned_at (timestamp)
```

---

## 💻 استخدام قاعدة البيانات في الكود:

### مثال 1: إنشاء مستخدم جديد
```javascript
import { query } from './src/lib/db.js';

async function createUser(email, passwordHash, fullName) {
  const result = await query(
    `INSERT INTO users (email, password_hash, full_name) 
     VALUES ($1, $2, $3) 
     RETURNING *`,
    [email, passwordHash, fullName]
  );
  
  return result.rows[0];
}
```

### مثال 2: جلب تقدم المستخدم
```javascript
async function getUserProgress(userId) {
  const result = await query(
    `SELECT * FROM user_profiles WHERE user_id = $1`,
    [userId]
  );
  
  return result.rows[0];
}
```

### مثال 3: تحديث نقاط المستخدم
```javascript
async function updateUserScore(userId, scoreType, newScore) {
  await query(
    `UPDATE user_profiles 
     SET ${scoreType}_score = $1, updated_at = NOW() 
     WHERE user_id = $2`,
    [newScore, userId]
  );
}
```

### مثال 4: حفظ محادثة AI
```javascript
async function saveAIMessage(userId, scenario, message, role, corrections = []) {
  await query(
    `INSERT INTO ai_conversations 
     (user_id, scenario, message, role, corrections) 
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, scenario, message, role, JSON.stringify(corrections)]
  );
}
```

---

## 🔍 استعلامات مفيدة:

### عرض جميع الجداول:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### عرض عدد السجلات في كل جدول:
```sql
SELECT 
  'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'user_profiles', COUNT(*) FROM user_profiles
UNION ALL
SELECT 'lesson_progress', COUNT(*) FROM lesson_progress;
```

### حذف جميع البيانات (للتجربة فقط):
```sql
TRUNCATE users CASCADE;
```

---

## ⚠️ ملاحظات مهمة:

1. **كلمة المرور**: لا تشارك ملف `.env` مع أحد
2. **SSL**: مطلوب للاتصال بـ Aiven
3. **Connection Pool**: الحد الأقصى 20 اتصال متزامن
4. **Foreign Keys**: كل الجداول مربوطة بجدول `users`
5. **Cascade Delete**: لو حذفت مستخدم، كل بياناته هتتحذف تلقائياً

---

## 🆘 حل المشاكل:

### مشكلة: "password authentication failed"
✅ **الحل**: تأكد من كلمة المرور في `.env`

### مشكلة: "connection timeout"
✅ **الحل**: تأكد من الاتصال بالإنترنت وأن الـ firewall مش بيمنع الاتصال

### مشكلة: "relation already exists"
✅ **الحل**: الجداول موجودة بالفعل، استخدم `DROP TABLE IF EXISTS` لو عايز تعيد الإنشاء

### مشكلة: "SSL required"
✅ **الحل**: تأكد من `VITE_DB_SSL=true` في `.env`

---

## 📝 الأوامر المتاحة:

```bash
# اختبار الاتصال
npm run db:test

# تنفيذ migration (إنشاء الجداول)
npm run db:migrate

# تشغيل المشروع
npm run dev

# بناء المشروع
npm run build
```

---

## ✅ Checklist:

- [ ] تثبيت `pg` و `dotenv`
- [ ] إضافة كلمة المرور في `.env`
- [ ] اختبار الاتصال بـ `npm run db:test`
- [ ] تنفيذ migration بـ `npm run db:migrate`
- [ ] التحقق من إنشاء الجداول
- [ ] تجربة إدخال بيانات تجريبية

---

**🎉 بالتوفيق!**
