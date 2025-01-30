import { useParams } from "next/navigation";

export const useMemberId = (): string | null => {
  const params = useParams();
  const workspaceId = params.memberId as string;
  return workspaceId;
};
