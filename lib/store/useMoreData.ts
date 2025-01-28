import { create } from "zustand";

interface MoreDataDataState {
  moreData: boolean;
  setMoreData: (open: boolean) => void;
}

export const useMoreData = create<MoreDataDataState>()((set) => ({
  moreData: false,
  setMoreData: (newMoreData) => set(() => ({ moreData: newMoreData })),
}));
