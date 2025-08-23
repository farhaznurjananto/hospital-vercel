import { z } from 'zod';

export const treatmentOptions = [
  'Medication',
  'Surgery',
  'Therapy',
  'Observation',
] as const;

export const doctorOptions = [
  'Dr. Smith',
  'Dr. Johnson',
  'Dr. Lee',
  'Dr. Brown',
] as const;

export const patientSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(100, { message: 'Name must be at most 100 characters long' }),

  date_of_birth: z.date({
    message: 'Date of birth is required',
  }),

  visit_date: z.date({
    message: 'Visit date is required',
  }),

  diagnosis: z
    .string()
    .min(3, { message: 'Diagnosis must be at least 3 characters long' }),

  treatment: z.enum(treatmentOptions, {
    message: 'Treatment is required',
  }),

  doctor: z.enum(doctorOptions, {
    message: 'Doctor is required',
  }),
});

export type PatientSchemaType = z.infer<typeof patientSchema>;
