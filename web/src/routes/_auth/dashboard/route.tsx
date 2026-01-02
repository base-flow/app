import { createFileRoute, Outlet } from '@tanstack/react-router';
import DashboardMenu from '~/dashboard/components/DashboardMenu';

export const Route = createFileRoute('/_auth/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <aside><DashboardMenu /></aside>
      <main className="g-col-paper"><Outlet /></main>
    </>
  );
}
