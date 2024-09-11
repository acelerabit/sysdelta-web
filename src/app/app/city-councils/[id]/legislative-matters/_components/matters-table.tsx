"use client";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { fetchApi } from "@/services/fetchApi";
import { useState, useEffect } from "react";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
// import { AddLegislativeMatterDialog } from "./add-legislative-matter-dialog";
import useModal from "@/hooks/use-modal";

export type VotingType = "SECRET" | "NOMINAL";
export type Status =
  | "PUBLISHED"
  | "DISCUSSED"
  | "VOTED_ON"
  | "ADOPTED"
  | "REJECTED"
  | "POSTPONED"
  | "WITHDRAW";

interface LegislativeMatter {
  id: string;
  type: string;
  summary: string;
  presentationDate: Date;
  code: number;
  title: string;
  votingType: VotingType;
  status: Status;
  sessionId?: string;
  authors?: string;
}

const votingTypes = {
  SECRET: "secreta",
  NOMINAL: "nominal",
};

interface TableLegislativeMattersProps {
  action?: boolean;
  cityCouncilId: string;
}

export function MattersTable({
  action = false,
  cityCouncilId,
}: TableLegislativeMattersProps) {
  const [legislativeMatters, setLegislativeMatters] = useState<
    LegislativeMatter[]
  >([]);

  const [page, setPage] = useState(1);
  const [loadingLegislativeMatters, setSetLoadingLegislativeMatters] =
    useState(true);
  const itemsPerPage = 10;

  const { isOpen, onOpenChange } = useModal();

  async function getLegislativeMatters() {
    setSetLoadingLegislativeMatters(true);
    const fetchLegislativeMattersUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/legislative-matter/fetch/${cityCouncilId}`
    );

    fetchLegislativeMattersUrl.searchParams.set("page", String(page));
    fetchLegislativeMattersUrl.searchParams.set(
      "itemsPerPage",
      String(itemsPerPage)
    );

    const response = await fetchApi(
      `${fetchLegislativeMattersUrl.pathname}${fetchLegislativeMattersUrl.search}`
    );

    if (!response.ok) {
      setSetLoadingLegislativeMatters(false);
      return;
    }

    const data = await response.json();

    setLegislativeMatters(data);
    setSetLoadingLegislativeMatters(false);
  }

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => currentPage - 1);
  }

  useEffect(() => {
    getLegislativeMatters();
  }, [page]);

  return (
    <div className="w-full">
      <Card className="col-span-2">

        <CardContent className="space-y-4">
          <Table>
            <TableCaption>Lista de matérias.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>

                <TableHead>Titulo</TableHead>
                <TableHead>Ementa</TableHead>
                <TableHead>Autor(es)</TableHead>

                <TableHead>Tipo</TableHead>
                <TableHead>Tipo de votação</TableHead>
                <TableHead>Documentos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {legislativeMatters &&
                legislativeMatters.map((legislativeMatter) => {
                  return (
                    <TableRow key={legislativeMatter.id}>
                      <TableCell className="font-medium">
                        {legislativeMatter.code}
                      </TableCell>
                      <TableCell className="font-medium truncate">
                        {legislativeMatter.title}
                      </TableCell>
                      <TableCell className="font-medium truncate">
                        {legislativeMatter.summary}
                      </TableCell>
                      <TableCell className="font-medium truncate">
                        {legislativeMatter.authors}
                      </TableCell>
                      <TableCell className="font-medium truncate">
                        {legislativeMatter.type}
                      </TableCell>
                      <TableCell className="font-medium truncate">
                        {votingTypes[legislativeMatter.votingType]}
                      </TableCell>
                      <TableCell className="font-medium truncate"></TableCell>

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
                              <Link
                                href={`/app/city-councils/${cityCouncilId}/legislative-matters/matters/${legislativeMatter.id}`}
                              >
                                Ver matéria
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
              disabled={legislativeMatters.length < itemsPerPage}
              onClick={nextPage}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
