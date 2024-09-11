"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { fetchApi } from "@/services/fetchApi";
import { toast } from "sonner";
import { SearchSessions } from "./search-sessions";
import { DataTable } from "./data-table-sessions";
import LoadingAnimation from "@/app/app/_components/loading-page";
import { useUser } from "@/contexts/user-context";
import { Badge } from "@/components/ui/badge";

export type SessionTypes = 'ORDINARY';
export type SessionStatus =
  | 'SCHEDULED'
  | 'STARTED'
  | 'SUSPENDED'
  | 'POSTPONED'
  | 'CLOSED'
  | 'CANCELED';

const sessionStatus = {
  SCHEDULED: 'agendado',
  STARTED: 'iniciado',
  SUSPENDED: 'suspendido',
  POSTPONED: 'adiado',
  CLOSED: 'fechado',
  CANCELED: 'cancelado'
}

export interface Session {
  id: string;
  legislature: string;
  type: SessionTypes;
  numberSession: number;
  openingDateTime: Date;
  closingDateTime: Date;
  sessionStatus: SessionStatus;
  createdAt: Date;
}

interface DateFilter {
  startDate: Date | null;
  endDate: Date | null;
}

interface SessionsProps {
  cityCouncilId: string;
}

const sessionTypes = {
  ORDINARY: 'ordinária'
}

export default function TableSessionsFromCityCouncil({
  cityCouncilId,
}: SessionsProps) {
  const [sessions, setSessions] = useState<Session[] | []>([]);
  const [page, setPage] = useState(1);
  const [role, setRole] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: null,
    endDate: null,
  });

  const [orderByField, setOrderByField] = useState<
    "type" | "openingDateTime" | "closingDateTime"
  >("type");
  const [orderDirection, setOrderDirection] = useState<"desc" | "asc">("desc");

  const itemsPerPage = 10;
  const [filter, setFilter] = useState("");
  const { user, loadingUser } = useUser();

  const handleSort = (
    sortField: "type" | "openingDateTime" | "closingDateTime",
    direction: "desc" | "asc"
  ) => {
    setOrderByField(sortField);
    setOrderDirection(direction);
  };

  const handleValueChange = (newDateFilter: any) => {
    setDateFilter(newDateFilter);
  };

  const columns: ColumnDef<Session>[] = [
    {
      accessorKey: "type",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={`p-0 ${
              column.getIsSorted() === "asc" || column.getIsSorted() === "desc"
                ? "text-accent-foreground"
                : ""
            }`}
            onClick={() =>
              handleSort("type", orderDirection === "desc" ? "asc" : "desc")
            }
          >
            Tipo
            <ArrowUpDown className="ml-2 h-4 w-4" />
            {orderByField === "type" && (
              <span className="text-[8px]">{orderDirection}</span>
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div>{sessionTypes[row.original.type]}</div>;
      },
    },
    {
      accessorKey: "numberSession",
      header: ({ column }) => {
        return <p>Número da sessão</p>;
      },
      cell: ({ row }) => {
        return <div>{row.original.numberSession}</div>;
      },
    },
    {
      accessorKey: "openingDateTime",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={`p-0 ${
              column.getIsSorted() === "asc" || column.getIsSorted() === "desc"
                ? "text-accent-foreground"
                : ""
            }`}
            onClick={() =>
              handleSort(
                "openingDateTime",
                orderDirection === "desc" ? "asc" : "desc"
              )
            }
          >
            Dia de abertura
            <ArrowUpDown className="ml-2 h-4 w-4" />
            {orderByField === "openingDateTime" && (
              <span className="text-[8px]">{orderDirection}</span>
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = new Date(row.original.openingDateTime);
        const formatted = new Intl.DateTimeFormat("pt-br").format(value);

        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: "closingDateTime",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={`p-0 ${
              column.getIsSorted() === "asc" || column.getIsSorted() === "desc"
                ? "text-accent-foreground"
                : ""
            }`}
            onClick={() =>
              handleSort(
                "closingDateTime",
                orderDirection === "desc" ? "asc" : "desc"
              )
            }
          >
            Dia de encerramento
            <ArrowUpDown className="ml-2 h-4 w-4" />
            {orderByField === "closingDateTime" && (
              <span className="text-[8px]">{orderDirection}</span>
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = new Date(row.original.closingDateTime);
        const formatted = new Intl.DateTimeFormat("pt-br").format(value);

        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: "sessionStatus",
      header: ({ column }) => {
        return <p>Status</p>;
      },
      cell: ({ row }) => {
        return <div>{sessionStatus[row.original.sessionStatus]}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu </span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/app/city-councils/${cityCouncilId}/sessions/${row.original.id}`}>
                  Ver detalhes
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  function handleFilterProjects(filter: string) {
    setPage(1);
    setFilter(filter);
  }

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => currentPage - 1);
  }

  const queryData = async () => {
    const fetchSessionsUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/session/fetch/${cityCouncilId}`
    );

    // fetchSessionsUrl.searchParams.set("orderByField", orderByField);
    // fetchSessionsUrl.searchParams.set("orderDirection", orderDirection);

    fetchSessionsUrl.searchParams.set("page", String(page));
    fetchSessionsUrl.searchParams.set("itemsPerPage", String(itemsPerPage));

    const response = await fetchApi(
      `${fetchSessionsUrl.pathname}${fetchSessionsUrl.search}`
    );

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error);
      return;
    }

    const data: Session[] = await response.json();

    setSessions(data);
  };

  useEffect(() => {
    queryData();
  }, [filter, page, orderDirection, orderByField, dateFilter, role]);

  const rolesBadges = {
    PRESIDENT: "bg-violet-500 hover:bg-violet-700",
    ADMIN: "bg-yellow-500 hover:bg-yellow-700",
    COUNCILOR: "bg-green-500 hover:bg-green-700",
    SECRETARY: "bg-blue-500 hover:bg-blue-700",
    ASSISTANT: "bg-rose-500 hover:bg-rose-700",
  };

  if (loadingUser) {
    return <LoadingAnimation />;
  }

  return (
    <div className="w-full h-full flex flex-col relative">
      <div>
        <div className="w-full flex items-center justify-between">
          <SearchSessions handleFilterSessions={handleFilterProjects} />
        </div>
        {/* <div className="w-full flex items-center gap-2">
          <div className="w-full md:max-w-xs my-4">
            <Datepicker
              containerClassName="relative border rounded-md border-zinc-300"
              popoverDirection="down"
              primaryColor={"blue"}
              showShortcuts={true}
              placeholder={"DD/MM/YYYY ~ DD/MM/YYYY"}
              displayFormat={"DD/MM/YYYY"}
              value={dateFilter}
              onChange={handleValueChange}
            />
          </div>
        </div> */}
      </div>

      <div className="relative pb-10 rounded-md">
        <DataTable
          columns={columns}
          data={sessions}
          page={page}
          itemsPerPage={itemsPerPage}
          nextPage={nextPage}
          previousPage={previousPage}
        />
      </div>
    </div>
  );
}
