import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { getMembers } from "../actions/member";
import { useEffect } from "react";

interface DataState {
  members: MemberPopulate[];
  setMembers: (members: MemberPopulate[]) => void;
  updateMember: (member: MemberPopulate) => void;
}

export const useMemberssStore = create<DataState>()((set) => ({
  members: [],
  setMembers: (newMembers) => set({ members: newMembers }),
  updateMember: (updatedMember) =>
    set((state) => ({
      members: state.members.map((item) =>
        item.id === updatedMember.id ? updatedMember : item,
      ),
    })),
}));

export const useMembers = (workspaceId: string | null) => {
  const setMembers = useMemberssStore((state: DataState) => state.setMembers);

  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: () => getMembers(workspaceId),
    enabled: !!workspaceId,
  });

  useEffect(() => {
    if (query.data) {
      setMembers(query.data);
    }
  }, [query.data, setMembers]);

  return query;
};
