import { TenantDetail } from '@/components/screens/TenantDetail';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return <TenantDetail tenantId={id} />;
}
