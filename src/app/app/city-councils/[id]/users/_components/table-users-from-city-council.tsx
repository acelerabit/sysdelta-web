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
import { SearchUsers } from "./search-users";
import { DataTable } from "./data-table-users";
import LoadingAnimation from "@/app/app/_components/loading-page";
import { useUser } from "@/contexts/user-context";
import { Badge } from "@/components/ui/badge";

export interface User {
  id: string;
  name: string;
  role: "ADMIN" | "PRESIDENT" | "ASSISTANT" | "COUNCILOR" | "SECRETARY";
  createdAt: string;
  email: string;
}

interface DateFilter {
  startDate: Date | null;
  endDate: Date | null;
}

interface UsersProps {
  cityCouncilId: string;
}

const roles = [
  {
    name: "admin",
    value: "ADMIN",
  },
  {
    name: "vereador / presidente",
    value: "PRESIDENT",
  },
  {
    name: "vereador / secretário",
    value: "SECRETARY",
  },
  {
    name: "vereador",
    value: "COUNCILOR",
  },
  {
    name: "auxiliar",
    value: "ASSISTANT",
  },
];

const rolesMapper = {
  ADMIN: "ADMINISTRADOR",
  PRESIDENT: "VEREADOR / PRESIDENTE",
  ASSISTANT: "AUXILIAR",
  SECRETARY: "VEREADOR / SECREATÁRIO",
  COUNCILOR: "VEREADOR",
};

export default function TableUsersFromCityCouncil({ cityCouncilId }: UsersProps) {
  const [users, setUsers] = useState<User[] | []>([]);
  const [page, setPage] = useState(1);
  const [role, setRole] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: null,
    endDate: null,
  });

  const [orderByField, setOrderByField] = useState<
    "createdAt" | "name" | "email" | "role"
  >("createdAt");
  const [orderDirection, setOrderDirection] = useState<"desc" | "asc">("desc");

  const itemsPerPage = 10;
  const [filter, setFilter] = useState("");
  const { user, loadingUser } = useUser();

  const handleSort = (
    sortField: "createdAt" | "name" | "email" | "role",
    direction: "desc" | "asc"
  ) => {
    setOrderByField(sortField);
    setOrderDirection(direction);
  };

  const handleValueChange = (newDateFilter: any) => {
    setDateFilter(newDateFilter);
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
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
              handleSort("name", orderDirection === "desc" ? "asc" : "desc")
            }
          >
            Nome
            <ArrowUpDown className="ml-2 h-4 w-4" />
            {orderByField === "name" && (
              <span className="text-[8px]">{orderDirection}</span>
            )}
          </Button>
        );
      },
    },
    {
      accessorKey: "email",
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
              handleSort("email", orderDirection === "desc" ? "asc" : "desc")
            }
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
            {orderByField === "email" && (
              <span className="text-[8px]">
                {/* {column.getIsSorted() && column.getIsSorted()} */}
                {orderDirection}
              </span>
            )}
          </Button>
        );
      },
    },
    {
      accessorKey: "Role",
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
              handleSort("role", orderDirection === "desc" ? "asc" : "desc")
            }
          >
            Role
            <ArrowUpDown className="ml-2 h-4 w-4" />
            {orderByField === "role" && (
              <span className="text-[8px]">
                {/* {column.getIsSorted() && column.getIsSorted()} */}
                {orderDirection}
              </span>
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <Badge className={`${rolesBadges[row.original.role]}`}>
            {rolesMapper[row.original.role]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "date",
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
                "createdAt",
                orderDirection === "desc" ? "asc" : "desc"
              )
            }
          >
            Criado em
            <ArrowUpDown className="ml-2 h-4 w-4" />
            {orderByField === "createdAt" && (
              <span className="text-[8px]">{orderDirection}</span>
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = new Date(row.original.createdAt);
        const formatted = new Intl.DateTimeFormat("pt-br").format(value);

        return <div>{formatted}</div>;
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
                <Link href={`/users/${row.original.id}`}>Ver detalhes</Link>
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
    const fetchUsersUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/city-council/${cityCouncilId}`
    );

    if (filter) {
      fetchUsersUrl.searchParams.set("name", filter);
      fetchUsersUrl.searchParams.set("email", filter);
    }

    if (dateFilter.startDate && dateFilter.endDate) {
      fetchUsersUrl.searchParams.set("startDate", String(dateFilter.startDate));
      fetchUsersUrl.searchParams.set("endDate", String(dateFilter.endDate));
    }

    if (role && role != "none") {
      fetchUsersUrl.searchParams.set("role", role);
    }

    fetchUsersUrl.searchParams.set("orderByField", orderByField);
    fetchUsersUrl.searchParams.set("orderDirection", orderDirection);

    fetchUsersUrl.searchParams.set("page", String(page));
    fetchUsersUrl.searchParams.set("itemsPerPage", String(itemsPerPage));

    const response = await fetchApi(
      `${fetchUsersUrl.pathname}${fetchUsersUrl.search}`
    );

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error);
      return;
    }

    const data: User[] = await response.json();

    setUsers(data);
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
          <SearchUsers handleFilterUsers={handleFilterProjects} />
        </div>
        <div className="w-full flex items-center gap-2">
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
          <Select value={role} onValueChange={(value) => setRole(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione um cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Roles</SelectLabel>
                <SelectItem value="none">---- Nenhum ----</SelectItem>
                {roles.map((role) => {
                  return (
                    <SelectItem key={role.value} value={role.value}>
                      {role.name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative pb-10 rounded-md">
        <DataTable
          columns={columns}
          data={users}
          page={page}
          itemsPerPage={itemsPerPage}
          nextPage={nextPage}
          previousPage={previousPage}
        />
      </div>
    </div>
  );
}
