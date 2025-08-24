import { auth } from '@/lib/auth';
import { RegisterForm } from './_components/RegisterForm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return redirect('/');
  }

  return <RegisterForm />;
}
