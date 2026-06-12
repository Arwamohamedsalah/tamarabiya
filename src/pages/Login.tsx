import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Building2, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح').min(1, 'البريد الإلكتروني مطلوب'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const raw = await response.text();
      let result: { token?: string; user?: object; message?: string } | null = null;

      if (raw) {
        try {
          result = JSON.parse(raw);
        } catch {
          throw new Error('استجابة غير صالحة من الخادم');
        }
      }

      if (!response.ok) {
        throw new Error(result?.message || 'فشل تسجيل الدخول');
      }

      if (!result?.token || !result?.user) {
        throw new Error('الخادم غير متصل. شغّل الباك إند أولاً من مجلد server');
      }

      dispatch(setCredentials({ token: result.token, user: result.user }));
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'حدث خطأ أثناء الاتصال بالخادم';
      if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
        setError('لا يمكن الاتصال بالخادم. تأكد من تشغيل الباك إند (npm run dev داخل مجلد server)');
      } else {
        setError(message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-metal via-metal-dark to-metal flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-none blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cta rounded-none blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-none shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-metal to-metal-dark rounded-none shadow-lg mb-4 ring-2 ring-cta/30">
              <Building2 className="h-10 w-10 text-cta-light" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">تسجيل الدخول</h1>
            <p className="text-gray-600">لوحة تحكم الموقع</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  autoComplete="email"
                  className={`w-full pr-10 pl-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-cta focus:border-cta'
                    }`}
                  placeholder="admin@tamalarabiya.com"
                  dir="ltr"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 text-right">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  {...register('password')}
                  autoComplete="current-password"
                  className={`w-full pr-10 pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${errors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-cta focus:border-cta'
                    }`}
                  placeholder="أدخل كلمة المرور"
                  dir="rtl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 text-right">{errors.password.message}</p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-none p-4 text-right">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-cta text-white px-8 py-4 rounded-none font-black text-lg uppercase tracking-[0.2em] hover:bg-cta-hover transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'جاري التحقق...' : 'تسجيل الدخول'}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
