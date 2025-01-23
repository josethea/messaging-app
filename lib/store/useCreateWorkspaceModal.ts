import { create } from "zustand";

interface CreateWorkspaceModalState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useCreateWorkspaceModal = create<CreateWorkspaceModalState>()(
  (set) => ({
    open: false,
    setOpen: (newOpen) => set(() => ({ open: newOpen })),
  }),
);
