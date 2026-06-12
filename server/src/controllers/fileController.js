const File = require('../models/File');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const { Readable } = require('stream');

// Helper: get GridFS bucket
function getBucket() {
    return new GridFSBucket(mongoose.connection.db, {
        bucketName: 'company_profiles',
    });
}

/**
 * @desc    Check if company profile PDF exists (HEAD request)
 * @route   HEAD /api/download-profile
 * @access  Public
 */
exports.checkCompanyProfile = async (req, res) => {
    try {
        const fileMetadata = await File.findOne({ key: 'company_profile' });
        if (!fileMetadata) return res.status(404).end();

        const bucket = getBucket();
        const files = await bucket.find({ filename: 'company-profile.pdf' }).toArray();
        if (!files || files.length === 0) return res.status(404).end();

        res.set('Content-Type', 'application/pdf');
        res.status(200).end();
    } catch {
        res.status(500).end();
    }
};

/**
 * @desc    Download company profile PDF
 * @route   GET /api/download-profile
 * @access  Public
 */
exports.downloadCompanyProfile = async (req, res) => {
    try {
        const fileMetadata = await File.findOne({ key: 'company_profile' });

        if (!fileMetadata) {
            return res.status(404).json({
                success: false,
                message: 'لم يتم رفع بروفايل الشركة بعد.',
            });
        }

        const bucket = getBucket();

        // Find the file in GridFS
        const files = await bucket.find({ filename: 'company-profile.pdf' }).toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'الملف غير موجود في قاعدة البيانات.',
            });
        }

        const file = files[0];

        // Read entire file into buffer first, then send - avoids nginx stream timeout issues
        const chunks = [];
        await new Promise((resolve, reject) => {
            const downloadStream = bucket.openDownloadStreamByName('company-profile.pdf');
            downloadStream.on('data', (chunk) => chunks.push(chunk));
            downloadStream.on('end', resolve);
            downloadStream.on('error', reject);
        });

        const fileBuffer = Buffer.concat(chunks);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${fileMetadata.name || 'Company_Profile.pdf'}"`,
            'Content-Length': fileBuffer.length,
            'Cache-Control': 'no-cache',
            'X-File-Size': file.length,
        });

        return res.send(fileBuffer);
    } catch (error) {
        console.error('Download error:', error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: 'خطأ في السيرفر.' });
        }
    }
};

/**
 * @desc    Upload / replace company profile PDF → stored in MongoDB GridFS
 * @route   POST /api/upload-profile
 * @access  Private (admin)
 */
exports.uploadCompanyProfile = async (req, res) => {
    try {
        const { fileBase64, fileName } = req.body;

        if (!fileBase64 || !fileName) {
            return res.status(400).json({ success: false, message: 'fileBase64 and fileName are required.' });
        }

        if (!fileName.toLowerCase().endsWith('.pdf')) {
            return res.status(400).json({ success: false, message: 'يجب أن يكون الملف بصيغة PDF.' });
        }

        // Strip data URI prefix
        const base64Data = fileBase64.replace(/^data:[^;]+;base64,/, '');
        if (!base64Data || base64Data.length < 10) {
            return res.status(400).json({ success: false, message: 'بيانات الملف غير صالحة.' });
        }

        const fileBuffer = Buffer.from(base64Data, 'base64');
        const bucket = getBucket();

        // Replace previous PDF only when admin uploads a new one (intentional overwrite)
        try {
            const existing = await bucket.find({ filename: 'company-profile.pdf' }).toArray();
            for (const f of existing) {
                await bucket.delete(f._id);
            }
        } catch (e) {
            console.warn('Could not delete old GridFS file:', e.message);
        }

        // Upload to GridFS
        await new Promise((resolve, reject) => {
            const readable = Readable.from(fileBuffer);
            const uploadStream = bucket.openUploadStream('company-profile.pdf', {
                contentType: 'application/pdf',
                metadata: { originalName: fileName },
            });
            readable.pipe(uploadStream);
            uploadStream.on('finish', resolve);
            uploadStream.on('error', reject);
        });

        // Upsert DB metadata record
        await File.findOneAndUpdate(
            { key: 'company_profile' },
            {
                key: 'company_profile',
                name: fileName,
                url: null,         // no Cloudinary
                publicId: null,
                path: 'gridfs:company-profile.pdf',
                mimetype: 'application/pdf',
                size: fileBuffer.length,
            },
            { upsert: true, new: true }
        );

        res.json({
            success: true,
            message: 'تم رفع بروفايل الشركة بنجاح وحُفظ في قاعدة البيانات.',
        });
    } catch (error) {
        console.error('Upload error:', error.message, error.stack);
        res.status(500).json({
            success: false,
            message: `خطأ في رفع الملف: ${error.message}`,
        });
    }
};

/**
 * @desc    Delete company profile PDF from GridFS + metadata
 * @route   DELETE /api/delete-profile
 * @access  Private (admin)
 */
exports.deleteCompanyProfile = async (req, res) => {
    try {
        const bucket = getBucket();
        const gridFiles = await bucket.find({ filename: 'company-profile.pdf' }).toArray();

        for (const f of gridFiles) {
            await bucket.delete(f._id);
        }

        await File.deleteOne({ key: 'company_profile' });

        res.json({
            success: true,
            message: 'تم حذف بروفايل الشركة من قاعدة البيانات.',
        });
    } catch (error) {
        console.error('Delete profile error:', error.message);
        res.status(500).json({
            success: false,
            message: `خطأ في حذف الملف: ${error.message}`,
        });
    }
};
