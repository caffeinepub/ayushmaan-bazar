import { useParams, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { useGetPoliciesByCategory } from '../hooks/usePolicies';
import { PolicyCategory } from '../backend';
import { getCategoryInfo } from '../constants/categories';
import { useLanguage } from '../i18n/LanguageProvider';
import { useCompareSelection } from '../state/compareSelection';

export default function CategoryPoliciesPage() {
  const { categoryId } = useParams({ from: '/categories/$categoryId' });
  const { data: policies = [], isLoading } = useGetPoliciesByCategory(categoryId as PolicyCategory);
  const { t, language } = useLanguage();
  const { selectedPolicies, addPolicy, removePolicy, isSelected } = useCompareSelection();

  const categoryInfo = getCategoryInfo(categoryId as PolicyCategory);
  const categoryName = categoryInfo ? (language === 'hi' ? categoryInfo.nameHi : categoryInfo.nameEn) : categoryId;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t('common.loading')}</p>
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
        <div>
          <h1 className="text-2xl font-bold">{categoryName}</h1>
          <p className="text-sm text-muted-foreground">{policies.length} policies available</p>
        </div>
      </div>

      {policies.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{t('policy.noPolicies')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {policies.map((policy) => {
            const selected = isSelected(policy.id);
            return (
              <Card key={policy.id.toString()} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{policy.name}</CardTitle>
                      <CardDescription className="mt-1">
                        <span className="text-2xl font-bold text-primary">₹{policy.price.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground">{t('policy.perYear')}</span>
                      </CardDescription>
                    </div>
                    <Button
                      variant={selected ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={() => (selected ? removePolicy(policy.id) : addPolicy(policy.id))}
                    >
                      {selected ? <Minus className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                      {selected ? t('policy.removeFromCompare') : t('policy.addToCompare')}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold mb-1">{t('policy.coverage')}</p>
                    <p className="text-sm text-muted-foreground">{policy.coverage}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">{t('policy.benefits')}</p>
                    <p className="text-sm text-muted-foreground">{policy.benefits}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link to="/policy/$policyId" params={{ policyId: policy.id.toString() }} className="flex-1">
                      <Button variant="outline" className="w-full">
                        {t('policy.viewDetails')}
                      </Button>
                    </Link>
                    <Link to="/lead/$policyId" params={{ policyId: policy.id.toString() }} className="flex-1">
                      <Button className="w-full">{t('policy.applyNow')}</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedPolicies.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t">
          <div className="container max-w-4xl mx-auto">
            <Link to="/compare">
              <Button className="w-full" size="lg">
                {t('compare.compareNow')} ({selectedPolicies.length})
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
