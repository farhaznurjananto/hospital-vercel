import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface featureProps {
  title: string;
  description: string;
  icon: string;
}

const features: featureProps[] = [
  {
    title: 'Emergency Care',
    description:
      'Receive immediate and professional treatment in emergency situations.',
    icon: '🚑',
  },
  {
    title: 'Specialist Doctors',
    description:
      'Consult with experienced specialists across various medical fields.',
    icon: '🩺',
  },
  {
    title: '24/7 Service',
    description:
      'Access healthcare services anytime with our round-the-clock facilities.',
    icon: '⏰',
  },
  {
    title: 'Patient Support',
    description:
      'Get comprehensive care and support from our dedicated medical staff.',
    icon: '🤝',
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant="outline">Trusted Healthcare for Everyone</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Caring for Your Health, Every Step of the Way
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Experience compassionate care and modern medical services in a safe
            and professional environment. Your health is our top priority,
            anytime you need it.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              className={buttonVariants({
                size: 'lg',
              })}
              href={'#'}
            >
              Explore Services
            </Link>

            <Link
              className={buttonVariants({
                variant: 'outline',
                size: 'lg',
              })}
              href={'#'}
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
