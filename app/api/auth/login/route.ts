import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { userLoginSchema } from '@/lib/zodSchemas';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validation = userLoginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid Form Data' },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    await auth.api.signInEmail({
      body: { email, password },
      headers: {},
    });

    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json(
        { status: 'error', message: 'User not found' },
        { status: 404 }
      );
    }

    const role = user.role ?? 'user';

    const response = NextResponse.json(
      { status: 'success', message: 'Login successfully' },
      { status: 201 }
    );


    response.cookies.set({
      name: 'role',
      value: role,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: 'error', message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
