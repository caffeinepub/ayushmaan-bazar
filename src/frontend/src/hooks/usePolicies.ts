import { useQuery } from '@tanstack/react-query';
import { useAppActor } from './useAppActor';
import type { Policy, PolicyCategory } from '../backend';

export function useGetPoliciesByCategory(category: PolicyCategory) {
  const { actor, isFetching: actorFetching } = useAppActor();

  return useQuery<Policy[]>({
    queryKey: ['policies', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPoliciesByCategory(category);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetPolicy(policyId: bigint) {
  const { actor, isFetching: actorFetching } = useAppActor();

  return useQuery<Policy | null>({
    queryKey: ['policy', policyId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getPolicy(policyId);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !actorFetching && policyId > 0n,
  });
}

export function useComparePolicies(policyIds: bigint[]) {
  const { actor, isFetching: actorFetching } = useAppActor();

  return useQuery<Policy[]>({
    queryKey: ['comparePolicies', policyIds.map((id) => id.toString())],
    queryFn: async () => {
      if (!actor || policyIds.length === 0) return [];
      return actor.comparePolicies(policyIds);
    },
    enabled: !!actor && !actorFetching && policyIds.length > 0,
  });
}
