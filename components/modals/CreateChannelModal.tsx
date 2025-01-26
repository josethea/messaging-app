import React from "react";
import {
  DialogDescription,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createChannelSchema } from "@/lib/validations";
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
import { useCreateChannelModal } from "@/lib/store/useCreateChannelModal";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { createChannel } from "@/lib/actions/channel";
import { useChannelsStore } from "@/lib/store/useChannels";

const CreateChannelModal = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { open, setOpen } = useCreateChannelModal();
  const channels = useChannelsStore((data) => data.channels);
  const setChannels = useChannelsStore((data) => data.setChannels);

  const form = useForm({
    resolver: zodResolver(createChannelSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createChannel,
  });

  const handleSubmit = async (data: z.infer<typeof createChannelSchema>) => {
    if (!workspaceId) return;

    const newChannel = await mutateAsync({
      ...data,
      workspaceId,
    });

    if (newChannel) {
      toast({
        title: "Success",
        description: "Channel created successfully",
      });
      router.replace(`/workspace/${workspaceId}/channel/${newChannel.id}`);
      setChannels([newChannel, ...channels]);
      handleClose();
    } else {
      toast({
        title: "Error",
        description: "An error occurred while creating the channel",
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
              <DialogTitle>Add a Channel</DialogTitle>
              <DialogDescription>Create a new channel.</DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Channel name e.g. 'General', 'Random', 'Work'"
                      autoFocus
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter a description for the channel"
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

export default CreateChannelModal;
