# 🚀 دليل النشر للإنتاج (Production Deployment Guide)

هذا الدليل يشرح كيفية تحويل الموقع من وضع التطوير إلى الإنتاج ونشره على السيرفر.

---

## 📋 المتطلبات الأساسية

### 1. متطلبات السيرفر
- **Node.js** v18 أو أحدث
- **MongoDB** (يُفضل MongoDB Atlas للإنتاج)
- **npm** أو **yarn**
- **خادم ويب** (Nginx أو Apache) - اختياري للـ Frontend

### 2. الحسابات المطلوبة
- ✅ حساب Cloudinary (موجود بالفعل)
- ✅ MongoDB Atlas أو خادم MongoDB للإنتاج
- ✅ دومين للموقع (مثل: `tamalarabiya.com`)

---

## ⚙️ الإعداد للإنتاج

### الخطوة 1: تحديث ملفات البيئة

#### Frontend (`.env.production`)
```bash
# افتح الملف: c:\Users\HP\Desktop\tam\.env.production
VITE_SITE_URL=https://your-production-domain.com
VITE_API_URL=https://your-api-domain.com
```

**استبدل:**
- `your-production-domain.com` برابط موقعك الفعلي
- `your-api-domain.com` برابط الـ API (قد يكون نفس الدومين مع `/api`)

#### Backend (`server/.env.production`)
```bash
# افتح الملف: c:\Users\HP\Desktop\tam\server\.env.production
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tam_gallery
CLOUDINARY_CLOUD_NAME=dagrjj9j6
CLOUDINARY_API_KEY=171216428731457
CLOUDINARY_API_SECRET=kqxdd58hNLLFGZ9ei_fDlGkCyMs
CLIENT_ORIGIN=https://your-production-domain.com
```

**استبدل:**
- `MONGODB_URI` برابط قاعدة البيانات من MongoDB Atlas
- `CLIENT_ORIGIN` برابط موقعك الأمامي

