"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/user-context";
import { fetchApi } from "@/services/fetchApi";
import { Send } from "lucide-react";
import { toast } from "sonner";
import LoadingAnimation from "../../_components/loading-page";
import { UpdateUserForm } from "./update-user-form";
import { useEffect, useState } from "react";
import useModal from "@/hooks/use-modal";
import { NotificationForm } from "./notification-form";
import { useRouter } from "next/navigation";
import { OnlyRolesCanAccess } from "@/components/permission/only-who-can-access";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface UserProps {
  params: {
    userId: string;
  };
}

interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
  acceptNotifications: boolean;
  affiliatedCouncil: {
    id: string;
    name: string;
  };
}

export default function User({ params }: UserProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userActive, setUserActive] = useState(false);

  const { isOpen, onOpenChange } = useModal();
  const router = useRouter();

  async function sendRedefinePasswordEmail() {
    const response = await fetchApi(`/recovery-password`, {
      method: "POST",
      body: JSON.stringify({
        email: user?.email,
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

    toast.success("E-mail enviado com sucesso", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
  }

  async function getUser() {
    const response = await fetchApi(`/users/${params.userId}`);

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
    setUser(data);
    setUserActive(data.active);
    setLoadingUser(false);
  }

  async function deleteUser() {
    const response = await fetchApi(`/users/${params.userId}`, {
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

      onOpenChange();
      return;
    }
  }

  async function changeUserStatus(value: any) {
    if (!value) {
      // inactive

      const response = await fetchApi(`/users/inactivate/${params.userId}`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const respError = await response.json();
        toast.error(respError.error, {
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        });

        onOpenChange();
        return;
      }

      toast.success("Usuário desativado com sucesso", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });

      setUserActive(value);

      return;
    }

    const response = await fetchApi(`/users/activate/${params.userId}`, {
      method: "PATCH",
    });

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error, {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });

      onOpenChange();
      return;
    }

    toast.success("Usuário ativado com sucesso", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });

    setUserActive(value);
  }

  useEffect(() => {
    getUser();
  }, []);

  if (loadingUser || !user) {
    return <LoadingAnimation />;
  }

  return (
    <OnlyRolesCanAccess rolesCanAccess={["ADMIN", "PRESIDENT"]}>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">{user?.name}</h1>
        </div>

        <Breadcrumb className="my-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/app">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/app/users">users</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{user?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account" className="w-full">
              Perfil
            </TabsTrigger>
            <TabsTrigger value="password" className="w-full ">
              Senha
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <div className="grid gap-6">
              <Card x-chunk="dashboard-04-chunk-1">
                <CardHeader>
                  <CardTitle>Informações</CardTitle>
                </CardHeader>
                <CardContent>
                  <UpdateUserForm user={user} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                </CardHeader>
                <CardContent>
                  <NotificationForm user={user} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Sua conta está{" "}
                        {userActive ? (
                          <Badge className="bg-green-500">
                            Ativa
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500">Desativada</Badge>
                        )}
                      </p>
                    </div>
                    <Switch
                      id="account-status"
                      checked={userActive}
                      onCheckedChange={changeUserStatus}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="max-w-96">
                <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Deletar usuário</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Você tem certeza disso?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Ao deletar usuário todos os dados dele serão apagados.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <Button onClick={deleteUser}>Continuar</Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Esqueceu sua senha?</CardTitle>
                <CardDescription>
                  Clique aqui e receba seu código de recuparação de senha via
                  email.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={sendRedefinePasswordEmail}>
                  Enviar código
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </OnlyRolesCanAccess>
  );
}
