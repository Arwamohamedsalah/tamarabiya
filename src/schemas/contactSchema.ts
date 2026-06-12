import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { z } from 'zod';

export const createContactFormSchema = (t: TFunction<'validation'>) =>
  z.object({
    name: z
      .string()
      .min(2, t('name.min'))
      .max(50, t('name.max'))
      .regex(/^[\u0600-\u06FF\sA-Za-z]+$/, t('name.pattern')),

    email: z
      .string()
      .min(1, t('email.required'))
      .email(t('email.invalid'))
      .toLowerCase(),

    phone: z
      .string()
      .min(1, t('phone.required'))
      .regex(/^(\+966|0)?[5][0-9]{8}$/, t('phone.invalid')),

    service: z.string().min(1, t('service.required')),

    message: z
      .string()
      .min(10, t('message.min'))
      .max(500, t('message.max')),
  });

export type ContactFormData = z.infer<ReturnType<typeof createContactFormSchema>>;

export function useContactFormSchema() {
  const { t } = useTranslation('validation');
  return createContactFormSchema(t);
}
