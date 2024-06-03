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
}

export default function User({ params }: UserProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const { isOpen, onOpenChange } = useModal();

  async function sendRedefinePasswordEmail() {
    const response = await fetchApi(`/recovery-password`, {
      method: "POST",
      body: JSON.stringify({
        email: user?.email,
      }),
    });

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error);
      return;
    }

    toast.success("E-mail enviado com sucesso");
  }

  async function getUser() {
    const response = await fetchApi(`/users/${params.userId}`);

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error);
      return;
    }

    const data = await response.json();

    setUser(data);
    setLoadingUser(false);
  }

  useEffect(() => {
    getUser();
  }, []);

  if (loadingUser || !user) {
    return <LoadingAnimation />;
  }

  return (
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
            Account
          </TabsTrigger>
          <TabsTrigger value="password" className="w-full ">
            Password
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <div className="grid gap-6">
            <Card x-chunk="dashboard-04-chunk-1">
              <CardHeader>
                <CardTitle>Information</CardTitle>
                <CardDescription>
                  Used to identify you in the app.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UpdateUserForm user={user} />
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-04-chunk-2">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Show if you is enable to receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationForm user={user} />
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
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      user account and remove their data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    {/* <AlertDialogAction>Continue</AlertDialogAction> */}
                    <Button>Continue</Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Forgot your password?</CardTitle>
              <CardDescription>
                Click here to receive your password recovery code via email.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={sendRedefinePasswordEmail}>
                Send code
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
