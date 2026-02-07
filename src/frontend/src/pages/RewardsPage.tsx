import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Gift, Copy, AlertCircle } from 'lucide-react';
import { useGetRewards } from '../hooks/useQueries';
import { useCurrentUserProfile } from '../hooks/useCurrentUserProfile';
import { useLanguage } from '../i18n/LanguageProvider';
import { toast } from 'sonner';

export default function RewardsPage() {
  const { data: rewards = 0, isLoading } = useGetRewards();
  const { data: profile } = useCurrentUserProfile();
  const { t } = useLanguage();
  const [referralInput, setReferralInput] = useState('');

  const handleCopyCode = () => {
    if (profile?.referralCode) {
      navigator.clipboard.writeText(profile.referralCode);
      toast.success(t('rewards.codeCopied'));
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">{t('rewards.title')}</h1>
        <p className="text-muted-foreground">{t('rewards.subtitle')}</p>
      </div>

      <Alert className="border-primary/20 bg-primary/5">
        <AlertCircle className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">{t('rewards.complianceNote')}</AlertDescription>
      </Alert>

      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            {t('rewards.balance')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">{t('common.loading')}</p>
          ) : (
            <p className="text-4xl font-bold text-primary">₹{rewards.toLocaleString()}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('rewards.referral')}</CardTitle>
          <CardDescription>{t('rewards.yourCode')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile?.referralCode && (
            <div className="flex gap-2">
              <Input value={profile.referralCode} readOnly className="font-mono text-lg" />
              <Button variant="outline" size="icon" onClick={handleCopyCode}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}

          {profile?.referredBy ? (
            <Alert>
              <AlertDescription>{t('rewards.codeAlreadySaved')}</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('rewards.enterCode')}</p>
              <div className="flex gap-2">
                <Input
                  value={referralInput}
                  onChange={(e) => setReferralInput(e.target.value)}
                  placeholder={t('rewards.enterCodePlaceholder')}
                />
                <Button variant="outline">{t('rewards.saveCode')}</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('rewards.activity')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">{t('rewards.noActivity')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
