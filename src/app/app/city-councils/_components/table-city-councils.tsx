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
import { fetchApi } from "@/services/fetchApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Council {
  id: string;
  name: string;
  responsible: {
    name: string;
    role: "ADMIN" | "PRESIDENT" | "COUNCILOR" | "SECRETARY" | "ASSISTANT";
  };
}

export function TableCityCouncils() {
  const [councils, setCouncils] = useState<Council[]>([]);

  const [page, setPage] = useState(1);

  const itemsPerPage = 2;

  const [loadingCouncils, setSetLoadingCouncils] = useState(true);

  async function getCouncils() {
    setSetLoadingCouncils(true);
    const fetchCouncilsUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/councils`
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

  const rolesBadges = {
    PRESIDENT: "bg-violet-500 hover:bg-violet-700",
    ADMIN: "bg-yellow-500 hover:bg-yellow-700",
    COUNCILOR: "bg-green-500 hover:bg-green-700",
    SECRETARY: "bg-blue-500 hover:bg-blue-700",
    ASSISTANT: "bg-rose-500 hover:bg-rose-700",
  };

  return (
    <Card className="col-span-2">
      <CardContent className="space-y-4">
        <Table>
          <TableCaption>Lista de câmaras.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do município</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Cargo do responsável</TableHead>
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
                      {council.responsible.name}
                    </TableCell>
                    <TableCell className="font-medium truncate">
                      <Badge
                        className={`${rolesBadges[council.responsible.role]}`}
                      >
                        {council.responsible.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <EllipsisVertical className="h-5 w-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem className="cursor-pointer" asChild>
                            <Link href={`/app/city-council/${council.id}`}>
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
  );
}
