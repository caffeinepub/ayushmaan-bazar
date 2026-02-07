import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useCurrentUserProfile } from '../../hooks/useCurrentUserProfile';
import { useSaveUserProfile } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '../../i18n/LanguageProvider';
import { validateMobile } from '../../utils/validation';

export default function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useCurrentUserProfile();
  const saveProfile = useSaveUserProfile();
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [errors, setErrors] = useState<{ name?: string; mobile?: string }>({});

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  useEffect(() => {
    if (!showProfileSetup) {
      setName('');
      setMobile('');
      setReferralCode('');
      setErrors({});
    }
  }, [showProfileSetup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; mobile?: string } = {};

    if (!name.trim()) {
      newErrors.name = t('profile.nameRequired');
    }

    if (mobile && !validateMobile(mobile)) {
      newErrors.mobile = t('profile.mobileInvalid');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const referralCodeGenerated = Math.random().toString(36).substring(2, 10).toUpperCase();

    await saveProfile.mutateAsync({
      name: name.trim(),
      mobile: mobile.trim() || undefined,
      referralCode: referralCodeGenerated,
      referredBy: referralCode.trim() || undefined,
    });
  };

  return (
    <Dialog open={showProfileSetup}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t('profile.setupTitle')}</DialogTitle>
          <DialogDescription>{t('profile.setupDescription')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('profile.name')} *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('profile.namePlaceholder')}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">{t('profile.mobile')} ({t('profile.optional')})</Label>
            <Input
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder={t('profile.mobilePlaceholder')}
            />
            {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="referralCode">{t('profile.referralCode')} ({t('profile.optional')})</Label>
            <Input
              id="referralCode"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder={t('profile.referralCodePlaceholder')}
            />
          </div>
          <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
            {saveProfile.isPending ? t('profile.saving') : t('profile.continue')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
