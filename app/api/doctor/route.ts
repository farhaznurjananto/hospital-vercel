import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const doctors = await prisma.user.findMany({
      where: { role: 'user' },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ status: 'success', data: doctors });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}
