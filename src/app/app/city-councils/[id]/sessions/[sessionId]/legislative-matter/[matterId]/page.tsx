"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

import { OnlyRolesCanAccess } from "@/components/permission/only-who-can-access";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { fetchApi } from "@/services/fetchApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface AddUserCityCouncilDialogProps {
  params: {
    id: string;
    sessionId: string;
    matterId: string;
  };
  searchParams: {
    officeId: string;
  };
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
  type: z.string().min(1, "Tipo é obrigatório."),
  summary: z.string().min(1, "Resumo é obrigatório."),
  presentationDate: z.date({
    required_error: "Data de apresentação é obrigatória.",
  }),
  code: z.coerce.number().int("Código deve ser um número inteiro."),
  title: z.string().min(1, "Título é obrigatório."),
  votingType: z.enum(["SECRET", "NOMINAL"], {
    errorMap: () => ({ message: "Tipo de votação inválido." }),
  }),
  authorId: z.string().uuid("ID do autor deve ser um UUID válido.").optional(),
});

const votingTypes = [
  {
    key: "SECRET",
    value: "secreta",
  },
  {
    key: "NOMINAL",
    value: "nominal",
  },
];

interface User {
  name: string;
  id: string;
}

export default function AddLegislativeMatter({
  params,
  searchParams,
}: AddUserCityCouncilDialogProps) {
  const [officeId, setOfficeId] = useState("");

  const [openPop, setOpenPop] = useState(false);
  const [usersFromCityCouncil, setUsersFromCityCouncil] = useState<User[]>([]);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      votingType: "NOMINAL",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetchApi(
      `/legislative-matter/${params.matterId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          type: values.type,
          summary: values.summary,
          presentationDate: values.presentationDate,
          code: values.code,
          title: values.title,
          votingType: values.votingType,
          authorId: values.authorId,
        }),
      }
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
      toast.success("Matéria editada com sucesso", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });

      router.push(`/app/city-councils/${params?.id}/sessions/${params.sessionId}`);
    }
  }

  async function fetchUsers() {
    const response = await fetchApi(
      `/users/city-council/without-paginate/${params?.id}`
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
    }

    const data = await response.json();

    setUsersFromCityCouncil(data);
  }

  async function fetchLegislativeMatter() {
    const response = await fetchApi(`/legislative-matter/${params?.matterId}`);

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

    const data = await response.json();

    form.setValue("code", data.code);
    form.setValue("presentationDate", new Date(data.presentationDate));
    form.setValue("authorId", data.authorId);
    form.setValue("summary", data.summary);
    form.setValue("title", data.title);
    form.setValue("type", data.type);
    form.setValue("votingType", data.votingType);
  }

  useEffect(() => {
    fetchUsers();
    fetchLegislativeMatter();
  }, []);

  return (
    <OnlyRolesCanAccess rolesCanAccess={["ADMIN", "PRESIDENT", "ASSISTANT"]}>
      <main className="p-8 flex flex-col">
        <h1 className="text-4xl font-semibold">Editar matéria legislativa</h1>

        <Breadcrumb className="my-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/app">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/app/city-councils/${params?.id}/sessions`}
              >
                Sessões
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/app/city-councils/${params?.id}/sessions/${params.sessionId}`}
              >
                Sessão
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Editar matéria legislativa</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-8">
          <Card className="pb-8">
            <CardHeader>
              <CardDescription>Defina os dados da nova matéria</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de matéria</FormLabel>
                        <FormControl>
                          <Input placeholder="tipo de matéria" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ementa</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Ementa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código</FormLabel>
                        <FormControl>
                          <Input placeholder="Código" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Titulo</FormLabel>
                          <FormControl>
                            <Input placeholder="titulo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="presentationDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full">
                        <FormLabel>Data de apresentação</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl className="w-full">
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", {
                                    locale: ptBR,
                                  })
                                ) : (
                                  <span>Escolha uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date("1900-01-01")}
                              locale={ptBR}
                              lang="ptBR"
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="votingType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cargo</FormLabel>
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
                              <SelectItem
                                key={votingType.key}
                                value={votingType.key}
                              >
                                {votingType.value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="authorId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Autor</FormLabel>
                        <Popover open={openPop} onOpenChange={setOpenPop}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between mt-0"
                              >
                                {field.value
                                  ? usersFromCityCouncil.find(
                                      (user) => user.id === field.value
                                    )?.name
                                  : "Selecione o autor..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[480px] p-0">
                            <Command>
                              <CommandInput placeholder="Busque usuário..." />
                              <CommandList>
                                <CommandEmpty>
                                  Usuário não encontrado
                                </CommandEmpty>
                                <CommandGroup>
                                  {usersFromCityCouncil.map((user) => (
                                    <CommandItem
                                      key={user.id}
                                      value={user.id}
                                      onSelect={(currentValue: any) => {
                                        form.setValue("authorId", currentValue);
                                        setOpenPop(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === user.id
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

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button className="float-right" type="submit">
                    Editar matéria
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </OnlyRolesCanAccess>
  );
}
