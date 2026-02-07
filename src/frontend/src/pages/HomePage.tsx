import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Grid3x3, GitCompare, Gift, HelpCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageProvider';

export default function HomePage() {
  const { t } = useLanguage();

  const quickActions = [
    { icon: Grid3x3, label: t('home.browseCategories'), to: '/categories', variant: 'default' as const },
    { icon: GitCompare, label: t('home.compareNow'), to: '/compare', variant: 'outline' as const },
    { icon: Gift, label: t('home.viewRewards'), to: '/rewards', variant: 'outline' as const },
    { icon: HelpCircle, label: t('home.needHelp'), to: '/support', variant: 'outline' as const },
  ];

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">{t('home.title')}</h1>
        <p className="text-muted-foreground">{t('home.subtitle')}</p>
      </div>

      <Alert className="border-primary/20 bg-primary/5">
        <AlertCircle className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">{t('home.complianceNote')}</AlertDescription>
      </Alert>

      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.to} to={action.to}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
                <CardContent className="flex flex-col items-center justify-center p-6 space-y-3">
                  <Icon className="w-10 h-10 text-primary" />
                  <span className="text-sm font-semibold text-center">{action.label}</span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('home.viewDisclaimer')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Link to="/disclaimer">
            <Button variant="outline" className="w-full">
              {t('home.viewDisclaimer')}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
