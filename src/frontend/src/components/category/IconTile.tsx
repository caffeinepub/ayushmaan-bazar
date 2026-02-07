import { Card } from '@/components/ui/card';

interface IconTileProps {
  icon: string;
  label: string;
  onClick: () => void;
}

export default function IconTile({ icon, label, onClick }: IconTileProps) {
  return (
    <Card
      className="flex flex-col items-center justify-center p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
      onClick={onClick}
    >
      <img src={icon} alt={label} className="w-16 h-16 mb-3" />
      <span className="text-sm font-semibold text-center">{label}</span>
    </Card>
  );
}
