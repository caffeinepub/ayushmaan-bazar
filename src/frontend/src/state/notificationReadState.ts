export function getReadNotifications(): Set<string> {
  const stored = localStorage.getItem('readNotifications');
  if (stored) {
    try {
      return new Set(JSON.parse(stored));
    } catch {
      return new Set();
    }
  }
  return new Set();
}

export function markNotificationAsRead(notificationId: string) {
  const read = getReadNotifications();
  read.add(notificationId);
  localStorage.setItem('readNotifications', JSON.stringify([...read]));
}

export function isNotificationRead(notificationId: string): boolean {
  return getReadNotifications().has(notificationId);
}
