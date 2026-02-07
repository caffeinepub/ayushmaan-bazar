import { useQuery } from '@tanstack/react-query';
import { useAppActor } from './useAppActor';
import type { Notification } from '../backend';

export function useNotifications() {
  const { actor, isFetching: actorFetching } = useAppActor();

  return useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotifications();
    },
    enabled: !!actor && !actorFetching,
  });
}
