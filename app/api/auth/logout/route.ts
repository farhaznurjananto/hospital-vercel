import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    await auth.api.signOut({
      headers: await headers(),
      asResponse: true,
    });

    return NextResponse.json(
      { status: 'success', message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to logout' },
      { status: 500 }
    );
  }
}
