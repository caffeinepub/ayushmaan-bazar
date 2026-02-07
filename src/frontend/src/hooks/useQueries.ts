import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppActor } from './useAppActor';
import type { UserProfile, CustomerDetails } from '../backend';

export function useSaveUserProfile() {
  const { actor } = useAppActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useSubmitLead() {
  const { actor } = useAppActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ policyId, customerDetails }: { policyId: bigint; customerDetails: CustomerDetails }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitLead(policyId, customerDetails);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
    },
  });
}

export function useRequestCallback() {
  const { actor } = useAppActor();

  return useMutation({
    mutationFn: async (customerDetails: CustomerDetails) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestCallback(customerDetails);
    },
  });
}

export function useGetRewards() {
  const { actor, isFetching: actorFetching } = useAppActor();

  return useQuery<number>({
    queryKey: ['rewards'],
    queryFn: async () => {
      if (!actor) return 0;
      return actor.getRewards();
    },
    enabled: !!actor && !actorFetching,
  });
}
