import { SectionCards } from '@/components/sidebar/section-cards';
import DataTablePatients from './_components/DataTablePatients';

export default function AdminPage() {
  return (
    <div className='space-y-4 h-full px-4 lg:px-6'>
      <DataTablePatients />
    </div>
  );
}
