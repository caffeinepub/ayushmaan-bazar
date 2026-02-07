import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '../i18n/LanguageProvider';

export default function MyLeadsPage() {
  const { t } = useLanguage();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">My Applications</h1>
        <p className="text-muted-foreground">Track your policy applications</p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No applications yet</p>
        </CardContent>
      </Card>
    </div>
  );
}
