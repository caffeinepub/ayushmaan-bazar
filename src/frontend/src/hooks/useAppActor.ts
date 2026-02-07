import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { HttpAgent, Actor } from '@dfinity/agent';
import { useInternetIdentity } from './useInternetIdentity';
import type { backendInterface } from '../backend';

// Get canister configuration from environment
const canisterId = import.meta.env.VITE_CANISTER_ID_BACKEND || 
                   import.meta.env.CANISTER_ID_BACKEND ||
                   'rrkah-fqaaa-aaaaa-aaaaq-cai'; // fallback for local development

const host = import.meta.env.VITE_DFX_NETWORK === 'local' 
  ? 'http://localhost:4943' 
  : 'https://icp-api.io';

// IDL Factory - this would normally come from generated declarations
// For now, we'll create a minimal factory that matches the backend interface
const createIdlFactory = ({ IDL }: any) => {
  const PolicyCategory = IDL.Variant({
    'life': IDL.Null,
    'health': IDL.Null,
    'motor': IDL.Null,
    'termPlan': IDL.Null,
    'travel': IDL.Null,
    'otherGeneral': IDL.Null,
  });

  const UserRole = IDL.Variant({
    'admin': IDL.Null,
    'user': IDL.Null,
    'guest': IDL.Null,
  });

  const UserProfile = IDL.Record({
    'referralCode': IDL.Text,
    'name': IDL.Text,
    'referredBy': IDL.Opt(IDL.Text),
    'mobile': IDL.Opt(IDL.Text),
  });

  const CustomerDetails = IDL.Record({
    'contactTime': IDL.Text,
    'name': IDL.Text,
    'notes': IDL.Text,
    'mobile': IDL.Text,
  });

  const Policy = IDL.Record({
    'id': IDL.Nat,
    'name': IDL.Text,
    'category': PolicyCategory,
    'benefits': IDL.Text,
    'coverage': IDL.Text,
    'price': IDL.Float64,
  });

  const Notification = IDL.Record({
    'id': IDL.Nat,
    'message': IDL.Text,
    'category': PolicyCategory,
  });

  const PolicyIssuanceConfirmation = IDL.Record({
    'rewardAmount': IDL.Float64,
    'policyId': IDL.Nat,
  });

  return IDL.Service({
    'addNotification': IDL.Func([IDL.Text, PolicyCategory], [], []),
    'assignCallerUserRole': IDL.Func([IDL.Principal, UserRole], [], []),
    'comparePolicies': IDL.Func([IDL.Vec(IDL.Nat)], [IDL.Vec(Policy)], ['query']),
    'confirmPolicyIssuance': IDL.Func([IDL.Nat], [PolicyIssuanceConfirmation], []),
    'getCallerUserProfile': IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
    'getCallerUserRole': IDL.Func([], [UserRole], ['query']),
    'getNotifications': IDL.Func([], [IDL.Vec(Notification)], ['query']),
    'getPoliciesByCategory': IDL.Func([PolicyCategory], [IDL.Vec(Policy)], ['query']),
    'getPolicy': IDL.Func([IDL.Nat], [Policy], ['query']),
    'getRewards': IDL.Func([], [IDL.Float64], ['query']),
    'getUserProfile': IDL.Func([IDL.Principal], [IDL.Opt(UserProfile)], ['query']),
    'isCallerAdmin': IDL.Func([], [IDL.Bool], ['query']),
    'requestCallback': IDL.Func([CustomerDetails], [IDL.Nat], []),
    'saveCallerUserProfile': IDL.Func([UserProfile], [], []),
    'submitLead': IDL.Func([IDL.Nat, CustomerDetails], [IDL.Nat], []),
    'updateRewardPercentage': IDL.Func([IDL.Float64], [], []),
  });
};

async function createActorWithIdentity(identity: any): Promise<backendInterface> {
  const agent = await HttpAgent.create({
    host,
    identity,
  });

  if (import.meta.env.VITE_DFX_NETWORK !== 'ic') {
    await agent.fetchRootKey().catch((err) => {
      console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
      console.error(err);
    });
  }

  return Actor.createActor(createIdlFactory, {
    agent,
    canisterId,
  }) as backendInterface;
}

export function useAppActor() {
  const { identity, isInitializing } = useInternetIdentity();
  const queryClient = useQueryClient();
  
  const principalKey = identity?.getPrincipal().toString() ?? 'anonymous';

  const query = useQuery({
    queryKey: ['actor', principalKey],
    queryFn: async () => {
      return createActorWithIdentity(identity ?? undefined);
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // When actor changes (identity change), invalidate all dependent queries
  const previousPrincipal = React.useRef<string>(principalKey);
  
  React.useEffect(() => {
    if (previousPrincipal.current !== principalKey && query.data) {
      // Identity changed, invalidate all queries except the actor query itself
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] !== 'actor',
      });
      previousPrincipal.current = principalKey;
    }
  }, [principalKey, query.data, queryClient]);

  return {
    actor: query.data ?? null,
    isFetching: isInitializing || query.isFetching,
    isLoading: isInitializing || query.isLoading,
    error: query.error,
  };
}
