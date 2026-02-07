import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, Info } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { useLanguage } from '../i18n/LanguageProvider';
import { getCategoryInfo } from '../constants/categories';

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useNotifications();
  const { t, language } = useLanguage();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">{t('notifications.title')}</h1>
        <p className="text-muted-foreground">{t('notifications.subtitle')}</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">{t('notifications.inAppOnly')}</AlertDescription>
      </Alert>

      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{t('common.loading')}</p>
          </CardContent>
        </Card>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">{t('notifications.noNotifications')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const categoryInfo = getCategoryInfo(notification.category);
            const categoryName = categoryInfo ? (language === 'hi' ? categoryInfo.nameHi : categoryInfo.nameEn) : '';
            return (
              <Card key={notification.id.toString()}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{notification.message}</CardTitle>
                    <Badge variant="outline">{categoryName}</Badge>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
