import { create } from "zustand";

interface CreateChannelModalState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useCreateChannelModal = create<CreateChannelModalState>()(
  (set) => ({
    open: false,
    setOpen: (newOpen) => set(() => ({ open: newOpen })),
  }),
);
