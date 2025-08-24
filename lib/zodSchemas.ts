import { z } from 'zod';

export const treatmentOptions = [
  'Medication',
  'Surgery',
  'Therapy',
  'Observation',
] as const;

export const patientSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(100, { message: 'Name must be at most 100 characters long' }),

  date_of_birth: z.preprocess(
    (val) => (typeof val === 'string' ? new Date(val) : val),
    z.date({
      message: 'Date of birth is required',
    })
  ),

  visit_date: z.preprocess(
    (val) => (typeof val === 'string' ? new Date(val) : val),
    z.date({
      message: 'Visit date is required',
    })
  ),

  diagnosis: z
    .string()
    .min(3, { message: 'Diagnosis must be at least 3 characters long' }),

  treatment: z.enum(treatmentOptions, {
    message: 'Treatment is required',
  }),

  doctorId: z.string().min(1, { message: 'Doctor is required' }),
});

export const userRegisterSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(100, { message: 'Name must be at most 100 characters long' }),

  email: z.string().email({ message: 'Invalid email address' }),

  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(100, { message: 'Password must be at most 100 characters long' }),
});

export const userLoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),

  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(100, { message: 'Password must be at most 100 characters long' }),
});

export type UserRegisterSchema = z.infer<typeof userRegisterSchema>;
export type UserLoginSchema = z.infer<typeof userLoginSchema>;
export type PatientSchemaType = z.infer<typeof patientSchema>;
