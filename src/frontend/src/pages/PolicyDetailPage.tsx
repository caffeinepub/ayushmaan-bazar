import { useParams, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useGetPolicy } from '../hooks/usePolicies';
import { useLanguage } from '../i18n/LanguageProvider';

export default function PolicyDetailPage() {
  const { policyId } = useParams({ from: '/policy/$policyId' });
  const { data: policy, isLoading } = useGetPolicy(BigInt(policyId));
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{t('common.error')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/categories">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{policy.name}</h1>
      </div>

      <Alert className="border-primary/20 bg-primary/5">
        <AlertCircle className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          All policy information is for reference only. Terms and conditions apply.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>{t('policy.price')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">₹{policy.price.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">{t('policy.perYear')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('policy.coverage')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{policy.coverage}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('policy.benefits')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{policy.benefits}</p>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Link to="/lead/$policyId" params={{ policyId: policy.id.toString() }} className="flex-1">
          <Button className="w-full" size="lg">
            {t('policy.applyNow')}
          </Button>
        </Link>
        <Link to="/disclaimer" className="flex-1">
          <Button variant="outline" className="w-full" size="lg">
            {t('home.viewDisclaimer')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
