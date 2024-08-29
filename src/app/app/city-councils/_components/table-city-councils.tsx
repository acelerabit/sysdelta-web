"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useModal from "@/hooks/use-modal";
import { fetchApi } from "@/services/fetchApi";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AddCityCouncilDialog } from "./add-city-council-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/contexts/user-context";
import LoadingAnimation from "../../_components/loading-page";

interface Council {
  id: string;
  name: string;
  city: string;
  state: string;
  cnpj: string;
  responsible?: {
    name: string;
  } | null;
}

export function TableCityCouncils() {
  const [councils, setCouncils] = useState<Council[]>([]);
  const [page, setPage] = useState(1);

  const { user, loadingUser } = useUser();

  const { isOpen, onOpenChange } = useModal();

  const itemsPerPage = 2;

  const [loadingCouncils, setSetLoadingCouncils] = useState(true);

  async function getCouncils() {
    setSetLoadingCouncils(true);
    const fetchCouncilsUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/city-councils`
    );

    fetchCouncilsUrl.searchParams.set("page", String(page));
    fetchCouncilsUrl.searchParams.set("itemsPerPage", String(itemsPerPage));

    const response = await fetchApi(
      `${fetchCouncilsUrl.pathname}${fetchCouncilsUrl.search}`
    );

    if (!response.ok) {
      setSetLoadingCouncils(false);
      return;
    }

    const data = await response.json();

    setCouncils(data);
    setSetLoadingCouncils(false);
  }

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => currentPage - 1);
  }

  useEffect(() => {
    getCouncils();
  }, [page]);

  if (loadingUser) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <Card className="col-span-2">
        {user?.role === "ADMIN" && (
          <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-2">
            <Button onClick={onOpenChange}>Adicionar câmara</Button>
          </CardHeader>
        )}

        <CardContent className="space-y-4">
          <Table>
            <TableCaption>Lista de câmaras.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do município</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>CNPJ</TableHead>

                <TableHead>Responsável</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {councils &&
                councils.map((council) => {
                  return (
                    <TableRow key={council.id}>
                      <TableCell className="font-medium truncate">
                        {council.name}
                      </TableCell>
                      <TableCell className="font-medium truncate">
                        {council.city}
                      </TableCell>
                      <TableCell className="font-medium truncate">
                        {council.state}
                      </TableCell>
                      <TableCell className="font-medium truncate">
                        {council.cnpj}
                      </TableCell>
                      <TableCell className="font-medium truncate">
                        {council.responsible
                          ? council.responsible.name
                          : "--não definido--"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <EllipsisVertical className="h-5 w-5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              asChild
                            >
                              <Link href={`/app/city-councils/${council.id}`}>
                                Ver detalhes
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          <div className="w-full flex gap-2 items-center justify-end">
            <Button
              className="disabled:cursor-not-allowed"
              disabled={page === 1}
              onClick={previousPage}
            >
              Previous
            </Button>
            <Button
              className="disabled:cursor-not-allowed"
              disabled={councils.length < itemsPerPage}
              onClick={nextPage}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
      <AddCityCouncilDialog open={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
