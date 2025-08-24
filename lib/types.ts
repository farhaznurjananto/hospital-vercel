export type ApiResponse = {
  status: 'success' | 'error';
  message: string;
};

export type Doctor = {
  id: string;
  name: string;
  email: string;
};

export type Patient = {
  id: string;
  name: string;
  date_of_birth: string;
  visit_date: string;
  diagnosis: string;
  treatment: 'Medication' | 'Surgery' | 'Therapy' | 'Observation';
  createdAt: string;
  updatedAt: string;
  doctorId: string;
  doctor: Doctor;
};
