"use client";

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
import useModal from "@/hooks/use-modal";
import { AddUserCityCouncilDialog } from "./_components/add-user-city-council-dialog";
import TableUsersFromCityCouncil from "./_components/table-users-from-city-council";

interface UsersFromCityCouncilProps {
  params: {
    id: string;
  };
}

export default function UsersFromCityCouncil({
  params,
}: UsersFromCityCouncilProps) {
  const { isOpen: isOpenNewUser, onOpenChange: onOpenChangeNewUser } =
    useModal();

  return (
    <OnlyRolesCanAccess rolesCanAccess={["ADMIN", "PRESIDENT", "ASSISTANT"]}>
      <main className="p-8 flex flex-col">
        <h1 className="text-4xl font-semibold">Usuários</h1>

        <Breadcrumb className="my-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/app">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>usuários</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-8">
          <div className="bg-card p-6 rounded-lg shadow">
            <div className="w-full flex items-center justify-between">
              <h2 className="text-xl font-bold group-hover:text-zinc-700 mb-4">
                Usuários
              </h2>
              <div className="mb-4 flex items-center gap-2 ">
                <Button onClick={onOpenChangeNewUser}>Adicionar usuário</Button>
              </div>
            </div>

            {/* <TableCityCouncilUsers cityCouncilId={params.id} /> */}
            <TableUsersFromCityCouncil cityCouncilId={params.id} />
          </div>
        </div>

        <AddUserCityCouncilDialog
          open={isOpenNewUser}
          onOpenChange={onOpenChangeNewUser}
          cityCouncilId={params.id}
        />
      </main>
    </OnlyRolesCanAccess>
  );
}
