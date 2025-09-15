'use server';

import {ContactSchema, type ContactInput} from '@/lib/contact';

export type ActionResult =
  | { ok: true }
  | {
      ok: false;
      fieldErrors?: Record<string, string>;
      formError?: string;
    };

export async function submitContact(
  _prevState: unknown,              // Next server action API signature
  formData: FormData
): Promise<ActionResult> {
  // FormData -> plain object
  const raw = Object.fromEntries(formData.entries());

  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    const flat = parsed.error.flatten();
    for (const [key, msgs] of Object.entries(flat.fieldErrors)) {
      if (msgs && msgs.length) fieldErrors[key] = msgs[0]!;
    }
    return {ok: false, fieldErrors};
  }

  const data: ContactInput = parsed.data;

  // TODO: itt küldd el e-mailben / külső API-ra / DB-be
  // pl. await sendEmail(data)

  return {ok: true};
}

