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
  cityCouncil: {
    name: string;
    id: string;
  };
}

export function ConfirmDeletionCityCouncilDialog({
  open,
  onOpenChange,
  cityCouncil,
}: AddUserDialogProps) {
  const [cityCouncilName, setCityCouncilName] = useState("");
  const router = useRouter();

  async function onSubmit() {
    if (cityCouncilName.trim().length <= 0) return;

    if (cityCouncilName !== cityCouncil.name) return;

    const response = await fetchApi(`/city-councils/${cityCouncil.id}`, {
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

    toast.success("Câmara deletada com sucesso", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });

    router.push("/app/city-councils");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deletar câmara</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Ao deletar a câmara todos os dados relacionadas a mesma será excluido
          do sistema, digite <strong>{cityCouncil.name}</strong> para prosseguir com a deleção.
        </DialogDescription>

        <div className="flex flex-col gap-4">
          <Input
            value={cityCouncilName}
            onChange={(e) => setCityCouncilName(e.target.value)}
            placeholder="nome da câmara"
          />

          <Button className="float-right" type="submit" onClick={onSubmit} disabled={cityCouncilName !== cityCouncil.name}>
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
