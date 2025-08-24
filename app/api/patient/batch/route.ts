import { prisma } from '@/lib/db';
import { patientSchema } from '@/lib/zodSchemas';
import { NextResponse } from 'next/server';
import { json2csv } from 'json-2-csv';
import { z } from 'zod';

const patientsArraySchema = z.array(patientSchema);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const patients = patientsArraySchema.parse(data);

    const created = await prisma.patient.createMany({
      data: patients.map((p) => ({
        name: p.name,
        date_of_birth: p.date_of_birth,
        visit_date: p.visit_date,
        diagnosis: p.diagnosis,
        treatment: p.treatment,
        doctorId: p.doctorId,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({
      message: 'Patients imported successfully',
      count: created.count,
    });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      include: {
        doctor: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = patients.map((p) => ({
      Name: p.name,
      DateOfBirth: p.date_of_birth.toISOString(),
      VisitDate: p.visit_date.toISOString(),
      Diagnosis: p.diagnosis,
      Treatment: p.treatment,
      DoctorName: p.doctor?.name || '',
      DoctorEmail: p.doctor?.email || '',
    }));

    const csv = await json2csv(data, { prependHeader: true });

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=patients.csv',
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to export CSV' },
      { status: 500 }
    );
  }
}
