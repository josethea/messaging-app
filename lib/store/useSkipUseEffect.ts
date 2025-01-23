import { create } from "zustand";

interface CreateSkipUseEffectState {
  skip: boolean;
  setSkip: (skip: boolean) => void;
}

export const useSkipUseEffect = create<CreateSkipUseEffectState>()((set) => ({
  skip: false,
  setSkip: (newSkip) => set(() => ({ skip: newSkip })),
}));
