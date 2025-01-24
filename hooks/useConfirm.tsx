import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const useConfirm = (
  title: string,
  message: string,
): [() => React.ReactNode, () => Promise<unknown>] => {
  const [confirmPromise, setConfirmPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () =>
    new Promise<boolean>((resolve) => {
      setConfirmPromise({ resolve });
    });

  const handleClose = () => {
    setConfirmPromise(null);
  };

  const handleCancel = () => {
    confirmPromise?.resolve(false);
    handleClose();
  };

  const handleConfirm = () => {
    confirmPromise?.resolve(true);
    handleClose();
  };

  const ConfirmDialog = () => (
    <Dialog open={!!confirmPromise} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmDialog, confirm];
};
