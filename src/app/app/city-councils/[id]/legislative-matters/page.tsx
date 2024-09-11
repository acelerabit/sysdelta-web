"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useUser } from "@/contexts/user-context";
import { MattersTable } from "./_components/matters-table";
import LoadingAnimation from "@/app/app/_components/loading-page";
import { fetchApi } from "@/services/fetchApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface LegislativeMattersProps {
  params: {
    id: string;
  };
}

interface CityCouncil {
  id: string;
  name: string;
}

export default function LegislativeMatters({
  params,
}: LegislativeMattersProps) {
  const [cityCouncil, setCityCouncil] = useState<CityCouncil | null>(null);
  const { user, loadingUser } = useUser();

  async function getCityCouncil() {
    const response = await fetchApi(`/city-councils/${params?.id}`);

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

    setCityCouncil(data);
  }

  useEffect(() => {
    getCityCouncil();
  }, []);

  if (!cityCouncil || !user) {
    return <LoadingAnimation />;
  }

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">{cityCouncil.name}</h1>
      </div>

      <Breadcrumb className="my-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/app">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {/* <BreadcrumbItem>
            <BreadcrumbLink href="/app/users">users</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator /> */}
          <BreadcrumbItem>
            <BreadcrumbPage>{cityCouncil.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-8">
        <div className="bg-card p-6 rounded-lg shadow space-y-4">
          <div className="w-full flex items-center justify-end">
            <Link
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              href={`/app/city-councils/${params.id}/legislative-matters/matters`}
            >
              Adicionar matéria
            </Link>
          </div>

          <MattersTable cityCouncilId={params.id} />
        </div>
      </div>
    </main>
  );
}
