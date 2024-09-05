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
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { useUser } from "@/contexts/user-context";
import { fetchApi } from "@/services/fetchApi";
import { toast } from "sonner";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email("Email must be valid"),
  role: z.enum(["ADMIN", "PRESIDENT", "ASSISTANT", "COUNCILOR", "SECRETARY"]),
  phone: z.string().optional().nullable(),
  cpf: z.string().optional().nullable(),
  politicalParty: z.string().optional().nullable(),
  affiliatedCityCouncil: z.string().optional(),
});

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  cpf?: string;
  politicalParty?: string;
  affiliatedCouncil?: {
    name: string;
    id: string;
  };
}

interface UpdateUserFormProps {
  user: User;
}

type roles = "ADMIN" | "PRESIDENT" | "ASSISTANT" | "COUNCILOR" | "SECRETARY";

export function UpdateUserForm({ user }: UpdateUserFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.name,
      email: user?.email,
      role: user.role as roles,
      phone: user?.phone ?? "",
      cpf: user?.cpf ?? "",
      politicalParty: user?.politicalParty ?? "",
      affiliatedCityCouncil: user?.affiliatedCouncil?.name,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const requestData = {
      name: values.username,
      email: values.email,
      cpf: values.cpf,
      phone: values.phone,
      politicalParty: values.politicalParty,
      role: values.role,
      affiliatedCityCouncil: values.affiliatedCityCouncil,
      id: user?.id,
    };

    const response = await fetchApi(`/users/update`, {
      method: "PUT",
      body: JSON.stringify(requestData),
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

    const dataResp = await response.json();

    toast.success("Usuário editado com sucesso", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ADMIN">ADMINISTRADOR</SelectItem>
                  <SelectItem value="SECRETARY">
                    VEREADOR / SECRETÁRIO
                  </SelectItem>
                  <SelectItem value="COUNCILOR">VEREADOR</SelectItem>
                  <SelectItem value="ASSISTANT">AUXILIAR</SelectItem>
                  <SelectItem value="PRESIDENT">
                    VEREADOR / PRESIDENT
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {user.role !== "ADMIN" && (
          <>
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="cpf"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="phone"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="affiliatedCityCouncil"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Câmara</FormLabel>
                  <FormControl>
                    <Input placeholder="câmara" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
}
