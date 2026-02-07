import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageProvider';

export default function DisclaimerPage() {
  const { t } = useLanguage();

  const sections = [
    {
      title: t('disclaimer.facilitator'),
      content: t('disclaimer.facilitatorText'),
    },
    {
      title: t('disclaimer.rewards'),
      content: t('disclaimer.rewardsText'),
    },
    {
      title: t('disclaimer.noGuarantee'),
      content: t('disclaimer.noGuaranteeText'),
    },
    {
      title: t('disclaimer.compliance'),
      content: t('disclaimer.complianceText'),
    },
  ];

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">{t('disclaimer.title')}</h1>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{section.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Link to="/">
        <Button className="w-full" size="lg">
          {t('lead.backToHome')}
        </Button>
      </Link>
    </div>
  );
}
