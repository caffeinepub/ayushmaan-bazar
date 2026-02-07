import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '../i18n/LanguageProvider';
import { useCompareSelection } from '../state/compareSelection';

export default function ComparePage() {
  const { t } = useLanguage();
  const { selectedPolicies, clearAll } = useCompareSelection();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">{t('compare.title')}</h1>
        <p className="text-muted-foreground">{t('compare.subtitle')}</p>
      </div>

      {selectedPolicies.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-muted-foreground">{t('compare.selectMinimum')}</p>
            <Link to="/categories">
              <Button>{t('home.browseCategories')}</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {t('compare.selectedPolicies')}: {selectedPolicies.length}
            </p>
            <Button variant="outline" size="sm" onClick={clearAll}>
              {t('compare.clearAll')}
            </Button>
          </div>

          {selectedPolicies.length >= 2 ? (
            <Link to="/compare/detail">
              <Button className="w-full" size="lg">
                {t('compare.compareNow')}
              </Button>
            </Link>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center">
                <p className="text-sm text-muted-foreground">{t('compare.selectMinimum')}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
