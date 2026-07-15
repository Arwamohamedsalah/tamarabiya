import { useState } from 'react';
import { ImageIcon, Plus, Trash2, Upload, Replace } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { addNotification } from '../../store/slices/uiSlice';
import type { ImageItem } from '../../store/slices/imagesSlice';
import type { WorkAreaBlock, WorkAreaSection } from '../../types/workAreaSection';
import { mapApiImageToItem } from '../../utils/imageUtils';

interface WorkAreaContentEditorProps {
  page: 'landscaping' | 'fencing' | 'infrastructure';
  sections: WorkAreaSection[];
  onChange: (sections: WorkAreaSection[]) => void;
  images: ImageItem[];
  token: string | null;
  apiBase: string;
  onImageChange: (image: ImageItem, action: 'add' | 'update' | 'delete') => void;
}

function emptyBlock(type: WorkAreaBlock['type']): WorkAreaBlock {
  if (type === 'paragraph' || type === 'heading') {
    return { type, text: '', textEn: '' };
  }
  if (type === 'highlight') {
    return { type, title: '', titleEn: '', body: '', bodyEn: '' };
  }
  if (type === 'table') {
    return {
      type: 'table',
      title: '',
      titleEn: '',
      headerCol1: 'الفئة',
      headerCol1En: 'Class',
      headerCol2: 'مستوى الحماية',
      headerCol2En: 'Protection Level',
      rows: [{ col1: '', col1En: '', col2: '', col2En: '' }],
    };
  }
  return { type: 'list', intro: '', introEn: '', items: [''], itemsEn: [''] };
}

