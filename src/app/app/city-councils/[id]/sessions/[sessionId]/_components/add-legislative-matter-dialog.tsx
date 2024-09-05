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
  code: z.number().int("Código deve ser um número inteiro."),
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

export function AddLegislativeMatterDialog({
  open,
  onOpenChange,
  cityCouncilId,
  sessionId,
}: AddUserCityCouncilDialogProps) {
  const [openPop, setOpenPop] = useState(false);
  const [value, setValue] = useState("");
  const [usersFromCityCouncil, setUsersFromCityCouncil] = useState<User[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      votingType: "NOMINAL",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // const response = await fetchApi(`/users`, {
    //   method: "POST",
    //   body: JSON.stringify({
    //     name: values.name,
    //     email: values.email,
    //     phone: values.phone,
    //     cpf: values.cpf,
    //     politicalParty: values.politicalParty,
    //     cityCouncilId,
    //     role: values.role,
    //   }),
    // });
    // if (!response.ok) {
    //   const respError = await response.json();
    //   toast.error(respError.error, {
    //     action: {
    //       label: "Undo",
    //       onClick: () => console.log("Undo"),
    //     },
    //   });
    //   return;
    // } else {
    //   toast.success("Usuário criado com sucesso", {
    //     action: {
    //       label: "Undo",
    //       onClick: () => console.log("Undo"),
    //     },
    //   });
    //   window.location.reload();
    // }
  }

  async function fetchUsers() {
    const response = await fetchApi(
      `/users/city-council/without-paginate/${cityCouncilId}`
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

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Criar nova matéria legislativa</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          aria-expanded={open}
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
                          <CommandEmpty>Usuário não encontrado</CommandEmpty>
                          <CommandGroup>
                            {usersFromCityCouncil.map((user) => (
                              <CommandItem
                                key={user.id}
                                value={user.id}
                                onSelect={(currentValue: any) => {
                                  form.setValue("authorId", currentValue );
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

                              // <CommandItem
                              //   value={user.label}
                              //   key={user.value}
                              //   onSelect={() => {
                              //     form.setValue("user", user.value);
                              //   }}
                              // >
                              //   <Check
                              //     className={cn(
                              //       "mr-2 h-4 w-4",
                              //       language.value === field.value
                              //         ? "opacity-100"
                              //         : "opacity-0"
                              //     )}
                              //   />
                              //   {language.label}
                              // </CommandItem>
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

            {/* <Popover open={openPop} onOpenChange={setOpenPop}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between mt-0"
                >
                  {value
                    ? usersFromCityCouncil.find((user) => user.id === value)
                        ?.name
                    : "Selecione o autor..."}
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
                            setValue(
                              currentValue === value ? "" : currentValue
                            );
                            setOpenPop(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === user.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {user.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover> */}
            <Button className="float-right" type="submit">
              Criar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
