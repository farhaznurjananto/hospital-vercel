import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

type Context = { params: Promise<{ patientId: string }> };

export async function GET(req: NextRequest, { params }: Context) {
  try {
    const { patientId } = await params;

    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!patient) {
      return NextResponse.json(
        { status: 'error', message: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: 'success', data: patient },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching patient:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch patient' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Context) {
  try {
    const { patientId } = await params;

    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return NextResponse.json(
        { status: 'error', message: 'Patient not found' },
        { status: 404 }
      );
    }

    await prisma.patient.delete({
      where: { id: patientId },
    });

    return NextResponse.json(
      { status: 'success', message: 'Patient deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting patient:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to delete patient' },
      { status: 500 }
    );
  }
}


export async function PATCH(req: NextRequest, { params }: Context) {
  try {
    const { patientId } = await params;

    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();

    const existingPatient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!existingPatient) {
      return NextResponse.json(
        { status: 'error', message: 'Patient not found' },
        { status: 404 }
      );
    }

    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: {
        name: body.name,
        date_of_birth: new Date(body.date_of_birth),
        visit_date: new Date(body.visit_date),
        diagnosis: body.diagnosis,
        treatment: body.treatment,
        doctorId: body.doctorId,
      },
    });

    return NextResponse.json(
      {
        status: 'success',
        message: 'Patient updated successfully',
        data: updatedPatient,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to update patient' },
      { status: 500 }
    );
  }
}
