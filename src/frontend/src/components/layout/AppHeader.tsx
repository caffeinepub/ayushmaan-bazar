import { Link } from '@tanstack/react-router';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginButton from '../auth/LoginButton';
import { useNotifications } from '../../hooks/useNotifications';
import { Badge } from '@/components/ui/badge';

export default function AppHeader() {
  const { data: notifications = [] } = useNotifications();
  const unreadCount = notifications.length;

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 max-w-screen-xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <img src="/assets/generated/app-logo-ayushmaan-bazar.dim_512x512.png" alt="Ayushmaan Bazar Logo" className="w-8 h-8" />
          <span className="font-bold text-lg text-primary">Ayushmaan Bazar</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          </Link>
          <LoginButton />
        </div>
      </div>
    </header>
  );
}
