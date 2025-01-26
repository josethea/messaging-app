import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { getCurrentMember } from "../actions/member";
import { useEffect } from "react";

interface DataState {
  currentMember: Member | null;
  setCurrentMember: (member: Member | null) => void;
}

export const useCurrentMemberStore = create<DataState>()((set) => ({
  currentMember: null,
  setCurrentMember: (newCurrentMember) =>
    set({ currentMember: newCurrentMember }),
}));

export const useCurrentMember = (workspaceId: string | null) => {
  const setCurrentMember = useCurrentMemberStore(
    (state: DataState) => state.setCurrentMember,
  );

  const query = useQuery({
    queryKey: ["currentMember", workspaceId],
    queryFn: () => getCurrentMember(workspaceId),
    enabled: !!workspaceId,
  });

  useEffect(() => {
    if (query.data) {
      setCurrentMember(query.data);
    }
  }, [query.data, setCurrentMember]);

  return query;
};
