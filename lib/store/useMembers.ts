import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { getMembers } from "../actions/member";
import { useEffect } from "react";

interface DataState {
  members: MemberPopulate[];
  currentChatMember: MemberPopulate | null;
  setMembers: (members: MemberPopulate[]) => void;
  setCurrentChatMember: (currentChatMemberId: string) => void;
  updateMember: (member: MemberPopulate) => void;
}

export const useMemberssStore = create<DataState>()((set) => ({
  members: [],
  currentChatMember: null,
  setMembers: (newMembers) => set({ members: newMembers }),
  setCurrentChatMember: (currentChatMemberId) =>
    set((state) => ({
      currentChatMember:
        state.members.find((item) => item.id === currentChatMemberId) || null,
    })),
  updateMember: (updatedMember) =>
    set((state) => ({
      members: state.members.map((item) =>
        item.id === updatedMember.id ? updatedMember : item,
      ),
    })),
}));

export const useMembers = (
  workspaceId: string | null,
  memberId: string | null,
) => {
  const setMembers = useMemberssStore((state: DataState) => state.setMembers);
  const setCurrentChatMember = useMemberssStore(
    (state) => state.setCurrentChatMember,
  );

  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: () => getMembers(workspaceId),
    enabled: !!workspaceId,
  });

  useEffect(() => {
    if (query.data) {
      setMembers(query.data);
      if (memberId) {
        setCurrentChatMember(memberId as string);
      }
    }
  }, [query.data, setMembers, setCurrentChatMember, memberId]);

  return query;
};
