"use client";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { fetchApi } from "@/services/fetchApi";
import { formatCpfCnpj } from "@/utils/formatCpfCnpj";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface UpdateCityCouncilDialogProps {
  open: boolean;
  onOpenChange: () => void;
  cityCouncil: {
    id: string;
    city: string;
    state: string;
    cnpj: string;
    name: string;
  };
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nome da câmara é obrigatótio",
  }),
  city: z.string().min(2, {
    message: "Cidade é obrigatótio",
  }),
  state: z.string().min(2, {
    message: "Estado é obrigatótio",
  }),
  cnpj: z
    .string({
      required_error: "CNPJ é obrigatório.",
    })
    .refine((doc) => {
      const replacedDoc = doc.replace(/\D/g, "");
      return replacedDoc.length >= 11;
    }, "CNPJ deve conter no mínimo 11 caracteres.")
    .refine((doc) => {
      const replacedDoc = doc.replace(/\D/g, "");
      return replacedDoc.length <= 14;
    }, "CNPJ deve conter no máximo 14 caracteres.")
    .refine((doc) => {
      const replacedDoc = doc.replace(/\D/g, "");
      return !!Number(replacedDoc);
    }, "CNPJ deve conter apenas números."),
});

export function UpdateCityCouncilDialog({
  open,
  onOpenChange,
  cityCouncil,
}: UpdateCityCouncilDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: cityCouncil.name,
      city: cityCouncil.city,
      state: cityCouncil.state,
      cnpj: cityCouncil.cnpj,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetchApi(`/city-councils/update/${cityCouncil.id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: values.name,
        city: values.city,
        state: values.state,
        cnpj: values.cnpj,
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

    toast.success("Câmara atualizada com sucesso", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    window.location.reload();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar câmara</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="nome" {...field} />
                  </FormControl>
                  <FormDescription>Nome da câmara.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="cidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input placeholder="estado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => {
                const { onChange, ...rest } = field;

                return (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input
                        maxLength={18}
                        onChange={(e) => {
                          const { value } = e.target;
                          e.target.value = formatCpfCnpj(value);
                          onChange(e);
                        }}
                        placeholder="CNPJ"
                        {...rest}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button type="submit" className="float-right">
              Atualizar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
