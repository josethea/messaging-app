"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { getWorkspaceInfo, joinWorkspace } from "@/lib/actions/workspace";
import { useWorkspacesStore } from "@/lib/store/useWorkspaces";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, MessageSquareCode } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [opt, setOpt] = useState("");

  const { mutateAsync, isPending: isPendingJoinWorkspace } = useMutation({
    mutationFn: (joinCode: string) => joinWorkspace(workspaceId, joinCode),
  });

  const { isPending: isPendingWorkspaceInfo, data } = useQuery({
    queryKey: ["workspaceInfo", workspaceId],
    queryFn: () => getWorkspaceInfo(workspaceId),
    enabled: !!workspaceId,
  });

  const workspaces = useWorkspacesStore((state) => state.workspaces);
  const setWorkspaces = useWorkspacesStore((state) => state.setWorkspaces);

  useEffect(() => {
    if (isPendingWorkspaceInfo) {
      return;
    }

    if (data?.isMember) {
      router.push(`/workspace/${workspaceId}`);
    }
  }, [isPendingWorkspaceInfo, data?.isMember, router, workspaceId]);

  const handleOTPComplete = useCallback(async (value: string) => {
    if (value.length === 6) {
      const result = await mutateAsync(value);
      if (result) {
        toast({
          title: "Success",
          description: "Workspaces joined",
        });
        setWorkspaces([...workspaces, result]);
        router.replace(`/workspace/${result.id}`);
      } else {
        toast({
          title: "Error",
          description: "Failed to join workspace",
          variant: "destructive",
        });
      }
    }
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      {isPendingWorkspaceInfo ? (
        <Loader2 className="h-10 w-10 animate-spin" />
      ) : data?.name ? (
        <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
          <MessageSquareCode className="h-20 w-20" />
          <div className="flex flex-col gap-y-2 items-center justify-center">
            <h1 className="text-2xl font-bold">Join {data?.name}</h1>
            <p className="text-md text-muted-foreground">
              Enter the workspace code to join
            </p>
          </div>
          <InputOTP
            maxLength={6}
            value={opt}
            disabled={isPendingJoinWorkspace}
            onChange={(value) => {
              const upperValue = value.toUpperCase();
              setOpt(upperValue);
              handleOTPComplete(upperValue);
            }}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <div className="flex gap-x-4">
            <Button
              size="lg"
              variant="outline"
              disabled={isPendingJoinWorkspace}
              onClick={() => router.push("/")}
            >
              Home
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-y-8 items-center justify-center">
          <h1 className="text-2xl font-bold">No workspace found</h1>
          <div className="flex gap-x-4">
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/")}
            >
              Home
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
