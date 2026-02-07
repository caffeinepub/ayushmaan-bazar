import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle } from 'lucide-react';
import { useRequestCallback } from '../../hooks/useQueries';
import { useLanguage } from '../../i18n/LanguageProvider';
import { validateMobile } from '../../utils/validation';

export default function CallbackRequestForm() {
  const requestCallback = useRequestCallback();
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [contactTime, setContactTime] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ name?: string; mobile?: string; contactTime?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; mobile?: string; contactTime?: string } = {};

    if (!name.trim()) newErrors.name = t('profile.nameRequired');
    if (!mobile || !validateMobile(mobile)) newErrors.mobile = t('profile.mobileInvalid');
    if (!contactTime.trim()) newErrors.contactTime = 'Contact time is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await requestCallback.mutateAsync({
      name: name.trim(),
      mobile: mobile.trim(),
      contactTime: contactTime.trim(),
      notes: notes.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setMobile('');
      setContactTime('');
      setNotes('');
    }, 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('callback.title')}</CardTitle>
        <CardDescription>{t('callback.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <p className="font-semibold">{t('callback.success')}</p>
            <p className="text-sm text-muted-foreground">{t('callback.successMessage')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cb-name">{t('lead.name')} *</Label>
              <Input id="cb-name" value={name} onChange={(e) => setName(e.target.value)} />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cb-mobile">{t('lead.mobile')} *</Label>
              <Input id="cb-mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
              {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cb-contactTime">{t('lead.contactTime')} *</Label>
              <Input id="cb-contactTime" value={contactTime} onChange={(e) => setContactTime(e.target.value)} placeholder="e.g., 10 AM - 12 PM" />
              {errors.contactTime && <p className="text-sm text-destructive">{errors.contactTime}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cb-notes">{t('lead.notes')}</Label>
              <Textarea id="cb-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
            </div>

            <Button type="submit" className="w-full" disabled={requestCallback.isPending}>
              {requestCallback.isPending ? t('callback.submitting') : t('callback.submit')}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
