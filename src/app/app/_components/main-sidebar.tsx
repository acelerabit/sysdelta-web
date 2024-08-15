import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BarChart,
  ChevronRight,
  CreditCard,
  FileCheck,
  FileClock,
  Landmark,
  LayoutList,
  Menu,
  Mountain,
  ShoppingBasket,
  SquareUserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { DropdownSettings } from "./dropdown-settings";
import { Notifications } from "./notifications";

export function MainSidebar({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block lg:w-[280px] lg:shrink-0 lg:border-r lg:bg-gray-100/40 lg:dark:bg-gray-800/40">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="#">
              <Mountain className="h-6 w-6" />
              <span className="">Acme Inc</span>
            </Link>
            <Notifications />
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/app/profile"
              >
                <SquareUserRound className="h-4 w-4" />
                Perfil
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/app/city-councils"
              >
                <Landmark className="h-4 w-4" />
                Câmaras
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/app/users"
              >
                <Users className="h-4 w-4" />
                Usuários
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/app/sessions"
              >
                <FileCheck className="h-4 w-4" />
                Sessões
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/app/logs"
              >
                <FileClock className="h-4 w-4" />
                Logs
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 lg:h-[60px] justify-between lg:justify-end items-center  gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="lg:hidden" size="icon" variant="outline">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-[60px] items-center border-b px-6">
                  <Link
                    className="flex items-center gap-2 font-semibold"
                    href="#"
                  >
                    <Mountain className="h-6 w-6" />
                    <span className="">Acme Inc</span>
                  </Link>
                  <Notifications />
                </div>
                <div className="flex-1 overflow-auto py-2">
                  <nav className="grid items-start px-4 text-sm font-medium">
                    <Link
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      href="/app/profile"
                    >
                      <SquareUserRound className="h-4 w-4" />
                      Perfil
                    </Link>
                    <Link
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      href="/app/city-councils"
                    >
                      <Landmark className="h-4 w-4" />
                      Câmaras
                    </Link>
                    <Link
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      href="/app/users"
                    >
                      <Users className="h-4 w-4" />
                      Usuários
                    </Link>
                    <Link
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      href="/app/sessions"
                    >
                      <FileCheck className="h-4 w-4" />
                      Sessões
                    </Link>
                    <Link
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      href="/app/logs"
                    >
                      <FileClock className="h-4 w-4" />
                      Logs
                    </Link>
                  </nav>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link className="lg:hidden" href="#">
            <Mountain className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <DropdownSettings />
        </header>

        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
