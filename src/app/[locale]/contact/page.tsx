'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {ContactSchema, type ContactInput} from '@/lib/contact';
import {submitContact, type ActionResult} from '@/app/actions';
import {useState} from 'react';

export default function ContactPage() {
  const {register, handleSubmit, formState: {errors, isSubmitting}, reset} =
    useForm<ContactInput>({resolver: zodResolver(ContactSchema)});

  const [result, setResult] = useState<ActionResult | null>(null);

  const onSubmit = async (values: ContactInput) => {
    const fd = new FormData();
    (Object.entries(values) as [keyof ContactInput, string][])
      .forEach(([k, v]) => fd.append(k, v));
    const res = await submitContact(null, fd);
    setResult(res);
    if (res.ok) reset();
  };

  return (
    <section className="max-w-lg grid gap-4">
      <h1 className="text-2xl font-bold">Kapcsolat</h1>

      {!result?.ok && result?.fieldErrors && (
        <div className="text-sm text-red-600">
          {Object.entries(result.fieldErrors).map(([k, msg]) => (
            <div key={k}>{msg}</div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
        <label className="grid gap-1">
          <span>Név</span>
          <input className="border rounded px-3 py-2" {...register('name')} />
          {errors.name && <span className="text-red-600 text-sm">{errors.name.message}</span>}
        </label>

        <label className="grid gap-1">
          <span>E-mail</span>
          <input className="border rounded px-3 py-2" type="email" {...register('email')} />
          {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
        </label>

        <label className="grid gap-1">
          <span>Üzenet</span>
          <textarea className="border rounded px-3 py-2" rows={5} {...register('message')} />
          {errors.message && <span className="text-red-600 text-sm">{errors.message.message}</span>}
        </label>

        <button
          className="px-4 py-2 rounded border disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Küldés…' : 'Küldés'}
        </button>

        {result?.ok && <p className="text-green-700">Köszi! Üzeneted megkaptuk.</p>}
      </form>
    </section>
  );
}

