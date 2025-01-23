"use client";

import { getWorkspaces } from "@/lib/actions/workspace";
import { useCreateWorkspaceModal } from "@/lib/store/useCreateWorkspaceModal";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSkipUseEffect } from "@/lib/store/useSkipUseEffect";
import { Loader2 } from "lucide-react";

const Home = () => {
  const router = useRouter();

  const { open, setOpen } = useCreateWorkspaceModal();
  const { skip } = useSkipUseEffect();

  const { isPending, data: workspaces } = useQuery({
    queryKey: ["workspaces"],
    queryFn: () => getWorkspaces(),
  });

  const workspaceId = workspaces?.[0]?.id;

  useEffect(() => {
    if (skip) {
      return;
    }

    if (isPending) {
      return;
    }

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [workspaceId, isPending, router, setOpen, open, skip]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  );
};

export default Home;
