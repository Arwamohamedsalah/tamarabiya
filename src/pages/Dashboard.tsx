import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { addImage, updateImage, deleteImage, setImages } from '../store/slices/imagesSlice';
import { setPageContent, setAllPageContents } from '../store/slices/pageContentSlice';
import { addNotification } from '../store/slices/uiSlice';
import type { PageContentData, ServiceType } from '../store/slices/pageContentSlice';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Plus, Edit, Trash2, Image as ImageIcon, Home, Sprout, Fence, Building2, Globe, X, Crop, Info, Phone, FileUp, CheckCircle, QrCode } from 'lucide-react';
import SiteSettingsEditor from '../components/dashboard/SiteSettingsEditor';
import WorkAreaContentEditor from '../components/dashboard/WorkAreaContentEditor';
import { setSiteSettings } from '../store/slices/siteSettingsSlice';
import { API_BASE_URL } from '../config/api';
import defaultLandscapingWorkAreas from '../content/landscapingWorkAreas.json';
import defaultFencingWorkAreas from '../content/fencingWorkAreas.json';
import defaultInfrastructureWorkAreas from '../content/infrastructureWorkAreas.json';
import type { WorkAreaSection } from '../types/workAreaSection';
import type { ImageItem } from '../store/slices/imagesSlice';

const WORK_AREA_DEFAULTS: Record<'landscaping' | 'fencing' | 'infrastructure', WorkAreaSection[]> = {
  landscaping: defaultLandscapingWorkAreas as WorkAreaSection[],
  fencing: defaultFencingWorkAreas as WorkAreaSection[],
  infrastructure: defaultInfrastructureWorkAreas as WorkAreaSection[],
};

type PageType = 'home' | 'landscaping' | 'fencing' | 'infrastructure' | 'about' | 'contact' | 'files' | 'settings';
type SectionType = 'hero' | 'services' | 'gallery' | 'projects' | 'header' | 'content';

