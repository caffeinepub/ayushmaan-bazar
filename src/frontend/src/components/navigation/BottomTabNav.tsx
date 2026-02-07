import { Link, useRouterState } from '@tanstack/react-router';
import { Home, Grid3x3, GitCompare, Gift, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageProvider';

export default function BottomTabNav() {
  const { t } = useLanguage();
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const tabs = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/categories', icon: Grid3x3, label: t('nav.categories') },
    { path: '/compare', icon: GitCompare, label: t('nav.compare') },
    { path: '/rewards', icon: Gift, label: t('nav.rewards') },
    { path: '/support', icon: HelpCircle, label: t('nav.support') },
  ];

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${active ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-xs ${active ? 'font-semibold' : 'font-medium'}`}>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
