import React from "react";
import {
  DialogDescription,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCreateWorkspaceModal } from "@/lib/store/useCreateWorkspaceModal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWorkspaceSchema } from "@/lib/validations";
import { createWorkspace } from "@/lib/actions/workspace";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useSkipUseEffect } from "@/lib/store/useSkipUseEffect";

const CreateWorkspaceModal = () => {
  const router = useRouter();
  const { open, setOpen } = useCreateWorkspaceModal();
  const { skip, setSkip } = useSkipUseEffect();

  const form = useForm({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createWorkspace,
  });

  const handleSubmit = async (data: z.infer<typeof createWorkspaceSchema>) => {
    const workspaceId = await mutateAsync(data);

    if (workspaceId) {
      toast({
        title: "Success",
        description: "Workspace created successfully",
      });
      router.replace(`/workspace/${workspaceId}`);
      if (!skip) {
        setSkip(true);
      }
      handleClose();
    } else {
      toast({
        title: "Error",
        description: "An error occurred while creating the workspace",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <DialogHeader>
              <DialogTitle>Add a Workspace</DialogTitle>
              <DialogDescription>
                Create a new workspace to get started.
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                      autoFocus
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={isPending} type="submit">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceModal;
