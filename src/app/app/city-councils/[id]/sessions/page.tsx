"use client";

import LoadingAnimation from "@/app/app/_components/loading-page";
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
import { fetchApi } from "@/services/fetchApi";
import { useEffect, useState } from "react";
import { AddSessionCityCouncilDialog } from "./_components/add-session-city-council-dialog";
import TableSessionsFromCityCouncil from "./_components/table-sessions-from-city-council";

interface SessionProps {
  params: {
    id: string;
  };
}

interface Session {
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

export default function Sessions({ params }: SessionProps) {
  const [cityCouncil, setCityCouncil] = useState<CityCouncil | null>(null);
  const [loadingCityCouncil, setSetLoadingCityCouncil] = useState(true);

  const { isOpen: isOpenNewSession, onOpenChange: onOpenChangeNewSession } =
    useModal();

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

  if (loadingCityCouncil) {
    return <LoadingAnimation />;
  }

  return (
    <OnlyRolesCanAccess rolesCanAccess={["ADMIN", "PRESIDENT", "ASSISTANT"]}>
      <main className="p-8 flex flex-col">
        <h1 className="text-4xl font-semibold">Sessões</h1>

        <Breadcrumb className="my-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/app">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/app/city-councils/${cityCouncil?.id}`}>
                Câmara {cityCouncil?.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Sessões</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-8">
          <div className="w-full flex items-center justify-end">

            <div className="mb-4 flex items-center gap-2 ">
              <Button onClick={onOpenChangeNewSession}>Adicionar sessão</Button>
            </div>
          </div>
          <TableSessionsFromCityCouncil cityCouncilId={params.id} />
        </div>

        <AddSessionCityCouncilDialog
          open={isOpenNewSession}
          onOpenChange={onOpenChangeNewSession}
          cityCouncilId={params.id}
        />
      </main>
    </OnlyRolesCanAccess>
  );
}
