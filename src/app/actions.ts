'use server';

import {ContactSchema, type ContactInput} from '@/lib/contact';

export type ActionResult =
  | { ok: true }
  | { ok: false; fieldErrors?: Record<string, string>; formError?: string };

export async function submitContact(
  _prev: unknown,
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = ContactSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    const flat = parsed.error.flatten();
    for (const [field, msgs] of Object.entries(flat.fieldErrors)) {
      if (msgs?.[0]) fieldErrors[field] = msgs[0];
    }
    return {ok: false, fieldErrors};
  }

  const data: ContactInput = parsed.data;

  // Itt tedd meg a valódi küldést (pl. email / db / 3rd-party):
  // await sendEmail(data)

  // Kis késleltetés a demo kedvéért
  // await new Promise(r => setTimeout(r, 400));

  return {ok: true};
}


