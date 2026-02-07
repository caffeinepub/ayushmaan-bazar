import { PolicyCategory } from '../backend';

export interface CategoryInfo {
  id: PolicyCategory;
  nameEn: string;
  nameHi: string;
  icon: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: PolicyCategory.life,
    nameEn: 'Life Insurance',
    nameHi: 'जीवन बीमा',
    icon: '/assets/generated/icon-life.dim_256x256.png',
  },
  {
    id: PolicyCategory.health,
    nameEn: 'Health Insurance',
    nameHi: 'स्वास्थ्य बीमा',
    icon: '/assets/generated/icon-health.dim_256x256.png',
  },
  {
    id: PolicyCategory.motor,
    nameEn: 'Motor Insurance',
    nameHi: 'मोटर बीमा',
    icon: '/assets/generated/icon-motor.dim_256x256.png',
  },
  {
    id: PolicyCategory.termPlan,
    nameEn: 'Term Plan',
    nameHi: 'टर्म प्लान',
    icon: '/assets/generated/icon-term.dim_256x256.png',
  },
  {
    id: PolicyCategory.travel,
    nameEn: 'Travel Insurance',
    nameHi: 'यात्रा बीमा',
    icon: '/assets/generated/icon-travel.dim_256x256.png',
  },
  {
    id: PolicyCategory.otherGeneral,
    nameEn: 'General Insurance',
    nameHi: 'सामान्य बीमा',
    icon: '/assets/generated/icon-general.dim_256x256.png',
  },
];

export function getCategoryInfo(id: PolicyCategory): CategoryInfo | undefined {
  return CATEGORIES.find((cat) => cat.id === id);
}
