'use client';

import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useFormState} from 'react-dom';
import {ContactSchema, sendContact} from '@/app/actions';

type FormData = z.infer<typeof ContactSchema>;

export default function ContactPage() {
  const [state, formAction] = useFormState(sendContact, null);
  const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<FormData>({
    resolver: zodResolver(ContactSchema as any)
  });

  return (
    <section className="max-w-xl mx-auto grid gap-4">
      <h1 className="text-3xl font-extrabold">Kapcsolat</h1>
      <p className="text-neutral-700">Írj üzenetet, válaszolunk.</p>

      <form action={formAction} onSubmit={handleSubmit(() => {})} className="grid gap-4">
        <div>
          <label className="block text-sm mb-1">Név</label>
          <input {...register('name')} className="w-full border rounded-lg p-2" placeholder="Név" />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input {...register('email')} className="w-full border rounded-lg p-2" placeholder="email@cim.hu" />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Üzenet</label>
          <textarea {...register('message')} className="w-full border rounded-lg p-2 min-h-32" placeholder="Miben segíthetünk?" />
          {errors.message && <p className="text-sm text-red-600">{errors.message.message as string}</p>}
        </div>

        {/* Honeypot mező – rejtve (botok belefutnak) */}
        <input {...register('website')} className="hidden" tabIndex={-1} autoComplete="off" />

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-xl border shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? 'Küldés…' : 'Küldés'}
        </button>

        {state?.ok && <p className="text-green-700">Köszönjük! Üzeneted megérkezett.</p>}
        {state?.errors && <p className="text-red-700">Kérlek ellenőrizd a mezőket.</p>}
      </form>
    </section>
  );
}

