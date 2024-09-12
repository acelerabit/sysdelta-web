import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

import { ptBR } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchApi } from "@/services/fetchApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatCpfCnpj } from "@/utils/formatCpfCnpj";
import { useEffect, useState } from "react";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AddUserCityCouncilDialogProps {
  open: boolean;
  onOpenChange: () => void;
  cityCouncilId: string;
  sessionId: string;
  phase?: string;
  officeId?: string;
  orderDayId?: string;
}

interface Council {
  id: string;
  name: string;
}

const roles = [
  {
    key: "PRESIDENT",
    value: "PRESIDENTE / VEREADOR",
  },
  {
    key: "SECRETARY",
    value: "SECRETÁRIO / VEREADOR",
  },
  {
    key: "COUNCILOR",
    value: "VEREADOR",
  },
  {
    key: "ASSISTANT",
    value: "AUXILIAR",
  },
];

const formSchema = z.object({
  votingType: z.enum(["SECRET", "NOMINAL"], {
    errorMap: () => ({ message: "Tipo de votação inválido." }),
  }),
  legislativeMatter: z
    .string()
    .uuid("ID dat matéria legislativa deve ser um UUID válido.")
    .optional(),
});

const votingTypes = [
  {
    key: "SECRET",
    value: "Secreta",
  },
  {
    key: "NOMINAL",
    value: "Nominal",
  },
];

interface LegislativeMatter {
  id: string;
  code: string;
  title: string;
}

export function AddLegislativeMatterDialog({
  open,
  onOpenChange,
  cityCouncilId,
  sessionId,
  phase = 'order-day',
  officeId,
  orderDayId
}: AddUserCityCouncilDialogProps) {
  const [openPop, setOpenPop] = useState(false);
  const [value, setValue] = useState("");
  const [legislativeMatters, setLegislativeMatters] = useState<
    LegislativeMatter[]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      votingType: "NOMINAL",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetchApi(`/legislative-matter/associate/${value}`, {
      method: "PATCH",
      body: JSON.stringify({
        sessionId,
        phase,
        officeId,
        orderDayId,
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
    } else {
      toast.success("Matéria relacionadada com sucesso", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      window.location.reload();
    }
  }

  async function fetchLegislativeMatters() {
    const response = await fetchApi(
      `/legislative-matter/city-council/${cityCouncilId}/disassociated-only`
    );
    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error, {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    } else {
      const data = await response.json();

      setLegislativeMatters(data);
    }
  }

  useEffect(() => {
    fetchLegislativeMatters();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Associar matéria legislativa</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="votingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de votação</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de votação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {votingTypes.map((votingType) => (
                        <SelectItem key={votingType.key} value={votingType.key}>
                          {votingType.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="processPhase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fase do processo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a fase do processo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem key="expedient" value="expedient">
                        Expediente
                      </SelectItem>
                      <SelectItem key="order-day" value="order-day">
                        Ordem do dia
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <Popover open={openPop} onOpenChange={setOpenPop}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between mt-0"
                >
                  {value
                    ? (() => {
                        const result = legislativeMatters.find(
                          (legislativeMatter) => legislativeMatter.id === value
                        );
                        return `${result?.code} - ${result?.title}`;
                      })()
                    : "Selecione a matéria..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[480px] p-0">
                <Command>
                  <CommandInput placeholder="Busque a matéria..." />
                  <CommandList>
                    <CommandEmpty>Matéria não encontrado.</CommandEmpty>
                    <CommandGroup>
                      {legislativeMatters.map((legislativeMatter) => (
                        <CommandItem
                          key={legislativeMatter.id}
                          value={legislativeMatter.id}
                          onSelect={(currentValue: any) => {
                            setValue(
                              currentValue === value ? "" : currentValue
                            );
                            setOpenPop(false);
                          }}
                          className="truncate"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === legislativeMatter.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {legislativeMatter.code}-{legislativeMatter.title}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button className="float-right" type="submit">
              Relacionar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
