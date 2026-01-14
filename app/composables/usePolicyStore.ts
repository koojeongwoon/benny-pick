// 백엔드 API PolicySource 타입
export interface PolicySource {
  id: string;
  title: string;
  score: number;
  description: string;
  benefit_summary: string;
  category: string;
  region: string;
  apply_url: string;
  ministry: string;
  phone: string;
}

export const usePolicyStore = () => {
  return useState("policy-store", () => ({
    policies: [] as PolicySource[],
    intent: {} as Record<string, unknown>,
  }));
};

export const setPolicyData = (policies: PolicySource[], intent: Record<string, unknown>) => {
  const store = usePolicyStore();
  store.value.policies = policies;
  store.value.intent = intent;
};
