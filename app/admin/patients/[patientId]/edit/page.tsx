'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  patientSchema,
  PatientSchemaType,
  treatmentOptions,
} from '@/lib/zodSchemas';
import { ArrowLeft, CalendarIcon, Loader2, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Doctor } from '@/lib/types';
import { toast } from 'sonner';

export default function EditPatientForm() {
  const params = useParams();
  const patientId = params.patientId;

  const [isPending, startPendingTransition] = useTransition();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const router = useRouter();
  const [patientData, setPatientData] = useState<PatientSchemaType | null>(
    null
  );

  const form = useForm<PatientSchemaType>({
    resolver: zodResolver(patientSchema) as Resolver<PatientSchemaType>,
    defaultValues: {
      name: '',
      date_of_birth: new Date(),
      visit_date: new Date(),
      diagnosis: '',
      treatment: 'Medication',
      doctorId: '',
    },
  });

  useEffect(() => {
    if (!patientId) return;

    fetch(`/api/patient/${patientId}`)
      .then((res) => res.json())
      .then((data) => {
        setPatientData(data.data);

        form.reset({
          name: data.data.name,
          date_of_birth: new Date(data.data.date_of_birth),
          visit_date: new Date(data.data.visit_date),
          diagnosis: data.data.diagnosis,
          treatment: data.data.treatment,
          doctorId: data.data.doctorId,
        });
      })
      .catch((err) => console.error('Failed to fetch patient:', err));
  }, [patientId, form]);

  useEffect(() => {
    fetch('/api/doctor', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => setDoctors(data.data as Doctor[]));
  }, []);

  function onSubmit(values: PatientSchemaType) {
    if (!patientId) {
      toast.error('Patient ID is missing');
      return;
    }

    startPendingTransition(async () => {
      try {
        const res = await fetch(`/api/patient/${patientId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const result = await res.json();

        if (result.status === 'success') {
          toast.success(result.message);
          router.push('/admin/patients');
        } else {
          toast.error(result.message);
        }
      } catch (err) {
        toast.error('An unexpected error occurred. Please try again.');
        console.log(err);
      }
    });
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Link
          href={'/admin/patients'}
          className={buttonVariants({
            variant: 'outline',
            size: 'icon',
          })}
        >
          <ArrowLeft size={4} />
        </Link>

        <h1 className="text-2xl font-bold">Edit Patient</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Provide basic information about the patient
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date of Birth */}
                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Visit Date */}
                <FormField
                  control={form.control}
                  name="visit_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visit Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Diagnosis Description */}
              <FormField
                control={form.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Diagnosis Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Diagnosis Description"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Treatment */}
              <FormField
                control={form.control}
                name="treatment"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Treatment</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a Treatment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {treatmentOptions.map((treatment) => (
                          <SelectItem key={treatment} value={treatment}>
                            {treatment}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Doctor */}
              <FormField
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Doctor</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a Doctor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    Updating...
                    <Loader2 className="animate-spin ml-1" />
                  </>
                ) : (
                  <>
                    Update Patient <PlusIcon className="ml-1" size={16} />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
