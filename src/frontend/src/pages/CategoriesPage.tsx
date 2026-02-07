import { useNavigate } from '@tanstack/react-router';
import IconTile from '../components/category/IconTile';
import { CATEGORIES } from '../constants/categories';
import { useLanguage } from '../i18n/LanguageProvider';

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">{t('categories.title')}</h1>
        <p className="text-muted-foreground">{t('categories.subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CATEGORIES.map((category) => (
          <IconTile
            key={category.id}
            icon={category.icon}
            label={language === 'hi' ? category.nameHi : category.nameEn}
            onClick={() => navigate({ to: '/categories/$categoryId', params: { categoryId: category.id } })}
          />
        ))}
      </div>
    </div>
  );
}
