"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { fetchApi } from "@/services/fetchApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: () => void;
  cityCouncilId: string;
  legislativeMatterId: string
}

export function ConfirmDeletionMatterDialog({
  open,
  onOpenChange,
  legislativeMatterId,
  cityCouncilId
}: AddUserDialogProps) {
  const router = useRouter();

  async function onSubmit() {
    const response = await fetchApi(`/legislative-matter/${legislativeMatterId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error, {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    toast.success("Matéria deletada com sucesso", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });

    router.push(`/app/city-councils/${cityCouncilId}/legislative-matters`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deletar matéria</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Ao deletar a matéria todos os dados da mesma serão excluidos
        </DialogDescription>

        <div className="flex flex-col gap-4">
          <Button variant="destructive" className="float-right" type="submit" onClick={onSubmit}>
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
