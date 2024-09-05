import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner";
import { z } from "zod";
import { format } from 'date-fns';

interface AddSessionCityCouncilDialogProps {
  open: boolean;
  onOpenChange: () => void;
  cityCouncilId: string;
}

type SessionTypes = "ORDINARY";

interface Session {
  legislature: string;
  legislativeSession: string;
  type: SessionTypes;
  numberSession: number;
  openingDateTime: Date;
  closingDateTime: Date;
}

const formSchema = z
  .object({
    legislature: z.string().min(1, "Legislatura é obrigatória."),
    legislativeSession: z.string().min(1, "Sessão legislativa é obrigatória."),
    type: z.enum(["ORDINARY"], {
      errorMap: () => ({ message: "Tipo de sessão inválido." }),
    }),
    numberSession: z.coerce
      .number()
      .int()
      .positive("O número da sessão deve ser um inteiro positivo."),
    openingDateTime: z
      .string()
      .min(1, "Data e hora de abertura são obrigatórias."),
    closingDateTime: z
      .string()
      .min(1, "Data e hora de abertura são obrigatórias."),
  })
  .refine(
    (data) => new Date(data.closingDateTime) > new Date(data.openingDateTime),
    {
      message:
        "A data e hora de encerramento devem ser posteriores à data e hora de abertura.",
      path: ["closingDateTime"],
    }
  );

export function AddSessionCityCouncilDialog({
  open,
  onOpenChange,
  cityCouncilId,
}: AddSessionCityCouncilDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      legislature: "",
      legislativeSession: "",
      type: "ORDINARY",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetchApi(`/session/${cityCouncilId}`, {
      method: "POST",
      body: JSON.stringify({
        legislature: values.legislature,
        legislativeSession: values.legislativeSession,
        type: values.type,
        numberSession: values.numberSession,
        openingDateTime: values.openingDateTime,
        closingDateTime: values.closingDateTime,
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
      toast.success("Usuário criado com sucesso", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      window.location.reload();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar nova sessão</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="legislature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legislatura</FormLabel>
                  <FormControl>
                    <Input placeholder="nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="legislativeSession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sessão legislativa</FormLabel>
                  <FormControl>
                    <Input placeholder="sessão legislativa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="openingDateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de abertura</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      placeholder="nome"
                      {...field}
                      value={(field.value) ? format(field.value, "yyyy-MM-dd'T'HH:mm") : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="closingDateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de encerramento</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      placeholder="nome"
                      {...field}
                      value={(field.value) ? format(field.value, "yyyy-MM-dd'T'HH:mm") : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberSession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numero da sessão</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="número da sessão"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de sessão</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de sessão" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem key="ORDINARY" value="ORDINARY">
                        Ordinária
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="float-right" type="submit">
              Criar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