function PageContentEditor({
  data,
  onSave,
  token,
  images,
  apiBase,
  onImageChange,
}: {
  data: PageContentData;
  onSave: (d: Partial<PageContentData>) => void;
  token: string | null;
  images: ImageItem[];
  apiBase: string;
  onImageChange: (image: ImageItem, action: 'add' | 'update' | 'delete') => void;
}) {
  const [form, setForm] = useState<PageContentData>(data);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const workAreaSections = data.workAreaSections?.length
      ? data.workAreaSections
      : WORK_AREA_DEFAULTS[data.page] || [];
    setForm({ ...data, workAreaSections });
  }, [data]);

  const update = (k: keyof PageContentData, v: any) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  const updateServiceType = (idx: number, field: keyof ServiceType, value: string) => {
    setForm((prev) => {
      const arr = [...(prev.serviceTypes || [])];
      if (!arr[idx]) arr[idx] = { name: '', nameAr: '', desc: '' };
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...prev, serviceTypes: arr };
    });
  };

  const addServiceType = () => {
    setForm((prev) => ({
      ...prev,
      serviceTypes: [...(prev.serviceTypes || []), { name: '', nameAr: '', desc: '' }],
    }));
  };

  const removeServiceType = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      serviceTypes: prev.serviceTypes.filter((_, i) => i !== idx),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const {
      page,
      introTitle,
      introTitleEn,
      introDescription,
      introDescriptionEn,
      serviceTypes,
      workAreaSections,
      ctaTitle,
      ctaTitleEn,
      ctaDescription,
      ctaDescriptionEn,
      ctaButtonText,
      ctaButtonTextEn,
    } = form;
    await onSave({
      page,
      introTitle,
      introTitleEn,
      introDescription,
      introDescriptionEn,
      serviceTypes,
      workAreaSections,
      ctaTitle,
      ctaTitleEn,
      ctaDescription,
      ctaDescriptionEn,
      ctaButtonText,
      ctaButtonTextEn,
    });
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-none shadow-lg p-6 space-y-8">
      <h2 className="text-xl font-bold text-gray-900">محتوى الصفحة - النصوص ومجالات العمل</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">العنوان والوصف</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">عنوان القسم</label>
          <input
            type="text"
            value={form.introTitle}
            onChange={(e) => update('introTitle', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-none focus:ring-2 focus:ring-cta"
            dir="rtl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">وصف القسم</label>
          <textarea
            value={form.introDescription}
            onChange={(e) => update('introDescription', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-none focus:ring-2 focus:ring-cta"
            dir="rtl"
          />
        </div>
      </div>

      {form.workAreaSections && form.workAreaSections.length > 0 && (
        <WorkAreaContentEditor
          page={form.page}
          sections={form.workAreaSections}
          onChange={(sections) => update('workAreaSections', sections)}
          images={images}
          token={token}
          apiBase={apiBase}
          onImageChange={onImageChange}
        />
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">مجالات العمل (بطاقات — للصفحات البسيطة)</h3>
          <button
            type="button"
            onClick={addServiceType}
            className="px-3 py-1.5 bg-cta text-white rounded-none text-sm hover:bg-cta-hover"
          >
            + إضافة مجال
          </button>
        </div>
        <div className="space-y-3">
          {(form.serviceTypes || []).map((item, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-none space-y-2">
              <div className="flex justify-between items-start">
                <button
                  type="button"
                  onClick={() => removeServiceType(idx)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  حذف
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="الاسم بالإنجليزي"
                  value={item.name}
                  onChange={(e) => updateServiceType(idx, 'name', e.target.value)}
                  className="px-3 py-2 border rounded-none text-sm"
                  dir="ltr"
                />
                <input
                  type="text"
                  placeholder="الاسم بالعربي"
                  value={item.nameAr}
                  onChange={(e) => updateServiceType(idx, 'nameAr', e.target.value)}
                  className="px-3 py-2 border rounded-none text-sm"
                  dir="rtl"
                />
                <input
                  type="text"
                  placeholder="الوصف"
                  value={item.desc}
                  onChange={(e) => updateServiceType(idx, 'desc', e.target.value)}
                  className="px-3 py-2 border rounded-none text-sm md:col-span-1"
                  dir="rtl"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">قسم التواصل (CTA)</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">عنوان CTA</label>
          <input
            type="text"
            value={form.ctaTitle}
            onChange={(e) => update('ctaTitle', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-none focus:ring-2 focus:ring-cta"
            dir="rtl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">وصف CTA</label>
          <input
            type="text"
            value={form.ctaDescription}
            onChange={(e) => update('ctaDescription', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-none focus:ring-2 focus:ring-cta"
            dir="rtl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">نص الزر</label>
          <input
            type="text"
            value={form.ctaButtonText}
            onChange={(e) => update('ctaButtonText', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-none focus:ring-2 focus:ring-cta"
            dir="rtl"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 bg-cta text-white font-black uppercase tracking-widest rounded-none hover:bg-cta-hover transition-all duration-300 disabled:opacity-70"
      >
        {saving ? 'جاري الحفظ...' : 'حفظ المحتوى'}
      </button>
    </div>
  );
}

// ─── PDF Upload Section ──────────────────────────────────────────────────────

function PdfUploadSection({ token, apiBase }: { token: string | null; apiBase: string }) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'reading' | 'uploading' | 'deleting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentProfile, setCurrentProfile] = useState<{ name: string } | null>(null);

  // Check if a profile already exists
  useEffect(() => {
    fetch(`${apiBase}/download-profile`, { method: 'HEAD' })
      .then(res => {
        if (res.ok) setCurrentProfile({ name: 'company-profile.pdf' });
      })
      .catch(() => { });
  }, [apiBase]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') {
      setMessage('الرجاء اختيار ملف PDF فقط');
      setStatus('error');
      return;
    }
    setPdfFile(f);
    setStatus('idle');
    setMessage('');
    setUploadProgress(0);
  };

  const handleUpload = () => {
    if (!pdfFile || !token) return;

    setStatus('reading');
    setMessage('');
    setUploadProgress(0);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setStatus('uploading');

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${apiBase}/upload-profile`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const pct = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(pct);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setStatus('success');
          setMessage('تم رفع بروفايل الشركة بنجاح ✓');
          setCurrentProfile({ name: pdfFile.name });
          setPdfFile(null);
          setUploadProgress(100);
        } else if (xhr.status === 401) {
          setStatus('error');
          setMessage('غير مصرح - يرجى تسجيل الخروج والدخول مجدداً');
        } else if (xhr.status === 413) {
          setStatus('error');
          setMessage('حجم الملف أكبر من الحد المسموح به على السيرفر');
        } else {
          let errMsg = `فشل الرفع (${xhr.status})`;
          try {
            const parsed = JSON.parse(xhr.responseText);
            errMsg = parsed?.message || errMsg;
          } catch { }
          setStatus('error');
          setMessage(errMsg);
        }
      };

      xhr.onerror = () => {
        setStatus('error');
        setMessage('خطأ في الاتصال بالسيرفر');
      };

      xhr.send(JSON.stringify({ fileBase64: base64, fileName: pdfFile.name }));
    };

    reader.onerror = () => {
      setStatus('error');
      setMessage('فشل قراءة الملف');
    };

    reader.readAsDataURL(pdfFile);
  };

  const handleDelete = async () => {
    if (!token || !currentProfile) return;
    if (!confirm('هل أنت متأكد من حذف بروفايل الشركة؟ لن يكون متاحاً للتنزيل من الموقع.')) return;

    setStatus('deleting');
    setMessage('');

    try {
      const res = await fetch(`${apiBase}/delete-profile`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || 'فشل حذف الملف');
      }

      setCurrentProfile(null);
      setPdfFile(null);
      setStatus('success');
      setMessage('تم حذف بروفايل الشركة بنجاح ✓');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'فشل حذف الملف');
    }
  };

  const isbusy = status === 'reading' || status === 'uploading' || status === 'deleting';

  return (
    <div className="bg-white shadow-lg p-8 max-w-xl mx-auto space-y-6" dir="rtl">
      <div className="flex items-center gap-3 mb-2">
        <FileUp className="h-7 w-7 text-cta" />
        <h2 className="text-xl font-bold text-gray-900">رفع بروفايل الشركة (PDF)</h2>
      </div>
      <p className="text-sm text-gray-500">
        ارفع ملف PDF ليكون متاحاً للتنزيل من أيقونة التنزيل العائمة في كل صفحات الموقع.
      </p>

      {currentProfile && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-green-50 border border-green-200 text-green-700 text-sm">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>الملف الحالي: <strong>{currentProfile.name}</strong></span>
          <div className="mr-auto flex items-center gap-3">
            <a
              href={`${apiBase}/download-profile`}
              download="Company_Profile.pdf"
              className="text-xs underline text-green-600 hover:text-green-800"
            >
              ⬇ تنزيل
            </a>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isbusy}
              className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              حذف
            </button>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">اختر ملف PDF</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFile}
          disabled={isbusy}
          className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cta file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-cta/10 file:text-cta hover:file:bg-cta/20 cursor-pointer disabled:opacity-50"
        />
        {pdfFile && (
          <p className="text-xs text-gray-600 mt-2">
            📄 {pdfFile.name} — {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
        )}
      </div>

      {/* Progress bar - shown while reading or uploading */}
      {isbusy && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>{status === 'reading' ? 'قراءة الملف...' : 'جاري الرفع...'}</span>
            <span>{status === 'uploading' ? `${uploadProgress}%` : ''}</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-cta transition-all duration-300 rounded-full"
              style={{
                width: status === 'reading'
                  ? '15%'
                  : `${uploadProgress}%`
              }}
            />
          </div>
          {status === 'uploading' && (
            <p className="text-xs text-gray-500 text-center">
              {uploadProgress < 100 ? `تم رفع ${uploadProgress}٪ من الملف` : 'اكتمل الرفع، يتم الحفظ...'}
            </p>
          )}
        </div>
      )}

      {message && (
        <div className={`p-3 text-sm font-medium ${status === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!pdfFile || isbusy}
        className="w-full py-3 bg-cta text-white font-black uppercase tracking-widest hover:bg-cta-hover transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isbusy ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            {status === 'reading' ? 'قراءة الملف...' : status === 'deleting' ? 'جاري الحذف...' : `يتم الرفع ${uploadProgress}%`}
          </>
        ) : (
          <>
            <FileUp className="h-4 w-4" />
            رفع البروفايل
          </>
        )}
      </button>
    </div>
  );
}



export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const token = useAppSelector((state) => state.auth.token);
  const images = useAppSelector((state) => state.images.images);
  const pageContent = useAppSelector((state) => state.pageContent.byPage);

  const [selectedPage, setSelectedPage] = useState<PageType>('home');
  const [selectedSection, setSelectedSection] = useState<SectionType>('hero');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    url: '',
    alt: '',
    page: 'home' as PageType,
    section: 'hero' as SectionType,
    videoUrl: '',
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrls, setPreviewUrls] = useState<Array<{ url: string; alt: string; file?: File }>>([]);
  const [multipleMode, setMultipleMode] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [cropSettings, setCropSettings] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [, setCropImageRef] = useState<HTMLImageElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragType, setDragType] = useState<'move' | 'resize-top' | 'resize-bottom' | 'resize-left' | 'resize-right' | 'resize-tl' | 'resize-tr' | 'resize-bl' | 'resize-br' | null>(null);
  const [cropContainerRef, setCropContainerRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // تحميل الصور من الـ backend عند فتح الداشبورد
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/images`);
        if (!res.ok) return;
        const data = await res.json();
        // نطابق شكل البيانات مع ImageItem في الفرونت
        const mapped = data.map((img: any) => ({
          id: img._id,
          url: img.url,
          alt: img.alt || '',
          page: img.page,
          section: img.section,
          crop: img.crop,
          order: img.order,
          isActive: img.isActive,
          createdAt: img.createdAt,
          updatedAt: img.updatedAt,
          videoUrl: img.videoUrl || '',
          videoPublicId: img.videoPublicId,
          workAreaId: img.workAreaId || '',
        }));
        dispatch(setImages(mapped));
      } catch (err) {
        console.error('Failed to load images from API', err);
      }
    };

    if (isAuthenticated) {
      fetchImages();
    }
  }, [isAuthenticated, dispatch]);

  // Reset section to hero when switching to about or contact page
  useEffect(() => {
    if (selectedPage === 'about' || selectedPage === 'contact' || selectedPage === 'settings') {
      setSelectedSection('hero');
    }
  }, [selectedPage]);

  // تحميل محتوى الصفحات من الـ API
  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/page-content`);
        if (!res.ok) return;
        const data = await res.json();
        dispatch(setAllPageContents(data));
      } catch (err) {
        console.error('Failed to load page content', err);
      }
    };
    if (isAuthenticated) fetchPageContent();
  }, [isAuthenticated, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    files.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        invalidFiles.push(`${file.name} - ليس ملف صورة`);
        return;
      }

      validFiles.push(file);
    });

    const vFiles = Array.from(e.target.files || []).filter(f => f.type.startsWith('video/'));
    if (vFiles.length > 0) {
      setVideoFile(vFiles[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, videoUrl: reader.result as string }));
      };
      reader.readAsDataURL(vFiles[0]);
    }

    if (invalidFiles.length > 0) {
      dispatch(addNotification({ message: 'بعض الملفات غير صالحة: ' + invalidFiles.join('، '), type: 'warning' }));
    }

    if (validFiles.length > 0) {
      if (multipleMode) {
        // Multiple files mode
        setSelectedFiles([...selectedFiles, ...validFiles]);

        // Create preview URLs for all files
        const newPreviews: Array<{ url: string; alt: string; file?: File }> = [];
        let loadedCount = 0;

        validFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            newPreviews.push({
              url: result,
              alt: file.name.replace(/\.[^/.]+$/, ''),
              file: file,
            });
            loadedCount++;

            if (loadedCount === validFiles.length) {
              setPreviewUrls([...previewUrls, ...newPreviews]);
            }
          };
          reader.readAsDataURL(file);
        });
      } else {
        // Single file mode
        const file = validFiles[0];
        setSelectedFiles([file]);

        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setPreviewUrls([{ url: result, alt: formData.alt || file.name.replace(/\.[^/.]+$/, ''), file: file }]);
          setFormData({ ...formData, url: result });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAddImage = async () => {
    if (multipleMode && previewUrls.length > 0) {
      // Add multiple images عبر الـ API + تحديث Redux
      for (const preview of previewUrls) {
        if (preview.url && preview.alt) {
          try {
            const res = await fetch(`${API_BASE_URL}/images`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                file: preview.url,
                alt: preview.alt,
                page: selectedPage,
                section: selectedSection,
                videoUrl: preview.alt.toLowerCase().includes('video') ? preview.url : undefined, // fallback logic if needed
              }),
            });
            if (!res.ok) {
              console.error('Failed to upload image', await res.text());
              continue;
            }
            const created = await res.json();
            dispatch(
              addImage({
                id: created._id,
                url: created.url,
                alt: created.alt || '',
                page: created.page,
                section: created.section,
                crop: created.crop,
                order: created.order,
                isActive: created.isActive,
                createdAt: created.createdAt,
                updatedAt: created.updatedAt,
                videoUrl: created.videoUrl || '',
              })
            );
          } catch (err) {
            console.error('Failed to upload image', err);
            dispatch(addNotification({ message: 'فشل رفع إحدى الصور. تأكدي أن الباك إند شغال و Cloudinary مضبوط.', type: 'error' }));
          }
        }
      }
      setFormData({ url: '', alt: '', page: 'home', section: 'hero', videoUrl: '' });
      setSelectedFiles([]);
      setPreviewUrls([]);
      setMultipleMode(false);
      setShowAddModal(false);
      window.dispatchEvent(new Event('customStorage'));
    } else if (!multipleMode && (formData.url || previewUrls.length > 0)) {
      // Single image mode عبر الـ API
      const imageUrl = previewUrls[0]?.url || formData.url;
      const imageAlt = formData.alt || previewUrls[0]?.alt || 'صورة';

      if (imageUrl && imageAlt) {
        try {
          const res = await fetch(`${API_BASE_URL}/images`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              file: imageUrl,
              alt: imageAlt,
              page: selectedPage,
              section: selectedSection,
              videoUrl: formData.videoUrl,
            }),
          });
          if (!res.ok) {
            const errText = await res.text();
            console.error('Failed to upload image', errText);
            dispatch(addNotification({ message: 'فشل رفع الصورة. تأكدي أن الباك إند شغال و Cloudinary مضبوط.', type: 'error' }));
          } else {
            const created = await res.json();
            dispatch(
              addImage({
                id: created._id,
                url: created.url,
                alt: created.alt || '',
                page: created.page,
                section: created.section,
                crop: created.crop,
                order: created.order,
                isActive: created.isActive,
                createdAt: created.createdAt,
                updatedAt: created.updatedAt,
                videoUrl: created.videoUrl || '',
              })
            );
            window.dispatchEvent(new Event('customStorage'));
          }
        } catch (err) {
          console.error('Failed to upload image', err);
          dispatch(addNotification({ message: 'فشل رفع الصورة. تأكدي أن الباك إند شغال على المنفذ 5000.', type: 'error' }));
        }
        setFormData({ url: '', alt: '', page: 'home', section: 'hero', videoUrl: '' });
        setVideoFile(null);
        setSelectedFiles([]);
        setPreviewUrls([]);
        setShowAddModal(false);
      } else {
        dispatch(addNotification({ message: 'الرجاء إدخال النص البديل واختيار صورة', type: 'warning' }));
      }
    } else {
      dispatch(addNotification({ message: 'الرجاء اختيار صورة واحدة على الأقل', type: 'warning' }));
    }
  };

  const handleUpdateImage = async (id: string) => {
    const image = images.find((img) => img.id === id);
    if (image) {
      const imageUrl = previewUrls[0]?.url || formData.url || image.url;

      // Determine video data to send for update
      let videoDataToSend = formData.videoUrl;
      if (videoFile) {
        const reader = new FileReader();
        reader.readAsDataURL(videoFile);
        await new Promise<void>((resolve) => {
          reader.onloadend = () => {
            videoDataToSend = reader.result as string;
            resolve();
          };
        });
      } else if (formData.videoUrl === '') {
        // If videoUrl is explicitly cleared in form, send empty string to remove it
        videoDataToSend = '';
      } else if (!formData.videoUrl && image.videoUrl) {
        // If form videoUrl is empty but image already has one, keep existing
        videoDataToSend = image.videoUrl;
      }


      try {
        const res = await fetch(`${API_BASE_URL}/images/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            file: imageUrl !== image.url ? imageUrl : undefined,
            alt: formData.alt || image.alt,
            page: formData.page || image.page,
            section: formData.section || image.section,
            crop: image.crop,
            videoUrl: videoDataToSend,
          }),
        });
        if (!res.ok) {
          console.error('Failed to update image', await res.text());
        } else {
          const updated = await res.json();
          dispatch(
            updateImage({
              id: updated._id,
              url: updated.url,
              alt: updated.alt || '',
              page: updated.page,
              section: updated.section,
              crop: updated.crop,
              order: updated.order,
              isActive: updated.isActive,
              createdAt: updated.createdAt,
              updatedAt: updated.updatedAt,
              videoUrl: updated.videoUrl || '',
              videoPublicId: updated.videoPublicId,
            })
          );
        }
      } catch (err) {
        console.error('Failed to update image', err);
      }
      setEditingImage(null);
      setFormData({ url: '', alt: '', page: 'home', section: 'hero', videoUrl: '' });
      setVideoFile(null);
      setSelectedFiles([]);
      setPreviewUrls([]);
      setMultipleMode(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
      try {
        await fetch(`${API_BASE_URL}/images/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        dispatch(deleteImage(id));
      } catch (err) {
        console.error('Failed to delete image', err);
      }
    }
  };

  const filteredImages = images.filter(
    (img) => img.page === selectedPage && img.section === selectedSection
  );

  const contentPages: PageType[] = ['landscaping', 'fencing', 'infrastructure'];
  const showContentEditor = selectedSection === 'content' && contentPages.includes(selectedPage);

  const pageNames = {
    home: 'الصفحة الرئيسية',
    landscaping: 'اللاندسكيب',
    fencing: 'السياجات الحديدية',
    infrastructure: 'البنية التحتية',
    about: 'عن الشركة',
    contact: 'تواصل معنا',
    files: 'بروفايل الشركة',
    settings: 'إعدادات التواصل و QR',
  };

  const sectionNames = {
    hero: 'الصورة الرئيسية',
    services: 'خدمات',
    gallery: 'معرض الصور',
    projects: 'المشاريع',
    header: 'الهيدر',
    content: 'محتوى الصفحة',
  };

  const currentContent = contentPages.includes(selectedPage)
    ? (pageContent[selectedPage as keyof typeof pageContent] || null)
    : null;

  const handleSavePageContent = async (data: Partial<PageContentData>) => {
    if (!contentPages.includes(selectedPage)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/page-content/${selectedPage}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        dispatch(setPageContent({ ...updated, page: selectedPage as PageContentData['page'] }));
        dispatch(addNotification({ message: 'تم حفظ المحتوى في قاعدة البيانات بنجاح', type: 'success' }));
      } else {
        const errText = await res.text();
        console.error('Failed to save page content', errText);
        dispatch(addNotification({ message: 'فشل حفظ المحتوى — تأكدي أن الباك إند شغال', type: 'error' }));
      }
    } catch (err) {
      console.error('Failed to save page content', err);
      dispatch(addNotification({ message: 'فشل حفظ المحتوى — تحققي من الاتصال بالسيرفر', type: 'error' }));
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-b from-metal via-metal-dark to-metal text-white transition-all duration-500 ease-in-out ${sidebarOpen ? 'w-64' : 'w-20'
          } fixed right-0 top-0 h-screen z-40 shadow-2xl overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-center p-4 border-b border-metal-silver/20 h-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-3 text-white hover:text-cta-light transition-all duration-300 group w-full justify-center"
            title={!sidebarOpen ? 'شركة تام العربية' : 'إغلاق القائمة'}
          >
            <div className="bg-white/10 p-2.5 rounded-none group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110 flex-shrink-0">
              <Building2 className="h-6 w-6" />
            </div>
            <div className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 overflow-hidden'}`}>
              <h1 className="text-lg font-bold whitespace-nowrap">شركة تام العربية</h1>
              <p className="text-xs text-metal-silver whitespace-nowrap">TAM Alarabiya Co.</p>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-180px)] hide-scrollbar">
          {/* Page Selection */}
          <div className="mb-4">
            <h3 className={`text-xs font-semibold text-metal-silver uppercase mb-2 px-2 transition-all duration-300 ${sidebarOpen ? 'opacity-100 max-h-6' : 'opacity-0 max-h-0 overflow-hidden'
              }`}>
              الصفحات
            </h3>
            <div className="space-y-1">
              {([
                { page: 'home' as PageType, icon: Home, label: 'الصفحة الرئيسية' },
                { page: 'about' as PageType, icon: Info, label: 'عن الشركة' },
                { page: 'contact' as PageType, icon: Phone, label: 'تواصل معنا' },
                { page: 'landscaping' as PageType, icon: Sprout, label: 'اللاندسكيب' },
                { page: 'fencing' as PageType, icon: Fence, label: 'السياجات' },
                { page: 'infrastructure' as PageType, icon: Building2, label: 'البنية التحتية' },
                { page: 'files' as PageType, icon: FileUp, label: 'بروفايل الشركة' },
                { page: 'settings' as PageType, icon: QrCode, label: 'التواصل و QR' },
              ]).map((item, _index) => (
                <button
                  key={item.page}
                  onClick={() => setSelectedPage(item.page)}
                  className={`w-full flex items-center ${sidebarOpen ? 'justify-start gap-3 px-3' : 'justify-center px-2'} py-2.5 rounded-none transition-all duration-300 ${selectedPage === item.page
                    ? 'bg-white/20 text-white shadow-md'
                    : 'text-metal-silver hover:bg-white/10 hover:text-white'
                    }`}
                  title={!sidebarOpen ? item.label : ''}
                >
                  <item.icon className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${selectedPage === item.page ? 'scale-110' : ''
                    }`} />
                  <span className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 overflow-hidden'
                    }`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section Selection */}
          {selectedPage !== 'settings' && (
          <div className="mb-4">
            <h3 className={`text-xs font-semibold text-metal-silver uppercase mb-2 px-2 transition-all duration-300 ${sidebarOpen ? 'opacity-100 max-h-6' : 'opacity-0 max-h-0 overflow-hidden'
              }`}>
              الأقسام
            </h3>
            <div className="space-y-1">
              {([
                { section: 'hero' as SectionType, label: 'الصورة الرئيسية' },
                ...(selectedPage === 'home' ? [{ section: 'services' as SectionType, label: 'الخدمات' }] : []),
                ...(selectedPage === 'home' ? [{ section: 'header' as SectionType, label: 'الهيدر' }] : []),
                ...(selectedPage !== 'about' && selectedPage !== 'contact' && selectedPage !== 'files' ? [
                  { section: 'gallery' as SectionType, label: 'معرض الصور' },
                  { section: 'projects' as SectionType, label: 'المشاريع' },
                  { section: 'content' as SectionType, label: 'محتوى الصفحة' },
                ] : []),
              ]).map((item, _index) => (
                <button
                  key={item.section}
                  onClick={() => setSelectedSection(item.section)}
                  className={`w-full flex items-center ${sidebarOpen ? 'justify-start gap-3 px-3' : 'justify-center px-2'} py-2.5 rounded-none transition-all duration-300 ${selectedSection === item.section
                    ? 'bg-white/20 text-white shadow-md'
                    : 'text-metal-silver hover:bg-white/10 hover:text-white'
                    }`}
                  title={!sidebarOpen ? item.label : ''}
                >
                  <ImageIcon className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${selectedSection === item.section ? 'scale-110' : ''
                    }`} />
                  <span className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 overflow-hidden'
                    }`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 right-0 left-0 p-3 border-t border-metal-silver/20 bg-metal-dark space-y-1.5">
          <Link
            to="/"
            className={`w-full flex items-center ${sidebarOpen ? 'justify-start gap-3 px-3' : 'justify-center px-2'} py-2.5 rounded-none text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 group`}
            title={!sidebarOpen ? 'العودة للموقع' : ''}
          >
            <Globe className="h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
            <span className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 overflow-hidden'
              }`}>
              العودة للموقع
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${sidebarOpen ? 'justify-start gap-3 px-3' : 'justify-center px-2'} py-2.5 rounded-none text-gray-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-300 group`}
            title={!sidebarOpen ? 'تسجيل الخروج' : ''}
          >
            <LogOut className="h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            <span className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 overflow-hidden'
              }`}>
              تسجيل الخروج
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-500 ease-in-out ${sidebarOpen ? 'mr-64' : 'mr-20'}`}>
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedPage === 'files'
                    ? 'بروفايل الشركة (PDF)'
                    : selectedPage === 'settings'
                      ? 'إعدادات التواصل و QR'
                      : `${pageNames[selectedPage]} - ${sectionNames[selectedSection]}`}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedPage === 'settings' ? 'إدارة أرقام التواصل ورمز QR' : 'إدارة الصور والمحتوى'}
                </p>
              </div>
              {!showContentEditor && selectedPage !== 'files' && selectedPage !== 'settings' && (
                <button
                  onClick={() => {
                    setFormData({ url: '', alt: '', page: selectedPage, section: selectedSection, videoUrl: '' });
                    setVideoFile(null);
                    setSelectedFiles([]);
                    setPreviewUrls([]);
                    setMultipleMode(false);
                    setShowAddModal(true);
                    setEditingImage(null);
                  }}
                  className="flex items-center gap-2 bg-cta text-white px-6 py-3 rounded-none font-black uppercase tracking-widest hover:bg-cta-hover transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-5 w-5" />
                  <span>إضافة صورة جديدة</span>
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="p-6">
          {selectedPage === 'settings' ? (
            <SiteSettingsEditor
              token={token}
              apiBase={API_BASE_URL}
              onSaved={(settings) => dispatch(setSiteSettings(settings))}
            />
          ) : selectedPage === 'files' ? (
            <PdfUploadSection token={token} apiBase={API_BASE_URL} />
          ) : showContentEditor && currentContent ? (
            <PageContentEditor
              data={currentContent}
              onSave={handleSavePageContent}
              token={token}
              images={images}
              apiBase={API_BASE_URL}
              onImageChange={(image, action) => {
                if (action === 'add') dispatch(addImage(image));
                else if (action === 'update') dispatch(updateImage(image));
                else dispatch(deleteImage(image.id));
              }}
            />
          ) : (
            /* Images List */
            <div className="bg-white rounded-none shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                الصور ({filteredImages.length})
              </h2>
              {filteredImages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد صور في هذا القسم</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredImages.map((image) => (
                    <div key={image.id} className="border border-gray-200 rounded-none overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48 bg-gray-100">
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                          }}
                        />
                        {image.videoUrl && (
                          <div className="absolute top-2 right-2 bg-cta text-white p-1.5 shadow-lg group-hover:scale-110 transition-transform">
                            <Globe className="h-4 w-4 animate-pulse" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-medium text-gray-900 mb-2 truncate">{image.alt}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingImage(image.id);
                              setFormData({
                                url: image.url,
                                alt: image.alt,
                                page: image.page,
                                section: image.section,
                                videoUrl: image.videoUrl || '',
                              });
                              setVideoFile(null);
                              setSelectedFiles([]);
                              setPreviewUrls(image.url.startsWith('data:') ? [{ url: image.url, alt: image.alt }] : []);
                              setMultipleMode(false);
                              setShowAddModal(true);
                            }}
                            className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-none hover:bg-blue-100 transition-colors text-sm"
                          >
                            <Edit className="h-4 w-4" />
                            تعديل
                          </button>
                          <button
                            onClick={() => {
                              setCroppingImage(image.id);
                              setCropSettings(image.crop || { x: 0, y: 0, width: 100, height: 100 });
                              setShowCropModal(true);
                            }}
                            className="flex-1 flex items-center justify-center gap-1 bg-landscape/10 text-landscape-dark px-3 py-2 rounded-none hover:bg-landscape/20 transition-colors text-sm"
                          >
                            <Crop className="h-4 w-4" />
                            قص
                          </button>
                          <button
                            onClick={() => handleDeleteImage(image.id)}
                            className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-700 px-3 py-2 rounded-none hover:bg-red-100 transition-colors text-sm"
                          >
                            <Trash2 className="h-4 w-4" />
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl max-w-sm w-full p-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingImage ? 'تعديل الصورة' : 'إضافة صورة جديدة'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingImage(null);
                  setFormData({ url: '', alt: '', page: 'home', section: 'hero', videoUrl: '' });
                  setVideoFile(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Mode Toggle */}
              {!editingImage && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-none">
                  <span className="text-sm font-medium text-gray-700">وضع الإضافة:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMultipleMode(false);
                        setSelectedFiles([]);
                        setPreviewUrls([]);
                      }}
                      className={`px-4 py-2 rounded-none text-sm font-medium transition-all ${!multipleMode
                        ? 'bg-cta text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                      صورة واحدة
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMultipleMode(true);
                        setSelectedFiles([]);
                        setPreviewUrls([]);
                      }}
                      className={`px-4 py-2 rounded-none text-sm font-medium transition-all ${multipleMode
                        ? 'bg-cta text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                      صور متعددة
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  {multipleMode ? 'اختر صور من الجهاز (يمكن اختيار أكثر من صورة)' : 'اختر صورة من الجهاز'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple={multipleMode}
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-cta focus:border-cta file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-semibold file:bg-cta/10 file:text-cta hover:file:bg-cta/20 cursor-pointer"
                  dir="rtl"
                />
                <p className="text-xs text-gray-500 mt-2 text-right">
                  الحد الأقصى لحجم الملف الواحد: 5MB | الصيغ المدعومة: JPG, PNG, GIF, WebP
                  {multipleMode && ' | يمكن اختيار عدة صور في نفس الوقت'}
                </p>
              </div>

              {!multipleMode && previewUrls.length === 0 && !editingImage && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    أو أدخل رابط الصورة (URL) - اختياري
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-cta focus:border-cta"
                    placeholder="https://example.com/image.jpg"
                    dir="ltr"
                  />
                </div>
              )}

              {!multipleMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    النص البديل (Alt Text)
                  </label>
                  <input
                    type="text"
                    value={formData.alt}
                    onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-cta focus:border-cta"
                    placeholder="وصف الصورة"
                    dir="rtl"
                  />
                </div>
              )}

              {!multipleMode && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                      رفع فيديو من الجهاز
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-cta focus:border-cta file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-semibold file:bg-cta/10 file:text-cta hover:file:bg-cta/20 cursor-pointer"
                      dir="rtl"
                    />
                    {videoFile && (
                      <p className="text-xs text-green-600 mt-1 text-right font-bold">
                        تم اختيار الفيديو: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                      أو رابط فيديو (YouTube/Vimeo)
                    </label>
                    <input
                      type="url"
                      value={formData.videoUrl && !formData.videoUrl.startsWith('data:video/') ? formData.videoUrl : ''}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-cta focus:border-cta"
                      placeholder="https://www.youtube.com/watch?v=..."
                      disabled={!!videoFile}
                      dir="ltr"
                    />
                  </div>
                </div>
              )}

              {/* Preview Section */}
              {previewUrls.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    معاينة الصور ({previewUrls.length})
                  </label>
                  <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
                    {previewUrls.map((preview, index) => (
                      <div key={index} className="border border-gray-200 rounded-none overflow-hidden">
                        <div className="relative">
                          <img
                            src={preview.url}
                            alt={preview.alt || `Preview ${index + 1}`}
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          {multipleMode && (
                            <button
                              type="button"
                              onClick={() => {
                                const newPreviews = previewUrls.filter((_, i) => i !== index);
                                const newFiles = selectedFiles.filter((_, i) => i !== index);
                                setPreviewUrls(newPreviews);
                                setSelectedFiles(newFiles);
                              }}
                              className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              title="حذف الصورة"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        {multipleMode && (
                          <div className="p-2">
                            <input
                              type="text"
                              value={preview.alt}
                              onChange={(e) => {
                                const newPreviews = [...previewUrls];
                                newPreviews[index].alt = e.target.value;
                                setPreviewUrls(newPreviews);
                              }}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cta"
                              placeholder="النص البديل"
                              dir="rtl"
                            />
                            {preview.file && (
                              <p className="text-xs text-gray-500 mt-1">
                                {preview.file.name} ({(preview.file.size / 1024).toFixed(2)} KB)
                              </p>
                            )}
                            {preview.alt.toLowerCase().includes('video') && (
                              <div className="absolute top-1 right-1 bg-cta text-white p-1 rounded-sm">
                                <Globe className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!multipleMode && formData.url && previewUrls.length === 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    معاينة الصورة
                  </label>
                  <div className="border border-gray-200 rounded-none overflow-hidden">
                    <img
                      src={formData.url}
                      alt={formData.alt || 'Preview'}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingImage(null);
                    setFormData({ url: '', alt: '', page: 'home', section: 'hero', videoUrl: '' });
                    setVideoFile(null);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-none hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    if (editingImage) {
                      handleUpdateImage(editingImage);
                    } else {
                      handleAddImage();
                    }
                  }}
                  disabled={!multipleMode && !previewUrls.length && !formData.url}
                  className="flex-1 px-4 py-3 bg-cta text-white rounded-none font-black uppercase tracking-widest hover:bg-cta-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingImage ? 'حفظ التعديلات' : multipleMode ? `إضافة ${previewUrls.length} صورة` : 'إضافة'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Crop Modal */}
      {showCropModal && croppingImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">قص الصورة</h3>
              <button
                onClick={() => {
                  setShowCropModal(false);
                  setCroppingImage(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {(() => {
              const image = images.find((img) => img.id === croppingImage);
              if (!image) return null;

              const handleMouseDown = (e: React.MouseEvent, type: typeof dragType) => {
                e.preventDefault();
                setIsDragging(true);
                setDragType(type);
                if (cropContainerRef) {
                  const rect = cropContainerRef.getBoundingClientRect();
                  setDragStart({
                    x: ((e.clientX - rect.left) / rect.width) * 100,
                    y: ((e.clientY - rect.top) / rect.height) * 100,
                  });
                }
              };

              const handleMouseMove = (e: React.MouseEvent) => {
                if (!isDragging || !dragType || !cropContainerRef) return;

                const rect = cropContainerRef.getBoundingClientRect();
                const currentX = ((e.clientX - rect.left) / rect.width) * 100;
                const currentY = ((e.clientY - rect.top) / rect.height) * 100;
                const deltaX = currentX - dragStart.x;
                const deltaY = currentY - dragStart.y;

                setCropSettings(prev => {
                  const newSettings = { ...prev };

                  if (dragType === 'move') {
                    newSettings.x = Math.max(0, Math.min(100 - prev.width, prev.x + deltaX));
                    newSettings.y = Math.max(0, Math.min(100 - prev.height, prev.y + deltaY));
                  } else if (dragType === 'resize-top') {
                    const newY = Math.max(0, Math.min(prev.y + prev.height - 10, prev.y + deltaY));
                    const newHeight = prev.height - (newY - prev.y);
                    newSettings.y = newY;
                    newSettings.height = Math.max(10, newHeight);
                  } else if (dragType === 'resize-bottom') {
                    newSettings.height = Math.max(10, Math.min(100 - prev.y, prev.height + deltaY));
                  } else if (dragType === 'resize-left') {
                    const newX = Math.max(0, Math.min(prev.x + prev.width - 10, prev.x + deltaX));
                    const newWidth = prev.width - (newX - prev.x);
                    newSettings.x = newX;
                    newSettings.width = Math.max(10, newWidth);
                  } else if (dragType === 'resize-right') {
                    newSettings.width = Math.max(10, Math.min(100 - prev.x, prev.width + deltaX));
                  } else if (dragType === 'resize-tl') {
                    const newX = Math.max(0, Math.min(prev.x + prev.width - 10, prev.x + deltaX));
                    const newY = Math.max(0, Math.min(prev.y + prev.height - 10, prev.y + deltaY));
                    const newWidth = prev.width - (newX - prev.x);
                    const newHeight = prev.height - (newY - prev.y);
                    newSettings.x = newX;
                    newSettings.y = newY;
                    newSettings.width = Math.max(10, newWidth);
                    newSettings.height = Math.max(10, newHeight);
                  } else if (dragType === 'resize-tr') {
                    const newY = Math.max(0, Math.min(prev.y + prev.height - 10, prev.y + deltaY));
                    const newHeight = prev.height - (newY - prev.y);
                    newSettings.y = newY;
                    newSettings.height = Math.max(10, newHeight);
                    newSettings.width = Math.max(10, Math.min(100 - prev.x, prev.width + deltaX));
                  } else if (dragType === 'resize-bl') {
                    const newX = Math.max(0, Math.min(prev.x + prev.width - 10, prev.x + deltaX));
                    const newWidth = prev.width - (newX - prev.x);
                    newSettings.x = newX;
                    newSettings.width = Math.max(10, newWidth);
                    newSettings.height = Math.max(10, Math.min(100 - prev.y, prev.height + deltaY));
                  } else if (dragType === 'resize-br') {
                    newSettings.width = Math.max(10, Math.min(100 - prev.x, prev.width + deltaX));
                    newSettings.height = Math.max(10, Math.min(100 - prev.y, prev.height + deltaY));
                  }

                  return newSettings;
                });

                setDragStart({ x: currentX, y: currentY });
              };

              const handleMouseUp = () => {
                setIsDragging(false);
                setDragType(null);
              };

              return (
                <div className="space-y-6">
                  {/* Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-none p-4">
                    <p className="text-sm text-blue-800 text-right">
                      💡 اسحب الصورة لتحريك منطقة القص، أو اسحب الحواف والزوايا لتغيير الحجم
                    </p>
                  </div>

                  {/* Interactive Image Preview with Crop Overlay */}
                  <div
                    ref={setCropContainerRef}
                    className="relative bg-gray-100 rounded-none overflow-hidden cursor-move"
                    style={{ aspectRatio: '16/9', maxHeight: '500px' }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <img
                      ref={setCropImageRef}
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-contain pointer-events-none"
                      style={{
                        clipPath: `inset(${cropSettings.y}% ${100 - cropSettings.x - cropSettings.width}% ${100 - cropSettings.y - cropSettings.height}% ${cropSettings.x}%)`,
                      }}
                    />

                    {/* Crop Area - Draggable */}
                    <div
                      className={`absolute border-2 border-cta bg-cta/20 ${isDragging && dragType === 'move' ? 'cursor-grabbing' : 'cursor-move'}`}
                      style={{
                        left: `${cropSettings.x}%`,
                        top: `${cropSettings.y}%`,
                        width: `${cropSettings.width}%`,
                        height: `${cropSettings.height}%`,
                      }}
                      onMouseDown={(e) => handleMouseDown(e, 'move')}
                    >
                      {/* Resize Handles */}
                      {/* Top Left (physical top-left = small x, small y) */}
                      <div
                        className="absolute -top-2 -left-2 w-4 h-4 bg-cta border-2 border-white rounded-full cursor-nwse-resize hover:bg-cta-hover z-10"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleMouseDown(e, 'resize-tl');
                        }}
                      />
                      {/* Top Right (physical top-right = large x, small y) */}
                      <div
                        className="absolute -top-2 -right-2 w-4 h-4 bg-cta border-2 border-white rounded-full cursor-nesw-resize hover:bg-cta-hover z-10"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleMouseDown(e, 'resize-tr');
                        }}
                      />
                      {/* Bottom Left (physical bottom-left = small x, large y) */}
                      <div
                        className="absolute -bottom-2 -left-2 w-4 h-4 bg-cta border-2 border-white rounded-full cursor-nesw-resize hover:bg-cta-hover z-10"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleMouseDown(e, 'resize-bl');
                        }}
                      />
                      {/* Bottom Right (physical bottom-right = large x, large y) */}
                      <div
                        className="absolute -bottom-2 -right-2 w-4 h-4 bg-cta border-2 border-white rounded-full cursor-nwse-resize hover:bg-cta-hover z-10"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleMouseDown(e, 'resize-br');
                        }}
                      />
                      {/* Top edge */}
                      <div
                        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-cta border border-white rounded cursor-ns-resize hover:bg-cta-hover z-10"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleMouseDown(e, 'resize-top');
                        }}
                      />
                      {/* Bottom edge */}
                      <div
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-cta border border-white rounded cursor-ns-resize hover:bg-cta-hover z-10"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleMouseDown(e, 'resize-bottom');
                        }}
                      />
                      {/* Left edge (physical left = small x) */}
                      <div
                        className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-3 h-10 bg-cta border border-white rounded cursor-ew-resize hover:bg-cta-hover z-10"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleMouseDown(e, 'resize-left');
                        }}
                      />
                      {/* Right edge (physical right = large x) */}
                      <div
                        className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-3 h-10 bg-cta border border-white rounded cursor-ew-resize hover:bg-cta-hover z-10"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleMouseDown(e, 'resize-right');
                        }}
                      />
                    </div>
                  </div>


                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setCropSettings({ x: 0, y: 0, width: 100, height: 100 });
                      }}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-none hover:bg-gray-200 transition-colors"
                    >
                      إعادة تعيين
                    </button>
                    <button
                      onClick={async () => {
                        const image = images.find((img) => img.id === croppingImage);
                        if (image) {
                          try {
                            await fetch(`${API_BASE_URL}/images/${image.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                alt: image.alt,
                                page: image.page,
                                section: image.section,
                                crop: cropSettings,
                              }),
                            });
                            dispatch(updateImage({ ...image, crop: cropSettings }));
                          } catch (err) {
                            console.error('Failed to save crop', err);
                          }
                        }
                        setShowCropModal(false);
                        setCroppingImage(null);
                      }}
                      className="flex-1 px-4 py-2 bg-cta text-white rounded-none hover:bg-cta-hover transition-colors"
                    >
                      حفظ القص
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
