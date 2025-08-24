import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { patientSchema } from '@/lib/zodSchemas';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();

    const validation = patientSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid form data' },
        { status: 400 }
      );
    }

    const { name, date_of_birth, visit_date, diagnosis, treatment, doctorId } =
      validation.data;

    await prisma.patient.create({
      data: {
        name,
        date_of_birth,
        visit_date,
        diagnosis,
        treatment,
        doctorId,
      },
    });

    return NextResponse.json(
      { status: 'success', message: 'Patient created successfully' },
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

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const patients = await prisma.patient.findMany({
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalPatients = await prisma.patient.count();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const totalToday = await prisma.patient.count({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    return NextResponse.json(
      { status: 'success', data: patients, totalPatients, totalToday },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}
