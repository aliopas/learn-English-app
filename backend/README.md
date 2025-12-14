# 🚀 English Learning Platform - Backend API

## 📋 المميزات

- ✅ JWT Authentication مع httpOnly Cookies
- ✅ Password Hashing بـ bcrypt
- ✅ PostgreSQL Database
- ✅ CORS Support
- ✅ Secure Cookie Management

---

## 🔧 التثبيت

### 1. تثبيت المكتبات
```bash
cd "back end"
npm install
```

### 2. إعداد `.env`
الملف موجود بالفعل مع الإعدادات الصحيحة

### 3. تشغيل السيرفر
```bash
# Development mode
npm run dev

# Production mode
npm start
```

السيرفر هيشتغل على: `http://localhost:5000`

---

## 📡 API Endpoints

### Authentication

#### 1. Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "User Name"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "User Name"
  }
}
```
+ httpOnly cookie with JWT token

---

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "User Name"
  }
}
```
+ httpOnly cookie with JWT token

---

#### 3. Get Current User
```http
GET /api/auth/me
Cookie: token=jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "User Name",
    "current_level": "A1",
    "current_day": 1,
    "listening_score": 0,
    "reading_score": 0,
    "speaking_score": 0,
    "grammar_score": 0,
    "streak_days": 0,
    "total_study_minutes": 0
  }
}
```

---

#### 4. Logout
```http
POST /api/auth/logout
Cookie: token=jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🔒 Security Features

### httpOnly Cookies
- الـ JWT token بيتخزن في httpOnly cookie
- مش ممكن الوصول ليه من JavaScript
- حماية من XSS attacks

### Password Hashing
- استخدام bcrypt مع salt rounds = 10
- Passwords مش بتتخزن plain text

### CORS Configuration
- السماح فقط للـ frontend URL المحدد
- Support للـ credentials (cookies)

---

## 📁 هيكل المشروع

```
back end/
├── config/
│   └── database.js       # Database connection
├── controllers/
│   └── authController.js # Auth logic
├── middleware/
│   └── auth.js           # JWT middleware
├── routes/
│   └── auth.js           # Auth routes
├── .env                  # Environment variables
├── package.json
└── server.js             # Main server file
```

---

## 🧪 اختبار الـ API

### باستخدام cURL:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","full_name":"Test User"}' \
  -c cookies.txt

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  -c cookies.txt

# Get Me
curl -X GET http://localhost:5000/api/auth/me \
  -b cookies.txt

# Logout
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt
```

---

## 🔄 الخطوات التالية

1. ✅ تشغيل Backend: `npm run dev`
2. ⚠️ تحديث Frontend ليستخدم الـ API
3. ⚠️ إضافة endpoints إضافية (user progress, lessons, etc.)

---

## 📝 ملاحظات

- الـ JWT token صالح لمدة 7 أيام
- في Production، غير `JWT_SECRET` لقيمة عشوائية قوية
- تأكد إن الـ Frontend والـ Backend شغالين على نفس الدومين أو استخدم HTTPS

---

**🎉 Backend جاهز للاستخدام!**
