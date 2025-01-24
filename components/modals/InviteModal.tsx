"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useConfirm } from "@/hooks/useConfirm";
import { useMutation } from "@tanstack/react-query";
import { updateJoinCode } from "@/lib/actions/workspace";

const InviteModal = ({
  open,
  setOpen,
  name,
  joinCode,
  workspaceId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string | null;
  joinCode: string | null;
  workspaceId: string | null;
}) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will deactive the current invite code and generate a new one",
  );

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => updateJoinCode(workspaceId),
  });

  const handleNewCode = async () => {
    const ok = await confirm();

    if (!ok) return;

    const newJoinCode = await mutateAsync();

    console.log(newJoinCode);

    if (newJoinCode) {
      toast({
        title: "Success",
        description: "New invite code generated",
      });
    } else {
      toast({
        title: "Error",
        description: "An error occurred while generating a new invite code",
        variant: "destructive",
      });
    }
  };

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/invite/${workspaceId}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this link with your friends and family",
      });
    });
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to "{name}"</DialogTitle>
            <DialogDescription>
              Use the code below to invite people to the workspace
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center w-full py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              disabled={isPending}
            >
              Copy link
              <CopyIcon className="size-4" />
            </Button>
          </div>
          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <Button
                onClick={handleNewCode}
                variant="outline"
                disabled={isPending}
              >
                New Code
                <RefreshCcw className="size-4" />
              </Button>
              <DialogClose asChild>
                <Button disabled={isPending}>Close</Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteModal;
