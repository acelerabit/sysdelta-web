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
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/user-context";
import { fetchApi } from "@/services/fetchApi";
import { toast } from "sonner";
import LoadingAnimation from "../../_components/loading-page";
import Email from "next-auth/providers/email";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email("Email must be valid"),
  phone: z.string().optional().nullable(),
  cpf: z.string().optional().nullable(),
  politicalParty: z.string().optional().nullable(),
  role: z.string().optional(),
  affiliatedCityCouncil: z.string().optional(),
});

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  politicalParty?: string;
  role: string;
  affiliatedCouncil?: {
    name: string;
    id: string;
  };
}

export function ProfileForm() {
  const { loadingUser, user: userLogged } = useUser();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.name,
      email: user?.email,
      phone: user?.phone,
      cpf: user?.cpf,
      politicalParty: user?.politicalParty,
      role: user?.role,
      affiliatedCityCouncil: user?.affiliatedCouncil?.name ?? "",
    },
  });

  const { setValue } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const requestData = {
      name: values.username,
      email: values.email,
      cpf: values.cpf,
      phone: values.phone,
      politicalParty: values.politicalParty,
      role: values.role,
      affiliatedCityCouncil: values.affiliatedCityCouncil ?? "",
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

  async function getUser() {
    const response = await fetchApi(`/users/${userLogged?.id}`);

    if (!response.ok) {
      const respError = await response.json();

      toast.error(respError.error, {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });

      setLoading(false);
      return;
    }

    const dataResp = await response.json();

    setValue("affiliatedCityCouncil", dataResp.affiliatedCouncil?.name ?? "");
    setValue("username", dataResp.name);
    setValue("cpf", dataResp.cpf);
    setValue("email", dataResp.email);
    setValue("phone", dataResp.phone);
    setValue("politicalParty", dataResp.politicalParty);
    setValue("role", dataResp.role);

    setUser(dataResp);
    setLoading(false);
  }

  useEffect(() => {
    getUser();
  }, []);

  if (loading || loadingUser) {
    return <LoadingAnimation />;
  }

  console.log(form.formState.errors);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="nome" {...field} />
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
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled
              >
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

        {user && user.role !== "ADMIN" && (
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
                      disabled={user?.role !== "ADMIN"}
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
                      disabled={user?.role !== "ADMIN"}
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
                    <Input
                      placeholder="câmara"
                      {...field}
                      disabled={user?.role !== "ADMIN"}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />{" "}
          </>
        )}

        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
}
