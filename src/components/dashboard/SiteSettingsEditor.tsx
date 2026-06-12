import { useEffect, useState } from 'react';
import { QrCode, RefreshCw, Save } from 'lucide-react';
import type { QrDestination, SiteSettings, SiteSettingsFormData } from '../../types/siteSettings';

const QR_DESTINATIONS: { value: QrDestination; label: string }[] = [
  { value: 'whatsapp', label: 'واتساب' },
  { value: 'phone', label: 'اتصال هاتفي' },
  { value: 'website', label: 'الموقع الإلكتروني' },
  { value: 'custom', label: 'رابط مخصص' },
];

interface SiteSettingsEditorProps {
  token: string | null;
  apiBase: string;
  onSaved?: (settings: SiteSettings) => void;
}

export default function SiteSettingsEditor({ token, apiBase, onSaved }: SiteSettingsEditorProps) {
  const [form, setForm] = useState<SiteSettingsFormData>({
    whatsappNumber: '+966507826024',
    phoneNumber: '+966507826024',
    websiteUrl: 'https://www.tamalarabiya.com',
    customUrl: '',
    qrDestination: 'whatsapp',
  });
  const [preview, setPreview] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadSettings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiBase}/site-settings`);
      if (!res.ok) throw new Error('تعذر تحميل الإعدادات');
      const data = (await res.json()) as SiteSettings;
      setForm({
        whatsappNumber: data.whatsappNumber,
        phoneNumber: data.phoneNumber,
        websiteUrl: data.websiteUrl,
        customUrl: data.customUrl || '',
        qrDestination: data.qrDestination,
      });
      setPreview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تحميل الإعدادات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [apiBase]);

  const updateField = <K extends keyof SiteSettingsFormData>(key: K, value: SiteSettingsFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSuccess('');
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${apiBase}/site-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'فشل حفظ الإعدادات');
      }
      setPreview(data as SiteSettings);
      setSuccess('تم حفظ الإعدادات وتحديث رمز QR بنجاح');
      window.dispatchEvent(new Event('customStorage'));
      onSaved?.(data as SiteSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    if (!token) return;
    setRegenerating(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${apiBase}/site-settings/regenerate-qr`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'فشل إعادة توليد رمز QR');
      }
      setPreview(data as SiteSettings);
      setSuccess('تم إعادة توليد رمز QR بنجاح');
      window.dispatchEvent(new Event('customStorage'));
      onSaved?.(data as SiteSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل إعادة توليد رمز QR');
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-none shadow-lg p-8 text-center text-gray-500">
        جاري تحميل الإعدادات...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-none shadow-lg p-6 md:p-8 space-y-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">إعدادات التواصل ورمز QR</h2>
          <p className="text-sm text-gray-500">إدارة أزرار الواتساب والاتصال ورمز QR الظاهر في الموقع</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">رقم الواتساب</label>
            <input
              type="tel"
              value={form.whatsappNumber}
              onChange={(e) => updateField('whatsappNumber', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-none focus:ring-2 focus:ring-cta"
              dir="ltr"
              placeholder="+966507826024"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">يُستخدم لزر الواتساب العائم ورمز QR (عند اختيار واتساب)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">رقم الهاتف</label>
            <input
              type="tel"
              value={form.phoneNumber}
              onChange={(e) => updateField('phoneNumber', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-none focus:ring-2 focus:ring-cta"
              dir="ltr"
              placeholder="+966507826024"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">يُستخدم لزر الاتصال العائم ورمز QR (عند اختيار اتصال)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">رابط الموقع</label>
            <input
              type="url"
              value={form.websiteUrl}
              onChange={(e) => updateField('websiteUrl', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-none focus:ring-2 focus:ring-cta"
              dir="ltr"
              placeholder="https://www.tamalarabiya.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">رابط مخصص</label>
            <input
              type="url"
              value={form.customUrl}
              onChange={(e) => updateField('customUrl', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-none focus:ring-2 focus:ring-cta"
              dir="ltr"
              placeholder="https://example.com/page"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">يُستخدم عند اختيار «رابط مخصص» لرمز QR</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 text-right">وجهة رمز QR</label>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {QR_DESTINATIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-4 border rounded-none cursor-pointer transition-colors ${
                  form.qrDestination === option.value
                    ? 'border-cta bg-cta/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="qrDestination"
                  value={option.value}
                  checked={form.qrDestination === option.value}
                  onChange={() => updateField('qrDestination', option.value)}
                  className="text-cta focus:ring-cta"
                />
                <span className="text-sm font-medium text-gray-800">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm text-right">{error}</div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm text-right">{success}</div>
        )}

        <div className="flex flex-wrap gap-3 justify-end">
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={regenerating || saving}
            className="inline-flex items-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 rounded-none hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${regenerating ? 'animate-spin' : ''}`} />
            إعادة توليد QR
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || regenerating}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cta text-white rounded-none font-bold hover:bg-cta-hover disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-none shadow-lg p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <QrCode className="h-6 w-6 text-cta" />
          <h3 className="text-lg font-bold text-gray-900">معاينة رمز QR</h3>
        </div>
        {preview?.qrCodeDataUrl ? (
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src={preview.qrCodeDataUrl}
              alt="QR Code Preview"
              className="w-56 h-56 object-contain border border-gray-100 p-4 bg-white"
            />
            <div className="space-y-3 text-right flex-1">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">الوجهة:</span>{' '}
                {QR_DESTINATIONS.find((d) => d.value === preview.qrDestination)?.label}
              </p>
              {preview.qrTargetUrl && (
                <p className="text-sm text-gray-600 break-all">
                  <span className="font-semibold text-gray-900">الرابط:</span> {preview.qrTargetUrl}
                </p>
              )}
              {preview.updatedAt && (
                <p className="text-xs text-gray-400">
                  آخر تحديث: {new Date(preview.updatedAt).toLocaleString('ar-SA')}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">لا يوجد رمز QR — احفظ الإعدادات لتوليده</p>
        )}
      </div>
    </div>
  );
}
