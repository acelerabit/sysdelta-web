"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { fetchApi } from "@/services/fetchApi";
import { toast } from "sonner";



interface AddUserDialogProps {
  open: boolean;
  onOpenChange: () => void;
  cityCouncilId: string;
}

interface User {
  name: string;
  id: string;
}

export function ChangeResponsibleDialog({
  open,
  onOpenChange,
  cityCouncilId
}: AddUserDialogProps) {
  const [openPop, setOpenPop] = useState(false);
  const [value, setValue] = useState("");
  const [usersFromCityCouncil, setUsersFromCityCouncil] = useState<User[]>([])

  async function onSubmit() {

    const response = await fetchApi(`/city-councils/assign/${value}`, {
      method: "POST",
      body: JSON.stringify({
        cityCouncilId: cityCouncilId,
      }),
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

    toast.success("Responsável definido com sucesso", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    window.location.reload();
  }

  async function fetchUsers() {
    const response = await fetchApi(`/users/city-council/without-paginate/${cityCouncilId}`);

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

    const data = await response.json()

    setUsersFromCityCouncil(data)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mudar responsável</DialogTitle>
        </DialogHeader>

        <Popover open={openPop} onOpenChange={setOpenPop}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {value
                ? usersFromCityCouncil.find((user) => user.id === value)
                    ?.name
                : "Selecione o usuário..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[480px] p-0">
            <Command>
              <CommandInput placeholder="Busque usuário..." />
              <CommandList>
                <CommandEmpty>Usuário não encontrado.</CommandEmpty>
                <CommandGroup>
                  {usersFromCityCouncil.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.id}
                      onSelect={(currentValue: any) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpenPop(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === user.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {user.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Button onClick={() => onSubmit()}>Definir como responsável</Button>
      </DialogContent>
    </Dialog>
  );
}
