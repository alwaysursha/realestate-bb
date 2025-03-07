import { inquiryService } from '@/services/inquiryService';
import InquiryDetails from '@/components/admin/InquiryDetails';

export async function generateStaticParams() {
  // For static export, we'll pre-render a few example inquiry IDs
  return [
    { id: 'example-1' },
    { id: 'example-2' },
    { id: 'example-3' }
  ];
}

export default async function InquiryPage({ params }: { params: { id: string } }) {
  return <InquiryDetails id={params.id} />;
} 