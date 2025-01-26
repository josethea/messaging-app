import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { getWorkspaces } from "../actions/workspace";
import { useEffect } from "react";

interface DataState {
  workspaces: Workspace[];
  setWorkspaces: (workspaces: Workspace[]) => void;
  updateWorkspace: (workspace: Workspace) => void;
}

export const useWorkspacesStore = create<DataState>()((set) => ({
  workspaces: [],
  setWorkspaces: (newWorkspaces) => set({ workspaces: newWorkspaces }),
  updateWorkspace: (updatedWorkspace) =>
    set((state) => ({
      workspaces: state.workspaces.map((item) =>
        item.id === updatedWorkspace.id ? updatedWorkspace : item,
      ),
    })),
}));

export const useWorkspaces = () => {
  const setWorkspaces = useWorkspacesStore(
    (state: DataState) => state.setWorkspaces,
  );

  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: () => getWorkspaces(),
  });

  useEffect(() => {
    if (query.data) {
      setWorkspaces(query.data);
    }
  }, [query.data, setWorkspaces]);

  return query;
};