> [!IMPORTANT]
> **MongoDB Atlas Setup:**
> 1. سجل في [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
> 2. أنشئ Cluster جديد (المجاني يكفي للبداية)
> 3. أنشئ Database User
> 4. أضف IP Address للسيرفر في Network Access
> 5. انسخ Connection String واستبدله في `MONGODB_URI`

---

## 🏗️ بناء المشروع للإنتاج

### 1. بناء Frontend

```bash
cd c:\Users\HP\Desktop\tam
npm run build:prod
```

هذا الأمر سينشئ مجلد `dist` يحتوي على الملفات المحسّنة للإنتاج.

**التحقق من النجاح:**
- يجب أن ترى مجلد `dist` جديد
- حجم الملفات يجب أن يكون صغير (minified)
- يجب أن ترى رسالة نجاح في Terminal

### 2. اختبار البناء محلياً

```bash
npm run preview:prod
```

افتح المتصفح على `http://localhost:4173` وتحقق من:
- ✅ تحميل الموقع بشكل صحيح
- ✅ عمل جميع الروابط
- ✅ تحميل الصور

---

## 🌐 نشر Frontend

### الخيار 1: استخدام Netlify (الأسهل - مجاني)

1. **سجل في [Netlify](https://www.netlify.com/)**

2. **ارفع المشروع:**
   - اسحب مجلد `dist` إلى Netlify
   - أو اربط GitHub repository

3. **إعدادات البناء:**
   ```
   Build command: npm run build:prod
   Publish directory: dist
   ```

4. **Environment Variables:**
   أضف في Netlify Dashboard:
   ```
   VITE_SITE_URL=https://your-netlify-domain.netlify.app
   VITE_API_URL=https://your-backend-url.com
   ```

### الخيار 2: استخدام Vercel (سريع - مجاني)

1. **سجل في [Vercel](https://vercel.com/)**

2. **استورد المشروع من GitHub**

3. **إعدادات البناء:**
   ```
   Framework Preset: Vite
   Build Command: npm run build:prod
   Output Directory: dist
   ```

4. **Environment Variables:**
   أضف المتغيرات نفسها كما في Netlify

### الخيار 3: خادم خاص (VPS)

#### باستخدام Nginx

1. **انقل ملفات `dist` للسيرفر:**
   ```bash
   scp -r dist/* user@your-server:/var/www/tam
   ```

2. **إعداد Nginx:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/tam;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Gzip compression
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
   }
   ```

3. **أعد تشغيل Nginx:**
   ```bash
   sudo systemctl restart nginx
   ```

---

## 🔧 نشر Backend

### الخيار 1: Render (مجاني - سهل)

1. **سجل في [Render](https://render.com/)**

2. **أنشئ Web Service جديد:**
   - اربط GitHub repository
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm run start:prod`

3. **Environment Variables:**
   أضف جميع المتغيرات من `server/.env.production`

### الخيار 2: Railway (سريع)

1. **سجل في [Railway](https://railway.app/)**

2. **أنشئ مشروع جديد:**
   - اختر "Deploy from GitHub"
   - حدد مجلد `server`

3. **أضف Environment Variables**

### الخيار 3: VPS (خادم خاص)

1. **انقل ملفات Backend:**
   ```bash
   scp -r server/* user@your-server:/var/www/tam-backend
   ```

2. **ثبت Dependencies:**
   ```bash
   cd /var/www/tam-backend
   npm install --production
   ```

3. **استخدم PM2 لإدارة العملية:**
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name tam-backend
   pm2 startup
   pm2 save
   ```

4. **إعداد Nginx كـ Reverse Proxy:**
   ```nginx
   server {
       listen 80;
       server_name api.your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## ✅ قائمة التحقق النهائية

قبل النشر، تأكد من:

- [ ] تحديث جميع الروابط في `.env.production`
- [ ] تحديث `MONGODB_URI` برابط الإنتاج
- [ ] تحديث `CLIENT_ORIGIN` في Backend
- [ ] اختبار البناء محلياً بـ `npm run preview:prod`
- [ ] التأكد من عمل الـ API مع Frontend
- [ ] إعداد SSL Certificate (HTTPS) للموقع
- [ ] اختبار رفع الصور على Cloudinary
- [ ] التحقق من عمل جميع الصفحات
- [ ] اختبار الموقع على أجهزة مختلفة

---

## 🔒 الأمان

### نصائح مهمة:

1. **لا ترفع ملفات `.env.production` على Git**
   - تم إضافتها لـ `.gitignore` تلقائياً

2. **استخدم HTTPS دائماً في الإنتاج**
   - احصل على SSL مجاني من [Let's Encrypt](https://letsencrypt.org/)

3. **قيّد الوصول لـ MongoDB**
   - أضف فقط IP addresses المصرح لها

4. **احمِ API Keys**
   - لا تشارك Cloudinary credentials
   - استخدم Environment Variables على السيرفر

---

## 🐛 استكشاف الأخطاء

### المشكلة: الموقع لا يعمل بعد النشر

**الحل:**
1. تحقق من Console في المتصفح (F12)
2. تأكد من صحة `VITE_API_URL`
3. تحقق من عمل Backend على الرابط المحدد

### المشكلة: الصور لا تظهر

**الحل:**
1. تحقق من Cloudinary credentials
2. تأكد من رفع الصور بنجاح
3. افحص Network tab في Developer Tools

### المشكلة: خطأ في الاتصال بقاعدة البيانات

**الحل:**
1. تحقق من صحة `MONGODB_URI`
2. تأكد من إضافة IP السيرفر في MongoDB Atlas
3. تحقق من صحة username/password

---

## 📞 الدعم

إذا واجهت أي مشاكل:
1. راجع logs السيرفر
2. تحقق من Browser Console
3. تأكد من صحة جميع Environment Variables

---

## 🎉 تهانينا!

موقعك الآن جاهز للإنتاج! 🚀
