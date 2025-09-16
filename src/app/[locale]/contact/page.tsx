'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {ContactSchema, type ContactInput} from '@/lib/contact';
import {submitContact, type ActionResult} from '@/app/actions';
import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Toaster, toast} from 'sonner';

export default function ContactPage() {
  const t = useTranslations('Contact');
  const te = (key: string) => t(`errors.${key}` as any); // kulcsok a zod üzenetkódjai

  const {register, handleSubmit, formState: {errors, isSubmitting}, reset} =
    useForm<ContactInput>({resolver: zodResolver(ContactSchema)});

  const [result, setResult] = useState<ActionResult | null>(null);

  const onSubmit = async (values: ContactInput) => {
    const fd = new FormData();
    (Object.entries(values) as [keyof ContactInput, string][])
      .forEach(([k, v]) => fd.append(k, v));
    const res = await submitContact(null, fd);
    setResult(res);
    if (res.ok) {
      toast.success(t('success'));
      reset();
    } else if (res.fieldErrors) {
      // RHF errorok mellett extra form hiba is jelezhető
      Object.values(res.fieldErrors).forEach(code => toast.error(te(code)));
    }
  };

  return (
    <section className="max-w-lg grid gap-4">
      <Toaster richColors />
      <h1 className="text-2xl font-bold">{t('title')}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
        <label className="grid gap-1">
          <span>{t('name')}</span>
          <input className="border rounded px-3 py-2" {...register('name')} />
          {errors.name && <span className="text-red-600 text-sm">{te(errors.name.message!)}</span>}
        </label>

        <label className="grid gap-1">
          <span>{t('email')}</span>
          <input className="border rounded px-3 py-2" type="email" {...register('email')} />
          {errors.email && <span className="text-red-600 text-sm">{te(errors.email.message!)}</span>}
        </label>

        <label className="grid gap-1">
          <span>{t('message')}</span>
          <textarea className="border rounded px-3 py-2" rows={5} {...register('message')} />
          {errors.message && <span className="text-red-600 text-sm">{te(errors.message.message!)}</span>}
        </label>

        <button
          className="px-4 py-2 rounded border disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('sending') : t('send')}
        </button>
      </form>
    </section>
  );
}


