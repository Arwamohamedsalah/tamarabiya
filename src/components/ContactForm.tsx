import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createContactFormSchema, type ContactFormData } from '../schemas/contactSchema';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { submitContactForm, resetForm } from '../store/slices/contactSlice';
import { addNotification } from '../store/slices/uiSlice';
import { Phone, Mail, MessageSquare, User, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocaleDirection } from '../hooks/useLocaleDirection';

export default function ContactForm() {
  const dispatch = useAppDispatch();
  const { isSubmitting, submitError, submitSuccess } = useAppSelector((state) => state.contact);
  const { t, i18n } = useTranslation('contact');
  const { t: tValidation } = useTranslation('validation');
  const { isRtl } = useLocaleDirection();

  const contactFormSchema = useMemo(
    () => createContactFormSchema(tValidation),
    [tValidation, i18n.language]
  );

  const services = useMemo(
    () => [
      { value: 'landscaping', label: t('form.services.landscaping') },
      { value: 'fencing', label: t('form.services.fencing') },
      { value: 'infrastructure', label: t('form.services.infrastructure') },
      { value: 'other', label: t('form.services.other') },
    ],
    [t, i18n.language]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service: '',
      message: '',
    },
  });

  useEffect(() => {
    if (submitSuccess) {
      dispatch(
        addNotification({
          message: t('form.success'),
          type: 'success',
        })
      );
      reset();
      dispatch(resetForm());
    }
  }, [submitSuccess, dispatch, reset, t]);

  useEffect(() => {
    if (submitError) {
      dispatch(
        addNotification({
          message: submitError || t('form.error'),
          type: 'error',
        })
      );
    }
  }, [submitError, dispatch, t]);

  const onSubmit = async (data: ContactFormData) => {
    await dispatch(submitContactForm(data));
  };

  const textAlign = isRtl ? 'text-right' : 'text-left';
  const iconPosition = isRtl ? 'right-3' : 'left-3';
  const inputPadding = isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4';

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
            {t('form.name')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className={`absolute ${iconPosition} top-1/2 transform -translate-y-1/2 text-gray-400`}>
              <User className="h-5 w-5" />
            </div>
            <input
              type="text"
              id="name"
              {...register('name')}
              className={`w-full ${inputPadding} py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
              }`}
              placeholder={t('form.namePlaceholder')}
              dir={isRtl ? 'rtl' : 'ltr'}
            />
          </div>
          {errors.name && (
            <p className={`mt-1 text-sm text-red-600 ${textAlign} flex items-center gap-1`}>
              <XCircle className="h-4 w-4" />
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
            {t('form.email')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className={`absolute ${iconPosition} top-1/2 transform -translate-y-1/2 text-gray-400`}>
              <Mail className="h-5 w-5" />
            </div>
            <input
              type="email"
              id="email"
              {...register('email')}
              className={`w-full ${inputPadding} py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
              }`}
              placeholder={t('form.emailPlaceholder')}
              dir="ltr"
            />
          </div>
          {errors.email && (
            <p className={`mt-1 text-sm text-red-600 ${textAlign} flex items-center gap-1`}>
              <XCircle className="h-4 w-4" />
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
            {t('form.phone')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className={`absolute ${iconPosition} top-1/2 transform -translate-y-1/2 text-gray-400`}>
              <Phone className="h-5 w-5" />
            </div>
            <input
              type="tel"
              id="phone"
              {...register('phone')}
              className={`w-full ${inputPadding} py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                errors.phone
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
              }`}
              placeholder={t('form.phonePlaceholder')}
              dir="ltr"
            />
          </div>
          {errors.phone && (
            <p className={`mt-1 text-sm text-red-600 ${textAlign} flex items-center gap-1`}>
              <XCircle className="h-4 w-4" />
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="service" className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
            {t('form.service')} <span className="text-red-500">*</span>
          </label>
          <select
            id="service"
            {...register('service')}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
              errors.service
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
            }`}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <option value="">{t('form.servicePlaceholder')}</option>
            {services.map((service) => (
              <option key={service.value} value={service.value}>
                {service.label}
              </option>
            ))}
          </select>
          {errors.service && (
            <p className={`mt-1 text-sm text-red-600 ${textAlign} flex items-center gap-1`}>
              <XCircle className="h-4 w-4" />
              {errors.service.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
            {t('form.message')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className={`absolute ${iconPosition} top-3 text-gray-400`}>
              <MessageSquare className="h-5 w-5" />
            </div>
            <textarea
              id="message"
              {...register('message')}
              rows={5}
              className={`w-full ${inputPadding} py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
                errors.message
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
              }`}
              placeholder={t('form.messagePlaceholder')}
              dir={isRtl ? 'rtl' : 'ltr'}
            />
          </div>
          {errors.message && (
            <p className={`mt-1 text-sm text-red-600 ${textAlign} flex items-center gap-1`}>
              <XCircle className="h-4 w-4" />
              {errors.message.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="w-full bg-gradient-to-r from-green-700 to-green-800 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-green-800 hover:to-green-900 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{t('form.submitting')}</span>
            </>
          ) : (
            <>
              <span>{t('form.submit')}</span>
              <CheckCircle className="h-5 w-5" />
            </>
          )}
        </button>

        {submitSuccess && (
          <div className={`bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 ${textAlign}`}>
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 font-medium">
              {t('form.success')}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
