require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');
const { GridFSBucket } = require('mongodb');

const connectDB = require('./src/config/db');
const File = require('./src/models/File');

function getBucket() {
  return new GridFSBucket(mongoose.connection.db, { bucketName: 'company_profiles' });
}

async function uploadPdfToGridFS(fileBuffer, fileName) {
  const bucket = getBucket();

  const existing = await bucket.find({ filename: 'company-profile.pdf' }).toArray();
  for (const f of existing) {
    await bucket.delete(f._id);
  }

  await new Promise((resolve, reject) => {
    const readable = Readable.from(fileBuffer);
    const uploadStream = bucket.openUploadStream('company-profile.pdf', {
      contentType: 'application/pdf',
      metadata: { originalName: fileName, seededAt: new Date().toISOString() },
    });
    readable.pipe(uploadStream);
    uploadStream.on('finish', resolve);
    uploadStream.on('error', reject);
  });

  await File.findOneAndUpdate(
    { key: 'company_profile' },
    {
      key: 'company_profile',
      name: fileName,
      url: null,
      publicId: null,
      path: 'gridfs:company-profile.pdf',
      mimetype: 'application/pdf',
      size: fileBuffer.length,
    },
    { upsert: true, new: true }
  );
}

async function seedCompanyProfile() {
  try {
    await connectDB();

    const relativePath = path.join('public', 'documents', 'company-profile.pdf');
    const absolutePath = path.join(__dirname, relativePath);

    if (!fs.existsSync(absolutePath)) {
      console.warn('⚠️  PDF not found at:', absolutePath);
      console.warn('   Upload via Dashboard → بروفايل الشركة, or place the file there and re-run.');
      process.exitCode = 1;
      return;
    }

    const fileBuffer = fs.readFileSync(absolutePath);
    const fileName = 'Tam_Al_Arabia_Company_Profile.pdf';

    await uploadPdfToGridFS(fileBuffer, fileName);

    console.log('✅ Company profile PDF saved permanently in MongoDB GridFS');
    console.log(`   Size: ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB`);
  } catch (error) {
    console.error('❌ Error seeding company profile:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seedCompanyProfile();
