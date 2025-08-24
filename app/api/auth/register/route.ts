import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import { userRegisterSchema } from '@/lib/zodSchemas';
import { authClient } from '@/lib/auth-client';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validation = userRegisterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid Form Data' },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    return NextResponse.json(
      { status: 'success', message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: 'error', message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
