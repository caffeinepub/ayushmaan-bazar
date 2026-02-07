import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useGetPolicy } from '../hooks/usePolicies';
import { useSubmitLead } from '../hooks/useQueries';
import { useLanguage } from '../i18n/LanguageProvider';
import { validateMobile } from '../utils/validation';

export default function LeadFormPage() {
  const { policyId } = useParams({ from: '/lead/$policyId' });
  const { data: policy } = useGetPolicy(BigInt(policyId));
  const submitLead = useSubmitLead();
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

    await submitLead.mutateAsync({
      policyId: BigInt(policyId),
      customerDetails: {
        name: name.trim(),
        mobile: mobile.trim(),
        contactTime: contactTime.trim(),
        notes: notes.trim(),
      },
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container max-w-md mx-auto px-4 py-12">
        <Card className="text-center">
          <CardContent className="py-12 space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">{t('lead.success')}</h2>
            <p className="text-muted-foreground">{t('lead.successMessage')}</p>
            <Link to="/">
              <Button className="w-full">{t('lead.backToHome')}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/policy/$policyId" params={{ policyId }}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{t('lead.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('lead.subtitle')}</p>
        </div>
      </div>

      {policy && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{policy.name}</CardTitle>
            <CardDescription>₹{policy.price.toLocaleString()}{t('policy.perYear')}</CardDescription>
          </CardHeader>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t('lead.name')} *</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobile">{t('lead.mobile')} *</Label>
          <Input id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
          {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactTime">{t('lead.contactTime')} *</Label>
          <Input id="contactTime" value={contactTime} onChange={(e) => setContactTime(e.target.value)} placeholder="e.g., 10 AM - 12 PM" />
          {errors.contactTime && <p className="text-sm text-destructive">{errors.contactTime}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">{t('lead.notes')}</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('lead.notesPlaceholder')} rows={4} />
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={submitLead.isPending}>
          {submitLead.isPending ? t('lead.submitting') : t('lead.submit')}
        </Button>
      </form>
    </div>
  );
}
