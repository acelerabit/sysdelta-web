"use client";

import { OnlyAdmin } from "@/components/permission/only-admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useModal from "@/hooks/use-modal";
import { fetchApi } from "@/services/fetchApi";
import { formatCpfCnpj } from "@/utils/formatCpfCnpj";
import {
  ExternalLink,
  PencilIcon,
  TriangleAlert
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingAnimation from "../../_components/loading-page";
import { ConfirmDeletionCityCouncilDialog } from "../_components/confirm-deletion-dialog";
import { ChangeResponsibleDialog } from "./_components/change-resonsible-dialog";
import { UpdateCityCouncilDialog } from "./_components/update-city-council-dialog";
import { AddUserCityCouncilDialog } from "./users/_components/add-user-city-council-dialog";
import TableUsersFromCityCouncil from "./users/_components/table-users-from-city-council";

interface CityCouncilProps {
  params: {
    id: string;
  };
}

interface CityCouncil {
  name: string;
  id: string;
  cnpj: string;
  city: string;
  state: string;
  responsible?: {
    name: string;
    email: string;
    id: string;
  };
}

export default function CityCouncil({ params }: CityCouncilProps) {
  const [cityCouncil, setCityCouncil] = useState<CityCouncil | null>(null);
  const [loadingCityCouncil, setSetLoadingCityCouncil] = useState(true);
  const { isOpen, onOpenChange } = useModal();
  const { isOpen: isOpenNewUser, onOpenChange: onOpenChangeNewUser } =
    useModal();
  const {
    isOpen: isOpenUpdateCityCouncil,
    onOpenChange: onOpenChangeCityCouncil,
  } = useModal();

  const {
    isOpen: isOpenDeleteCityCouncil,
    onOpenChange: onOpenChangeDeleteCityCouncil,
  } = useModal();

  async function getCityCouncil() {
    setSetLoadingCityCouncil(true);

    const response = await fetchApi(`/city-councils/${params.id}`);

    if (!response.ok) {
      setSetLoadingCityCouncil(false);
      return;
    }

    const data = await response.json();

    setCityCouncil(data);
    setSetLoadingCityCouncil(false);
  }

  useEffect(() => {
    getCityCouncil();
  }, []);

  if (loadingCityCouncil && !cityCouncil) {
    return <LoadingAnimation />;
  }

  return (
    <OnlyAdmin>
      <main className="p-8 flex flex-col">
        <h1 className="text-4xl font-semibold">Câmara {cityCouncil?.name}</h1>

        <Breadcrumb className="my-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/app">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>câmara {cityCouncil?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-8">
          <div className="bg-card p-6 rounded-lg shadow flex justify-between items-start">
            <div className="w-full flex items-start justify-between p-4">
              <div className="grid gap-1">
                <div className="font-medium">
                  Câmara Municipal de {cityCouncil?.name}
                </div>
                <div className="text-muted-foreground">
                  Estado: {cityCouncil?.state}
                </div>
                <div className="text-muted-foreground">
                  Cidade: {cityCouncil?.city}
                </div>
                <div className="text-muted-foreground">
                  CNPJ: {formatCpfCnpj(cityCouncil?.cnpj ?? "")}
                </div>
                {/* <div className="text-muted-foreground">Status: Ativo</div> */}
              </div>

              <Button onClick={onOpenChangeCityCouncil}>
                Editar
                <PencilIcon className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg shadow flex justify-between items-start">
            {cityCouncil?.responsible ? (
              <>
                <div>
                  <h2 className="text-xl font-bold mb-4">Responsável</h2>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                      <AvatarFallback className="uppercase">
                        {cityCouncil.responsible.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <Link
                        href={`/app/users/${cityCouncil.responsible.id}`}
                        className="flex items-center justify-start group gap-2"
                      >
                        <p className="font-medium group-hover:text-zinc-600">
                          {cityCouncil.responsible.name}
                        </p>
                        <ExternalLink className="h-4 w-4 group-hover:text-zinc-600" />
                      </Link>
                      <div className="text-muted-foreground">
                        {cityCouncil.responsible.email}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Button variant="ghost" onClick={onOpenChange}>
                    Mudar responsável
                  </Button>
                </div>{" "}
              </>
            ) : (
              <Button className="ml-auto" onClick={onOpenChange}>
                Definir responsável
              </Button>
            )}
          </div>

          <div className="bg-card p-6 rounded-lg shadow flex justify-between items-start">
          <Link
              href={`/app/city-councils/${cityCouncil?.id}/legislative-matters`}
              className="flex items-center justify-start group gap-2 mb-4"
            >
              <h2 className="text-xl font-bold group-hover:text-zinc-700">
                Matérias legislativas
              </h2>

              <ExternalLink className="h-4 w-4 group-hover:text-zinc-700" />
            </Link>
          </div>

          <div className="bg-card p-6 rounded-lg shadow">
            <Link
              href={`/app/city-councils/${cityCouncil?.id}/sessions`}
              className="flex items-center justify-start group gap-2 mb-4"
            >
              <h2 className="text-xl font-bold group-hover:text-zinc-700">
                Sessões
              </h2>

              <ExternalLink className="h-4 w-4 group-hover:text-zinc-700" />
            </Link>
            <div className="mb-4 flex items-center gap-2">
              <Input
                type="search"
                placeholder="Search appointments..."
                // value={searchTerm}
                // onChange={handleSearch}
                className="w-full"
              />
              <Button>Adicionar sessão</Button>
            </div>
            {/* <TableCityCouncilUsers cityCouncilId={params.id} /> */}
          </div>

          <div className="bg-card p-6 rounded-lg shadow">
            <div className="w-full flex items-center justify-between">
              <Link
                href={`/app/city-councils/${cityCouncil?.id}/users`}
                className="flex items-center justify-start group gap-2 mb-4"
              >
                <h2 className="text-xl font-bold group-hover:text-zinc-700">
                  Usuários
                </h2>

                <ExternalLink className="h-4 w-4 group-hover:text-zinc-700" />
              </Link>
              <div className="mb-4 flex items-center gap-2 ">
                <Button onClick={onOpenChangeNewUser}>Adicionar usuário</Button>
              </div>
            </div>

            <TableUsersFromCityCouncil cityCouncilId={params.id} />
          </div>

          <div className="bg-card p-6 rounded-lg shadow flex justify-between items-start">
            <div className="space-y-4">
              <div className="flex gap-2">
                <p className="text-muted-foreground">
                  Essa ação irá apagar a câmara e todos os dados relacionados à
                  ela{" "}
                </p>
                <TriangleAlert className="h-5 w-5 text-yellow-500" />
              </div>

              <Button
                variant="destructive"
                onClick={onOpenChangeDeleteCityCouncil}
              >
                Excluir câmara
              </Button>
            </div>
          </div>
        </div>
      </main>
      <ChangeResponsibleDialog
        cityCouncilId={params.id}
        open={isOpen}
        onOpenChange={onOpenChange}
      />
      <AddUserCityCouncilDialog
        open={isOpenNewUser}
        onOpenChange={onOpenChangeNewUser}
        cityCouncilId={params.id}
      />
      {cityCouncil && (
        <ConfirmDeletionCityCouncilDialog
          open={isOpenDeleteCityCouncil}
          onOpenChange={onOpenChangeDeleteCityCouncil}
          cityCouncil={cityCouncil}
        />
      )}
      {cityCouncil && (
        <UpdateCityCouncilDialog
          open={isOpenUpdateCityCouncil}
          onOpenChange={onOpenChangeCityCouncil}
          cityCouncil={cityCouncil}
        />
      )}
    </OnlyAdmin>
  );
}
