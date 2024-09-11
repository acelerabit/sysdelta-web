"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { OfficeMattersTable } from "./office-matters-table";
import { AddLegislativeMatterDialog } from "./add-legislative-matter-dialog";
import useModal from "@/hooks/use-modal";
import Link from "next/link";
import { toast } from "sonner";
import { fetchApi } from "@/services/fetchApi";
import { useEffect, useState } from "react";

const formSchema = z.object({
  description: z.string().min(2).max(50),
});

interface OfficeProps {
  sessionId: string;
  cityCouncilId: string;
}

interface OfficeResponse {
  id: string;
  summary: string;
}

export function Office({ sessionId, cityCouncilId }: OfficeProps) {
  const { isOpen, onOpenChange } = useModal();
  const [office, setOffice] = useState<null | OfficeResponse>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetchApi(`/office/${sessionId}`, {
      method: "POST",
      body: JSON.stringify({
        summary: values.description,
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
      toast.success("Matéria criada com sucesso", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });

      const data = await response.json();

      setOffice(data);

      window.location.reload();
    }
  }

  async function getSessionOffice() {
    const response = await fetchApi(`/office/session/${sessionId}`);
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

      setOffice(data);
      form.setValue("description", data.summary);

      // window.location.reload();
    }
  }

  useEffect(() => {
    getSessionOffice();
  }, []);

  return (
    <div className="w-full flex flex-col gap-8 items-start justify-start">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição do expediente</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>
                  Descreva aqui oque será tratado na etapa de expediente.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Salvar</Button>
        </form>
      </Form>

      <div className="w-full space-y-4">
        <div className="w-full flex items-center justify-between">
          {office && (
            <>
              <p className="text-2xl font-semibold leading-none tracking-tight">
                Matérias da sessão de expediente
              </p>

              <div className="space-x-4">
                <Button onClick={onOpenChange}>Associar matéria</Button>

                <Link
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  href={`/app/city-councils/${cityCouncilId}/sessions/${sessionId}/legislative-matter?officeId=${office?.id}`}
                >
                  Adicionar matéria
                </Link>
              </div>
            </>
          )}
        </div>

        {office && (
          <OfficeMattersTable
            cityCouncilId={cityCouncilId}
            sessionId={sessionId}
            officeId={office?.id}
          />
        )}
      </div>

      <AddLegislativeMatterDialog
        cityCouncilId={cityCouncilId}
        sessionId={sessionId}
        open={isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
}
