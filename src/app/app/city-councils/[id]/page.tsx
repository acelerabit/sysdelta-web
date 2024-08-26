"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TableUsers } from "../../users/_components/table-users";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import useModal from "@/hooks/use-modal";
import { ChangeResponsibleDialog } from "./_components/change-resonsible-dialog";
import { useEffect, useState } from "react";
import { AddUserCityCouncilDialog } from "./users/_components/add-user-city-council-dialog";
import { TableCityCouncilUsers } from "./users/_components/table-city-council-users";
import { fetchApi } from "@/services/fetchApi";
import LoadingAnimation from "../../_components/loading-page";

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

  async function getCityCouncil() {
    setSetLoadingCityCouncil(true);

    const response = await fetchApi(`/city-councils/${params.id}`);

    if (!response.ok) {
      setSetLoadingCityCouncil(false);
      return;
    }

    const data = await response.json();

    console.log(data, "CITY");

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
    <>
      <main className="p-8 flex flex-col">
        <h1 className="text-4xl font-semibold">Câmara Tal</h1>

        <Breadcrumb className="my-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/app">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>câmara tal</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-8">
          <div className="bg-card p-6 rounded-lg shadow flex justify-between items-start">
            {cityCouncil?.responsible ? (
              <>
                <div>
                  <h2 className="text-xl font-bold mb-4">Responsável</h2>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                      <AvatarFallback className="uppercase">{cityCouncil.responsible.name.substring(0, 2)}</AvatarFallback>
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

          <div className="bg-card p-6 rounded-lg shadow">
            <Link
              href={`/app/city-council/1/sessions`}
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
            <TableCityCouncilUsers cityCouncilId={params.id} />
          </div>

          <div className="bg-card p-6 rounded-lg shadow">
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
              <Input
                type="search"
                placeholder="Search appointments..."
                // value={searchTerm}
                // onChange={handleSearch}
                className="w-full"
              />
              <Button onClick={onOpenChangeNewUser}>Adicionar usuário</Button>
            </div>
            <TableCityCouncilUsers cityCouncilId={params.id} />
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
    </>
  );
}
