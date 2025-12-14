# 🚀 دليل Drizzle ORM - إعداد قاعدة البيانات

## ما هو Drizzle ORM؟
Drizzle هو ORM حديث وسريع لـ PostgreSQL بيوفر:
- ✅ إدارة تلقائية للـ migrations
- ✅ Type safety (حتى مع JavaScript)
- ✅ Drizzle Studio - واجهة مرئية لإدارة البيانات
- ✅ Query builder سهل الاستخدام

---

## 📋 الخطوات المطلوبة:

### 1️⃣ تثبيت Drizzle ORM
```bash
cd project
npm install drizzle-orm drizzle-kit
```

### 2️⃣ إضافة كلمة المرور في `.env`
افتح ملف `project/.env` وغير:
```env
VITE_DB_PASSWORD=YOUR_PASSWORD_HERE
```
بكلمة المرور الحقيقية من Aiven.

---

## 🎯 أوامر Drizzle المتاحة:

### 1. `npm run db:generate`
**ينشئ ملفات migration من الـ schema**

```bash
npm run db:generate
```

هيعمل إيه:
- يقرأ ملف `database/schema.js`
- ينشئ ملفات SQL في `database/migrations/`
- كل تغيير في الـ schema هيتسجل في migration جديد

---

### 2. `npm run db:push`
**يرفع الـ schema مباشرة للداتابيز (بدون migrations)**

```bash
npm run db:push
```

⚠️ **استخدم ده في التطوير فقط!**
- أسرع من `generate` + `migrate`
- مافيش history للتغييرات
- مثالي للتجربة السريعة

---

### 3. `npm run db:migrate`
**ينفذ ملفات الـ migrations على قاعدة البيانات**

```bash
npm run db:migrate
```

استخدم ده في Production:
- ينفذ جميع migrations اللي لسه مانفذتش
- يحافظ على history التغييرات
- آمن للإنتاج

---

### 4. `npm run db:studio`
**يفتح Drizzle Studio - واجهة مرئية للداتابيز**

```bash
npm run db:studio
```

هيفتح في المتصفح على: `https://local.drizzle.studio`

**المميزات:**
- 👀 عرض جميع الجداول والبيانات
- ✏️ تعديل البيانات مباشرة
- 🔍 بحث وفلترة
- 📊 عرض العلاقات بين الجداول

---

## 🏗️ سير العمل الموصى به:

### للتطوير السريع:
```bash
# 1. عدّل في database/schema.js
# 2. ارفع التغييرات مباشرة
npm run db:push
```

### للإنتاج (Production):
```bash
# 1. عدّل في database/schema.js
# 2. أنشئ migration
npm run db:generate
# 3. نفذ الـ migration
npm run db:migrate
```

---

## 📁 هيكل الملفات:

```
project/
├── database/
│   ├── schema.js           # تعريف الجداول (Drizzle)
│   ├── schema.sql          # SQL مباشر (اختياري)
│   ├── migrate.js          # سكريبت migration يدوي
│   └── migrations/         # ملفات migrations (تتولد تلقائياً)
│       ├── 0000_xxx.sql
│       ├── 0001_xxx.sql
│       └── meta/
├── drizzle.config.js       # إعدادات Drizzle
├── .env                    # معلومات الاتصال
└── package.json
```

---

## 💻 استخدام Drizzle في الكود:

### إعداد الاتصال:
```javascript
// src/lib/db.js
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.VITE_DB_HOST,
  port: parseInt(process.env.VITE_DB_PORT),
  database: process.env.VITE_DB_NAME,
  user: process.env.VITE_DB_USER,
  password: process.env.VITE_DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

export const db = drizzle(pool);
```

### مثال 1: إدخال مستخدم جديد
```javascript
import { db } from './lib/db.js';
import { users } from '../database/schema.js';

const newUser = await db.insert(users).values({
  email: 'ali@example.com',
  passwordHash: 'hashed_password',
  fullName: 'Ali'
}).returning();

console.log(newUser);
```

### مثال 2: جلب بيانات مستخدم
```javascript
import { eq } from 'drizzle-orm';
import { db } from './lib/db.js';
import { users, userProfiles } from '../database/schema.js';

const user = await db
  .select()
  .from(users)
  .where(eq(users.email, 'ali@example.com'))
  .limit(1);
```

### مثال 3: تحديث البيانات
```javascript
await db
  .update(userProfiles)
  .set({ 
    currentDay: 5,
    listeningScore: 75 
  })
  .where(eq(userProfiles.userId, userId));
```

### مثال 4: Join بين جدولين
```javascript
const userWithProfile = await db
  .select()
  .from(users)
  .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
  .where(eq(users.id, userId));
```

### مثال 5: حذف بيانات
```javascript
await db
  .delete(dailyTasks)
  .where(eq(dailyTasks.userId, userId));
```

---

## 🎨 الجداول المتاحة في `schema.js`:

```javascript
import { 
  users,              // المستخدمين
  userProfiles,       // الملفات التعليمية
  lessonProgress,     // تقدم الدروس
  vocabularyProgress, // تقدم المفردات
  aiConversations,    // محادثات AI
  dailyTasks,         // المهام اليومية
  achievements        // الإنجازات
} from './database/schema.js';
```

---

## 🔧 نصائح مهمة:

### 1. استخدم `db:push` في التطوير
```bash
npm run db:push
```
أسرع وأسهل للتجربة

### 2. استخدم `db:generate` + `db:migrate` في Production
```bash
npm run db:generate
npm run db:migrate
```
يحافظ على history التغييرات

### 3. افتح Drizzle Studio لعرض البيانات
```bash
npm run db:studio
```
أسهل من كتابة SQL queries

### 4. لا تعدل ملفات migrations يدوياً
الملفات في `database/migrations/` تتولد تلقائياً

---

## 📊 مقارنة الأوامر:

| الأمر | الاستخدام | السرعة | Production-Ready |
|------|-----------|--------|------------------|
| `db:push` | تطوير سريع | ⚡⚡⚡ | ❌ |
| `db:generate` | إنشاء migrations | ⚡⚡ | ✅ |
| `db:migrate` | تنفيذ migrations | ⚡⚡ | ✅ |
| `db:studio` | عرض البيانات | ⚡⚡⚡ | ✅ |

---

## ✅ Checklist:

- [ ] تثبيت `drizzle-orm` و `drizzle-kit`
- [ ] إضافة كلمة المرور في `.env`
- [ ] تجربة `npm run db:push` لإنشاء الجداول
- [ ] فتح `npm run db:studio` لعرض الجداول
- [ ] تجربة إدخال بيانات تجريبية

---

## 🆘 حل المشاكل:

### مشكلة: "Cannot find module 'drizzle-orm'"
```bash
npm install drizzle-orm drizzle-kit
```

### مشكلة: "password authentication failed"
تأكد من كلمة المرور في `.env`

### مشكلة: Drizzle Studio لا يفتح
جرب:
```bash
npx drizzle-kit studio
```

---

**🎉 الآن عندك نظام migrations احترافي!**
