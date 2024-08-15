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

export default function CityCouncil() {
  return (
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
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Responsável</h2>
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <Link
                href={`/app/users/1`}
                className="flex items-center justify-center group gap-2"
              >
                <p className="font-medium group-hover:text-zinc-600">
                  Jared Palmer
                </p>
                <ExternalLink className="h-4 w-4 group-hover:text-zinc-600" />
              </Link>
              <div className="text-muted-foreground">Account Manager</div>
              <div className="text-muted-foreground">example@acme.inc</div>
            </div>
          </div>
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
          <div className="mb-4">
            <Input
              type="search"
              placeholder="Search appointments..."
              // value={searchTerm}
              // onChange={handleSearch}
              className="w-full"
            />
          </div>
          <TableUsers />
        </div>

        <div className="bg-card p-6 rounded-lg shadow">
          <Link
            href={`/app/city-council/1/users`}
            className="flex items-center justify-start group gap-2 mb-4"
          >
            <h2 className="text-xl font-bold group-hover:text-zinc-700">
              Usuários
            </h2>

            <ExternalLink className="h-4 w-4 group-hover:text-zinc-700" />
          </Link>
          <div className="mb-4">
            <Input
              type="search"
              placeholder="Search appointments..."
              // value={searchTerm}
              // onChange={handleSearch}
              className="w-full"
            />
          </div>
          <TableUsers />
        </div>
      </div>
    </main>
  );
}
