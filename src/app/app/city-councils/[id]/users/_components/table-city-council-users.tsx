"use client";

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
import useModal from "@/hooks/use-modal";
import { AddUserCityCouncilDialog } from "./add-user-city-council-dialog";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface TableCityCouncilUsersProps {
  cityCouncilId: string;
}

export function TableCityCouncilUsers({
  cityCouncilId,
}: TableCityCouncilUsersProps) {
  const [users, setUsers] = useState<User[]>([]);

  const [page, setPage] = useState(1);
  const [loadingUsers, setSetLoadingUsers] = useState(true);
  const itemsPerPage = 2;

  const { isOpen, onOpenChange } = useModal();

  async function getUsers() {
    setSetLoadingUsers(true);
    const fetchUsersUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/city-council/${cityCouncilId}`
    );

    fetchUsersUrl.searchParams.set("page", String(page));
    fetchUsersUrl.searchParams.set("itemsPerPage", String(itemsPerPage));

    const response = await fetchApi(
      `${fetchUsersUrl.pathname}${fetchUsersUrl.search}`
    );

    if (!response.ok) {
      setSetLoadingUsers(false);
      return;
    }

    const data = await response.json();

    console.log()
    setUsers(data);
    setSetLoadingUsers(false);
  }

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => currentPage - 1);
  }

  useEffect(() => {
    getUsers();
  }, [page]);

  const rolesBadges = {
    USER: "bg-violet-500 hover:bg-violet-700",
    ADMIN: "bg-yellow-500 hover:bg-yellow-700",
  };

  return (
    <>
      <Card className="col-span-2">
        <CardContent className="space-y-4">
          <Table>
            <TableCaption>Lista de usuários.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>

                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users &&
                users.map((user) => {
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.id.substring(0, 10)}
                      </TableCell>
                      <TableCell className="font-medium truncate">
                        {user.name}
                      </TableCell>
                      <TableCell className="font-medium truncate">
                        {user.email}
                      </TableCell>
                      <TableCell className="font-medium truncate">
                        <Badge
                          className={`${
                            user.role === "ADMIN"
                              ? rolesBadges.ADMIN
                              : rolesBadges.USER
                          }`}
                        >
                          {user.role}
                        </Badge>
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
                              <Link href={`/app/users/${user.id}`}>
                                Ver usuário
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
              disabled={users.length < itemsPerPage}
              onClick={nextPage}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <AddUserCityCouncilDialog open={isOpen} onOpenChange={onOpenChange} cityCouncilId={cityCouncilId} />
    </>
  );
}
