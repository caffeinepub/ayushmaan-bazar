import { useState, useEffect } from 'react';

export function useCompareSelection() {
  const [selectedPolicies, setSelectedPolicies] = useState<bigint[]>(() => {
    const stored = localStorage.getItem('compareSelection');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((id: string) => BigInt(id));
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('compareSelection', JSON.stringify(selectedPolicies.map((id) => id.toString())));
  }, [selectedPolicies]);

  const addPolicy = (policyId: bigint) => {
    setSelectedPolicies((prev) => {
      if (prev.some((id) => id === policyId)) return prev;
      return [...prev, policyId];
    });
  };

  const removePolicy = (policyId: bigint) => {
    setSelectedPolicies((prev) => prev.filter((id) => id !== policyId));
  };

  const clearAll = () => {
    setSelectedPolicies([]);
  };

  const isSelected = (policyId: bigint) => {
    return selectedPolicies.some((id) => id === policyId);
  };

  return {
    selectedPolicies,
    addPolicy,
    removePolicy,
    clearAll,
    isSelected,
  };
}
