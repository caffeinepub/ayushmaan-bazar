import { useLanguage } from '../../i18n/LanguageProvider';
import { Button } from '@/components/ui/button';

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{t('support.language')}:</span>
      <div className="flex gap-1 bg-muted rounded-lg p-1">
        <Button
          variant={language === 'en' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage('en')}
          className="h-8"
        >
          English
        </Button>
        <Button
          variant={language === 'hi' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage('hi')}
          className="h-8"
        >
          हिंदी
        </Button>
      </div>
    </div>
  );
}
