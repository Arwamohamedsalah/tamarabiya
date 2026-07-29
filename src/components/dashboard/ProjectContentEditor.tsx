import { useEffect, useState } from 'react';
import { FolderKanban, Loader2, Plus, Save, Trash2, Upload } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { addNotification } from '../../store/slices/uiSlice';
import type { ImageItem } from '../../store/slices/imagesSlice';
import type { ProjectSection } from '../../types/projectSection';
import { createEmptyProject } from '../../types/projectSection';
import { getProjectImages, mapApiImageToItem } from '../../utils/imageUtils';

interface ProjectContentEditorProps {
  page: 'landscaping' | 'fencing' | 'infrastructure';
  projects: ProjectSection[];
  onChange: (projects: ProjectSection[]) => void;
  onSave: (projects: ProjectSection[]) => Promise<void>;
  images: ImageItem[];
  token: string | null;
  apiBase: string;
  onImageChange: (image: ImageItem, action: 'add' | 'update' | 'delete') => void;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ProjectImages({
  page,
  project,
  images,
  token,
  apiBase,
  onImageChange,
}: {
  page: ProjectContentEditorProps['page'];
  project: ProjectSection;
  images: ImageItem[];
  token: string | null;
  apiBase: string;
  onImageChange: ProjectContentEditorProps['onImageChange'];
}) {
  const dispatch = useAppDispatch();
  const [uploading, setUploading] = useState(false);
  const projectImages = getProjectImages(images, page, project.id);

  const handleUploadMany = async (files: FileList | File[]) => {
    if (!token) {
      dispatch(addNotification({ message: 'يجب تسجيل الدخول أولاً', type: 'warning' }));
      return;
    }

    const list = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (!list.length) {
      dispatch(addNotification({ message: 'اختر ملفات صور فقط', type: 'warning' }));
      return;
    }

    setUploading(true);
    let successCount = 0;
    const startOrder = projectImages.length;

    for (let i = 0; i < list.length; i++) {
      try {
        const base64 = await readFileAsDataUrl(list[i]);
        const res = await fetch(`${apiBase}/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            file: base64,
            alt: project.name || project.nameEn || `صورة ${startOrder + i + 1}`,
            page,
            section: 'projects',
            projectId: project.id,
            order: startOrder + i,
          }),
        });

        if (!res.ok) throw new Error(await res.text());
        const saved = await res.json();
        onImageChange(
          mapApiImageToItem({
            ...saved,
            projectId: saved.projectId || project.id,
            order: saved.order ?? startOrder + i,
          }),
          'add'
        );
        successCount++;
      } catch (err) {
        console.error('Project image upload failed', err);
      }
    }

    setUploading(false);
    if (successCount > 0) {
      window.dispatchEvent(new Event('customStorage'));
      dispatch(addNotification({ message: `تم رفع ${successCount} صورة`, type: 'success' }));
    } else {
      dispatch(addNotification({ message: 'فشل رفع الصور', type: 'error' }));
    }
  };

  const handleDeleteImage = async (image: ImageItem) => {
    if (!token || !confirm('حذف هذه الصورة من المشروع؟')) return;
    try {
      const res = await fetch(`${apiBase}/images/${image.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok && res.status !== 204) throw new Error(await res.text());
      onImageChange(image, 'delete');
      window.dispatchEvent(new Event('customStorage'));
      dispatch(addNotification({ message: 'تم حذف الصورة', type: 'success' }));
    } catch (err) {
      console.error('Delete project image failed', err);
      dispatch(addNotification({ message: 'فشل حذف الصورة', type: 'error' }));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-700">صور المشروع ({projectImages.length})</p>
        <label className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-sm cursor-pointer transition-colors">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? 'جاري الرفع...' : 'إضافة صور'}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const files = e.target.files;
              if (files?.length) void handleUploadMany(files);
              e.target.value = '';
            }}
          />
        </label>
      </div>

      {projectImages.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {projectImages.map((image) => (
            <div key={image.id} className="relative group border border-gray-200 bg-gray-50 overflow-hidden">
              <img src={image.url} alt={image.alt} className="w-full h-32 object-cover" />
              <button
                type="button"
                onClick={() => void handleDeleteImage(image)}
                className="absolute top-2 left-2 p-1.5 bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="حذف الصورة"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-300 cursor-pointer hover:border-cta hover:bg-cta/5 transition-colors">
          {uploading ? (
            <span className="text-sm text-gray-500">جاري الرفع...</span>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">ارفعي صور المشروع (واحدة أو أكثر)</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const files = e.target.files;
              if (files?.length) void handleUploadMany(files);
              e.target.value = '';
            }}
          />
        </label>
      )}
    </div>
  );
}

export default function ProjectContentEditor({
  page,
  projects,
  onChange,
  onSave,
  images,
  token,
  apiBase,
  onImageChange,
}: ProjectContentEditorProps) {
  const dispatch = useAppDispatch();
  const [localProjects, setLocalProjects] = useState<ProjectSection[]>(projects);
  const [saving, setSaving] = useState(false);
  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-none text-sm';

  useEffect(() => {
    setLocalProjects(projects);
  }, [projects]);

  const updateProject = (index: number, patch: Partial<ProjectSection>) => {
    setLocalProjects((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  };

  const addProject = () => {
    setLocalProjects((prev) => [...prev, createEmptyProject(prev.length)]);
  };

  const removeProject = async (index: number) => {
    const project = localProjects[index];
    if (!project) return;
    if (!confirm('حذف هذا المشروع وجميع صوره؟')) return;

    const projectImages = getProjectImages(images, page, project.id);
    if (token && projectImages.length > 0) {
      await Promise.all(
        projectImages.map(async (image) => {
          try {
            await fetch(`${apiBase}/images/${image.id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            });
            onImageChange(image, 'delete');
          } catch (err) {
            console.error('Failed to delete project image', err);
          }
        })
      );
      window.dispatchEvent(new Event('customStorage'));
    }

    setLocalProjects((prev) => prev.filter((_, i) => i !== index).map((p, i) => ({ ...p, order: i })));
    dispatch(addNotification({ message: 'تم حذف المشروع', type: 'success' }));
  };

  const handleSave = async () => {
    const normalized = localProjects.map((p, index) => ({ ...p, order: index }));
    setSaving(true);
    try {
      await onSave(normalized);
      onChange(normalized);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-none shadow-lg p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-6 w-6 text-landscape-dark" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">المشاريع — {page === 'landscaping' ? 'اللاندسكيب' : page === 'fencing' ? 'السياجات' : 'البنية التحتية'}</h2>
            <p className="text-sm text-gray-500">أضيفي اسم المشروع وتفاصيله وصوره — يظهر في صفحة القسم كما في العرض.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addProject}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            إضافة مشروع
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cta text-white hover:bg-cta-hover transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            حفظ المشاريع
          </button>
        </div>
      </div>

      {localProjects.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 text-gray-500">
          <p className="mb-4">لا توجد مشاريع بعد</p>
          <button type="button" onClick={addProject} className="px-4 py-2 bg-cta text-white hover:bg-cta-hover">
            إضافة أول مشروع
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {localProjects.map((project, index) => (
            <div key={project.id} className="border border-gray-200 overflow-hidden">
              <div className="bg-landscape/10 px-4 py-3 flex items-center justify-between">
                <span className="font-bold text-gray-900">
                  مشروع {index + 1}
                  {project.name ? ` — ${project.name}` : ''}
                </span>
                <button
                  type="button"
                  onClick={() => void removeProject(index)}
                  className="text-red-600 hover:text-red-700 text-sm inline-flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  حذف المشروع
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">اسم المشروع بالعربي</label>
                    <input
                      type="text"
                      value={project.name}
                      onChange={(e) => updateProject(index, { name: e.target.value })}
                      placeholder="مثال: زراعة جزر وسطية شمال جدة"
                      className={inputClass}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Project name in English</label>
                    <input
                      type="text"
                      value={project.nameEn}
                      onChange={(e) => updateProject(index, { nameEn: e.target.value })}
                      placeholder="Example: Road Landscape North Jeddah"
                      className={inputClass}
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">تفاصيل المشروع بالعربي</label>
                    <textarea
                      value={project.description}
                      onChange={(e) => updateProject(index, { description: e.target.value })}
                      placeholder="وصف مختصر أو تفاصيل المشروع..."
                      rows={4}
                      className={inputClass}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Project details in English</label>
                    <textarea
                      value={project.descriptionEn}
                      onChange={(e) => updateProject(index, { descriptionEn: e.target.value })}
                      placeholder="Short project description..."
                      rows={4}
                      className={inputClass}
                      dir="ltr"
                    />
                  </div>
                </div>

                <ProjectImages
                  page={page}
                  project={project}
                  images={images}
                  token={token}
                  apiBase={apiBase}
                  onImageChange={onImageChange}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
