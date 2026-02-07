import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useComparePolicies } from '../hooks/usePolicies';
import { useLanguage } from '../i18n/LanguageProvider';
import { useCompareSelection } from '../state/compareSelection';

export default function CompareDetailPage() {
  const { t } = useLanguage();
  const { selectedPolicies } = useCompareSelection();
  const { data: policies = [], isLoading } = useComparePolicies(selectedPolicies);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  if (policies.length < 2) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-muted-foreground">{t('compare.selectMinimum')}</p>
            <Link to="/categories">
              <Button>{t('home.browseCategories')}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/compare">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{t('compare.comparisonTitle')}</h1>
          <p className="text-sm text-muted-foreground">{t('compare.comparisonSubtitle')}</p>
        </div>
      </div>

      <Alert className="border-primary/20 bg-primary/5">
        <AlertCircle className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          This comparison is for informational purposes only. All terms are subject to insurer conditions.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        {policies.map((policy) => (
          <Card key={policy.id.toString()}>
            <CardHeader>
              <CardTitle>{policy.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">{t('policy.price')}</p>
                <p className="text-2xl font-bold text-primary">₹{policy.price.toLocaleString()}{t('policy.perYear')}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">{t('policy.coverage')}</p>
                <p className="text-sm">{policy.coverage}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">{t('policy.benefits')}</p>
                <p className="text-sm">{policy.benefits}</p>
              </div>
              <Link to="/lead/$policyId" params={{ policyId: policy.id.toString() }}>
                <Button className="w-full">{t('policy.applyNow')}</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
