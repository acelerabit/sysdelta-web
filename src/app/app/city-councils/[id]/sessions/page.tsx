"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useModal from "@/hooks/use-modal";
import { useEffect, useState } from "react";
import { fetchApi } from "@/services/fetchApi";
import LoadingAnimation from "@/app/app/_components/loading-page";
import { OnlyRolesCanAccess } from "@/components/permission/only-who-can-access";

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
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setSetLoadingSession] = useState(true);
  const [cityCouncil, setCityCouncil] = useState<CityCouncil | null>(null);
  const [loadingCityCouncil, setSetLoadingCityCouncil] = useState(true);

  const { isOpen, onOpenChange } = useModal();
  const { isOpen: isOpenNewUser, onOpenChange: onOpenChangeNewUser } =
    useModal();

  async function getSession() {
    setSetLoadingSession(true);

    const response = await fetchApi(`/city-councils/${params.id}`);

    if (!response.ok) {
      setSetLoadingSession(false);
      return;
    }

    const data = await response.json();


    setSession(data);
    setSetLoadingSession(false);
  }

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
    getSession();
    getCityCouncil();
  }, []);

  if (loadingSession) {
    return <LoadingAnimation />;
  }

  return (
    <OnlyRolesCanAccess rolesCanAccess={['ADMIN', 'PRESIDENT', 'ASSISTANT']} >
      <main className="p-8 flex flex-col">
        <h1 className="text-4xl font-semibold">Sessões</h1>

        <Breadcrumb className="my-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/app">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/app/city-councils/${cityCouncil?.id}`}>Câmara {cityCouncil?.name}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Sessões</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-8"></div>
      </main>
    </OnlyRolesCanAccess>
  );
}
