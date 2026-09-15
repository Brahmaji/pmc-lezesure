import { TenantDetail } from '@/components/screens/TenantDetail';

export default function Page({ searchParams }: { searchParams: { id?: string } }) {
  return <TenantDetail tenantId={searchParams.id} />;
}
