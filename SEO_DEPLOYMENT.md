# إعداد SEO للنشر

## قبل النشر على الإنترنت

1. **عدّل `.env`** واضبط رابط موقعك:
   ```
   VITE_SITE_URL=https://yourdomain.com
   ```

2. **عدّل `public/robots.txt`** - غيّر السطر:
   ```
   Sitemap: https://yourdomain.com/sitemap.xml
   ```

3. **عدّل `public/sitemap.xml`** - استبدل `https://tamalarabiya.com` برابط موقعك في كل الروابط.

4. **شعار الموقع (اختياري)** - لاستخدام شعارك بدل الافتراضي:
   - ضع ملف `og-image.png` (1200×630 بكسل) في مجلد `public/` - للأفضلية على فيسبوك وتويتر
   - أو استبدل `logo.svg` و`og-image.svg` بنسخ شعارك

5. **أعد البناء**:
   ```
   npm run build
   ```

## ملاحظة
- فيسبوك وتويتر يفضّلان PNG لصورة المشاركة. إذا لم يظهر الـ SVG جيداً، أضف `og-image.png`.
