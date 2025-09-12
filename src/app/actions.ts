'use server';

import {z} from 'zod';

export const ContactSchema = z.object({
  name: z.string().min(2, 'Név túl rövid'),
  email: z.string().email('Érvénytelen email'),
  message: z.string().min(10, 'Üzenet túl rövid'),
  // honeypot – igazi felhasználó üresen hagyja
  website: z.string().max(0).optional()
});

export async function sendContact(prevState: any, formData: FormData) {
  const data = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    message: String(formData.get('message') ?? ''),
    website: String(formData.get('website') ?? '')
  };

  const parsed = ContactSchema.safeParse(data);
  if (!parsed.success) {
    return { ok:false, errors: parsed.error.flatten().fieldErrors };
  }

  // TODO: itt küldhetsz emailt (pl. Resend/SMTP), most csak logolunk
  console.log('CONTACT_FORM', parsed.data);

  await new Promise(r => setTimeout(r, 400)); // kis latency-szimuláció
  return { ok:true };
}
