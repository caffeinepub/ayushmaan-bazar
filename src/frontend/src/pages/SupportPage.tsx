import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageProvider';
import LanguageToggle from '../components/settings/LanguageToggle';
import CallbackRequestForm from '../components/support/CallbackRequestForm';

export default function SupportPage() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 3000);
  };

  const faqs = [
    {
      question: 'How do Reward Benefits work?',
      answer: 'Reward Benefits are promotional benefits credited to your account after policy issuance confirmation. They are not guaranteed and depend on the commission received from insurance companies.',
    },
    {
      question: 'When will I receive my Reward Benefit?',
      answer: 'Reward Benefits are credited only after the insurance company confirms policy issuance. This typically takes 7-14 business days after policy purchase.',
    },
    {
      question: 'Is Ayushmaan Bazar an insurance company?',
      answer: 'No, Ayushmaan Bazar is an insurance facilitator. We help you compare and apply for policies from various insurance companies. We are not an insurance company ourselves.',
    },
    {
      question: 'How can I track my application?',
      answer: 'You can view all your submitted applications in the My Leads section. We will also send you notifications about status updates.',
    },
  ];

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">{t('support.title')}</h1>
        <p className="text-muted-foreground">{t('support.subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('support.language')}</CardTitle>
        </CardHeader>
        <CardContent>
          <LanguageToggle />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('support.faq')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <CallbackRequestForm />

      <Card>
        <CardHeader>
          <CardTitle>{t('support.contact')}</CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <p className="font-semibold">{t('support.success')}</p>
              <p className="text-sm text-muted-foreground">{t('support.successMessage')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('profile.name')}</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} required />
              </div>
              <Button type="submit" className="w-full">
                {t('support.submit')}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
