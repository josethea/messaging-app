import { useParams } from "next/navigation";

export const useWorkspaceId = (): string | null => {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  return workspaceId;
};
