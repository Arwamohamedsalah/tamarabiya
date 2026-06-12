/**
 * Production Build Verification Script
 * يتحقق من جاهزية المشروع للإنتاج
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 التحقق من جاهزية المشروع للإنتاج...\n');

let hasErrors = false;

// التحقق من ملفات البيئة
console.log('📋 فحص ملفات البيئة...');

const envFiles = [
    { path: '.env.production', name: 'Frontend Production Env' },
    { path: 'server/.env.production', name: 'Backend Production Env' }
];

envFiles.forEach(({ path: filePath, name }) => {
    if (fs.existsSync(filePath)) {
        console.log(`  ✅ ${name}: موجود`);

        // قراءة المحتوى والتحقق من Placeholders
        const content = fs.readFileSync(filePath, 'utf-8');
        if (content.includes('your-production-domain') || content.includes('your-api-domain')) {
            console.log(`  ⚠️  ${name}: يحتوي على placeholders - يجب تحديثه!`);
            hasErrors = true;
        }
    } else {
        console.log(`  ❌ ${name}: غير موجود`);
        hasErrors = true;
    }
});

console.log('\n🏗️  بناء Frontend...');
try {
    execSync('npm run build:prod', { stdio: 'inherit' });
    console.log('  ✅ تم بناء Frontend بنجاح');

    // التحقق من حجم مجلد dist
    const distPath = path.join(__dirname, '..', 'dist');
    if (fs.existsSync(distPath)) {
        const stats = fs.statSync(distPath);
        console.log(`  📦 مجلد dist موجود`);
    }
} catch (error) {
    console.log('  ❌ فشل بناء Frontend');
    hasErrors = true;
}

console.log('\n📦 فحص Dependencies للـ Backend...');
try {
    execSync('cd server && npm list --depth=0', { stdio: 'inherit' });
    console.log('  ✅ جميع dependencies موجودة');
} catch (error) {
    console.log('  ⚠️  بعض dependencies قد تكون مفقودة');
}

console.log('\n' + '='.repeat(50));
if (hasErrors) {
    console.log('❌ يوجد مشاكل يجب حلها قبل النشر');
    console.log('📖 راجع ملف PRODUCTION_DEPLOYMENT.md للمزيد من التفاصيل');
    process.exit(1);
} else {
    console.log('✅ المشروع جاهز للنشر!');
    console.log('📖 اتبع التعليمات في PRODUCTION_DEPLOYMENT.md');
}