function WorkAreaImageSlot({
  page,
  workAreaId,
  slot,
  images,
  token,
  apiBase,
  onImageChange,
}: {
  page: WorkAreaContentEditorProps['page'];
  workAreaId: string;
  slot: number;
  images: ImageItem[];
  token: string | null;
  apiBase: string;
  onImageChange: WorkAreaContentEditorProps['onImageChange'];
}) {
  const dispatch = useAppDispatch();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const existing = images
    .filter((img) => img.page === page && img.section === 'work-area' && img.workAreaId === workAreaId)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[slot];

  const readFile = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleUpload = async (file: File) => {
    if (!token) {
      dispatch(addNotification({ message: 'يجب تسجيل الدخول أولاً لرفع الصور', type: 'warning' }));
      return;
    }
    if (!file.type.startsWith('image/')) {
      dispatch(addNotification({ message: 'الملف يجب أن يكون صورة', type: 'warning' }));
      return;
    }

    setUploading(true);
    try {
      const base64 = await readFile(file);
      const payload = {
        file: base64,
        alt: `${workAreaId} ${slot + 1}`,
        page,
        section: 'work-area',
        workAreaId,
        order: slot,
      };

      const url = existing ? `${apiBase}/images/${existing.id}` : `${apiBase}/images`;
      const method = existing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Upload failed');
      }

      const saved = await res.json();
      const mapped = mapApiImageToItem({ ...saved, workAreaId: saved.workAreaId || workAreaId, order: saved.order ?? slot });
      onImageChange(mapped, existing ? 'update' : 'add');
      window.dispatchEvent(new Event('customStorage'));
      dispatch(
        addNotification({
          message: existing ? 'تم استبدال الصورة بنجاح' : 'تم رفع الصورة بنجاح',
          type: 'success',
        })
      );
    } catch (err) {
      console.error('Work area image upload failed', err);
      dispatch(
        addNotification({
          message: 'فشل رفع الصورة. تأكدي أن الباك إند و Cloudinary شغالين.',
          type: 'error',
        })
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!existing || !token) return;
    if (!confirm('هل أنتِ متأكدة من حذف هذه الصورة؟')) return;

    setDeleting(true);
    try {
      const res = await fetch(`${apiBase}/images/${existing.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok && res.status !== 204) {
        throw new Error(await res.text());
      }
      onImageChange(existing, 'delete');
      window.dispatchEvent(new Event('customStorage'));
      dispatch(addNotification({ message: 'تم حذف الصورة', type: 'success' }));
    } catch (err) {
      console.error('Work area image delete failed', err);
      dispatch(addNotification({ message: 'فشل حذف الصورة', type: 'error' }));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="border border-gray-200 p-3 space-y-2 bg-white">
      <p className="text-xs text-gray-500 text-right">صورة {slot + 1}</p>
      {existing ? (
        <div className="space-y-2">
          <div className="relative group overflow-hidden bg-gray-100">
            <img src={existing.url} alt={existing.alt || `صورة ${slot + 1}`} className="w-full h-40 object-cover" />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-sm">جاري الرفع...</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="cursor-pointer flex items-center justify-center gap-1.5 py-2 bg-gray-100 hover:bg-gray-200 text-sm text-gray-800 transition-colors">
              <Replace className="h-4 w-4" />
              {uploading ? 'جاري...' : 'تعديل'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading || deleting}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                  e.target.value = '';
                }}
              />
            </label>
            <button
              type="button"
              onClick={handleDelete}
              disabled={uploading || deleting}
              className="flex items-center justify-center gap-1.5 py-2 text-red-600 hover:bg-red-50 text-sm transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {deleting ? 'جاري...' : 'حذف'}
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 cursor-pointer hover:border-cta hover:bg-cta/5 transition-colors">
          {uploading ? (
            <span className="text-sm text-gray-500">جاري الرفع...</span>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">رفع صورة</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
              e.target.value = '';
            }}
          />
        </label>
      )}
    </div>
  );
}

function BlockEditor({
  block,
  onChange,
  onRemove,
}: {
  block: WorkAreaBlock;
  onChange: (block: WorkAreaBlock) => void;
  onRemove: () => void;
}) {
  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-none text-sm';

  const updateListItem = (lang: 'items' | 'itemsEn', index: number, value: string) => {
    if (block.type !== 'list') return;
    const arr = [...block[lang]];
    arr[index] = value;
    onChange({ ...block, [lang]: arr });
  };

  const addListItem = () => {
    if (block.type !== 'list') return;
    onChange({ ...block, items: [...block.items, ''], itemsEn: [...block.itemsEn, ''] });
  };

  const removeListItem = (index: number) => {
    if (block.type !== 'list') return;
    onChange({
      ...block,
      items: block.items.filter((_, i) => i !== index),
      itemsEn: block.itemsEn.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 space-y-3">
      <div className="flex justify-between items-center">
        <select
          value={block.type}
          onChange={(e) => onChange(emptyBlock(e.target.value as WorkAreaBlock['type']))}
          className="px-2 py-1 border rounded-none text-sm"
        >
          <option value="paragraph">فقرة</option>
          <option value="heading">عنوان فرعي</option>
          <option value="highlight">نقطة مميزة</option>
          <option value="list">قائمة</option>
          <option value="table">جدول</option>
        </select>
        <button type="button" onClick={onRemove} className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1">
          <Trash2 className="h-4 w-4" />
          حذف
        </button>
      </div>

      {(block.type === 'paragraph' || block.type === 'heading') && (
        <>
          <textarea
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="النص بالعربي"
            rows={block.type === 'paragraph' ? 3 : 1}
            className={inputClass}
            dir="rtl"
          />
          <textarea
            value={block.textEn}
            onChange={(e) => onChange({ ...block, textEn: e.target.value })}
            placeholder="English text"
            rows={block.type === 'paragraph' ? 3 : 1}
            className={inputClass}
            dir="ltr"
          />
        </>
      )}

      {block.type === 'highlight' && (
        <>
          <input value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} placeholder="العنوان بالعربي" className={inputClass} dir="rtl" />
          <input value={block.titleEn} onChange={(e) => onChange({ ...block, titleEn: e.target.value })} placeholder="Title in English" className={inputClass} dir="ltr" />
          <textarea value={block.body} onChange={(e) => onChange({ ...block, body: e.target.value })} placeholder="النص بالعربي" rows={3} className={inputClass} dir="rtl" />
          <textarea value={block.bodyEn} onChange={(e) => onChange({ ...block, bodyEn: e.target.value })} placeholder="Body in English" rows={3} className={inputClass} dir="ltr" />
        </>
      )}

      {block.type === 'list' && (
        <>
          <input value={block.intro || ''} onChange={(e) => onChange({ ...block, intro: e.target.value })} placeholder="مقدمة القائمة بالعربي" className={inputClass} dir="rtl" />
          <input value={block.introEn || ''} onChange={(e) => onChange({ ...block, introEn: e.target.value })} placeholder="List intro in English" className={inputClass} dir="ltr" />
          <div className="space-y-2">
            {block.items.map((item, idx) => (
              <div key={idx} className="grid md:grid-cols-2 gap-2">
                <input value={item} onChange={(e) => updateListItem('items', idx, e.target.value)} placeholder={`عنصر ${idx + 1}`} className={inputClass} dir="rtl" />
                <div className="flex gap-2">
                  <input value={block.itemsEn[idx] || ''} onChange={(e) => updateListItem('itemsEn', idx, e.target.value)} placeholder={`Item ${idx + 1}`} className={`${inputClass} flex-1`} dir="ltr" />
                  <button type="button" onClick={() => removeListItem(idx)} className="text-red-500 px-2">×</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addListItem} className="text-sm text-cta hover:underline">+ إضافة عنصر</button>
          </div>
        </>
      )}

      {block.type === 'table' && (
        <>
          <input value={block.title || ''} onChange={(e) => onChange({ ...block, title: e.target.value })} placeholder="عنوان الجدول (اختياري)" className={inputClass} dir="rtl" />
          <div className="grid md:grid-cols-2 gap-2">
            <input value={block.headerCol1} onChange={(e) => onChange({ ...block, headerCol1: e.target.value })} placeholder="عنوان العمود 1" className={inputClass} dir="rtl" />
            <input value={block.headerCol1En} onChange={(e) => onChange({ ...block, headerCol1En: e.target.value })} placeholder="Column 1 header" className={inputClass} dir="ltr" />
            <input value={block.headerCol2} onChange={(e) => onChange({ ...block, headerCol2: e.target.value })} placeholder="عنوان العمود 2" className={inputClass} dir="rtl" />
            <input value={block.headerCol2En} onChange={(e) => onChange({ ...block, headerCol2En: e.target.value })} placeholder="Column 2 header" className={inputClass} dir="ltr" />
          </div>
          <div className="space-y-2">
            {block.rows.map((row, idx) => (
              <div key={idx} className="grid md:grid-cols-2 gap-2 p-2 bg-white border">
                <input value={row.col1} onChange={(e) => {
                  const rows = [...block.rows];
                  rows[idx] = { ...row, col1: e.target.value };
                  onChange({ ...block, rows });
                }} placeholder={`صف ${idx + 1} — عمود 1`} className={inputClass} dir="rtl" />
                <input value={row.col1En} onChange={(e) => {
                  const rows = [...block.rows];
                  rows[idx] = { ...row, col1En: e.target.value };
                  onChange({ ...block, rows });
                }} placeholder={`Row ${idx + 1} — col 1 EN`} className={inputClass} dir="ltr" />
                <input value={row.col2} onChange={(e) => {
                  const rows = [...block.rows];
                  rows[idx] = { ...row, col2: e.target.value };
                  onChange({ ...block, rows });
                }} placeholder={`صف ${idx + 1} — عمود 2`} className={inputClass} dir="rtl" />
                <div className="flex gap-2">
                  <input value={row.col2En} onChange={(e) => {
                    const rows = [...block.rows];
                    rows[idx] = { ...row, col2En: e.target.value };
                    onChange({ ...block, rows });
                  }} placeholder={`Row ${idx + 1} — col 2 EN`} className={`${inputClass} flex-1`} dir="ltr" />
                  <button type="button" onClick={() => onChange({ ...block, rows: block.rows.filter((_, i) => i !== idx) })} className="text-red-500 px-2">×</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => onChange({ ...block, rows: [...block.rows, { col1: '', col1En: '', col2: '', col2En: '' }] })} className="text-sm text-cta hover:underline">+ إضافة صف</button>
          </div>
        </>
      )}
    </div>
  );
}

export default function WorkAreaContentEditor({
  page,
  sections,
  onChange,
  images,
  token,
  apiBase,
  onImageChange,
}: WorkAreaContentEditorProps) {
  if (!sections.length) return null;

  const updateSection = (index: number, patch: Partial<WorkAreaSection>) => {
    const next = sections.map((s, i) => (i === index ? { ...s, ...patch } : s));
    onChange(next);
  };

  const updateBlock = (sectionIndex: number, blockIndex: number, block: WorkAreaBlock) => {
    const section = sections[sectionIndex];
    const blocks = section.blocks.map((b, i) => (i === blockIndex ? block : b));
    updateSection(sectionIndex, { blocks });
  };

  const addBlock = (sectionIndex: number) => {
    const section = sections[sectionIndex];
    updateSection(sectionIndex, { blocks: [...section.blocks, emptyBlock('paragraph')] });
  };

  const removeBlock = (sectionIndex: number, blockIndex: number) => {
    const section = sections[sectionIndex];
    updateSection(sectionIndex, { blocks: section.blocks.filter((_, i) => i !== blockIndex) });
  };

  return (
    <div className="space-y-6 border-t border-gray-200 pt-8">
      <div className="flex items-center gap-2">
        <ImageIcon className="h-5 w-5 text-landscape-dark" />
        <h3 className="text-lg font-semibold text-gray-800">أقسام مجالات العمل (نص + صور)</h3>
      </div>
      <p className="text-sm text-gray-500 text-right">
        ارفعي الصور لكل قسم — تظهر بجانب النص في صفحة الخدمة. تقدرين تستبدلي أو تحذفي أي صورة بعد الرفع.
      </p>

      {sections.map((section, sectionIndex) => {
        const imageSlots = section.imageCount ?? 2;
        return (
        <div key={section.id} className="border border-gray-200 rounded-none overflow-hidden">
          <div className="bg-landscape/10 px-4 py-3 font-bold text-gray-900">{section.title}</div>
          <div className="p-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <input
                type="text"
                value={section.title}
                onChange={(e) => updateSection(sectionIndex, { title: e.target.value })}
                placeholder="عنوان القسم بالعربي"
                className="px-3 py-2 border rounded-none text-sm"
                dir="rtl"
              />
              <input
                type="text"
                value={section.titleEn}
                onChange={(e) => updateSection(sectionIndex, { titleEn: e.target.value })}
                placeholder="Section title in English"
                className="px-3 py-2 border rounded-none text-sm"
                dir="ltr"
              />
            </div>

            <div className="flex items-center gap-3 justify-end">
              <label className="text-sm text-gray-600">عدد الصور:</label>
              <select
                value={imageSlots}
                onChange={(e) => updateSection(sectionIndex, { imageCount: Number(e.target.value) })}
                className="px-2 py-1 border rounded-none text-sm"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className={`grid gap-3 ${imageSlots >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
              {Array.from({ length: imageSlots }).map((_, slot) => (
                <WorkAreaImageSlot
                  key={`${section.id}-img-${slot}`}
                  page={page}
                  workAreaId={section.id}
                  slot={slot}
                  images={images}
                  token={token}
                  apiBase={apiBase}
                  onImageChange={onImageChange}
                />
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 text-right">محتوى النص</p>
              {section.blocks.map((block, blockIndex) => (
                <BlockEditor
                  key={`${section.id}-block-${blockIndex}`}
                  block={block}
                  onChange={(b) => updateBlock(sectionIndex, blockIndex, b)}
                  onRemove={() => removeBlock(sectionIndex, blockIndex)}
                />
              ))}
              <button
                type="button"
                onClick={() => addBlock(sectionIndex)}
                className="flex items-center gap-1 text-sm text-cta hover:underline"
              >
                <Plus className="h-4 w-4" />
                إضافة فقرة / قائمة
              </button>
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
}
