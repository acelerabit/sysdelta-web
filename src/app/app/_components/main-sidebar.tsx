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
import { ActiveLink } from "./active-link";
import { useUser } from "@/contexts/user-context";
import LoadingAnimation from "./loading-page";
import { routes } from "./routes";

export function MainSidebar({ children }: { children: ReactNode }) {
  const { user, loadingUser } = useUser();

  if (loadingUser || !user) {
    return <LoadingAnimation />;
  }
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
              {routes(user.role).map((route) => {
                return (
                  <ActiveLink
                    key={route.href}
                    title={route.title}
                    href={route.href}
                    icon={route.icon}
                  />
                );
              })}
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
                    {routes(user.role).map((route) => {
                      return (
                        <ActiveLink
                          key={route.href}
                          title={route.title}
                          href={route.href}
                          icon={route.icon}
                        />
                      );
                    })}
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
