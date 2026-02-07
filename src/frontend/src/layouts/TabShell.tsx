import { Outlet } from '@tanstack/react-router';
import BottomTabNav from '../components/navigation/BottomTabNav';
import AppHeader from '../components/layout/AppHeader';

export default function TabShell() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader />
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      <BottomTabNav />
    </div>
  );
}
