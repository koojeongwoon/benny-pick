export const usePolicyStore = () => {
  return useState("policy-store", () => ({
    policies: [] as any[],
    intent: {} as any,
  }));
};

export const setPolicyData = (policies: any[], intent: any) => {
  const store = usePolicyStore();
  store.value.policies = policies;
  store.value.intent = intent;
};
