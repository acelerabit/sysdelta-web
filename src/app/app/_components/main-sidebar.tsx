import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CollapsibleTrigger,
  CollapsibleContent,
  Collapsible,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { ReactNode } from "react";
import { UpgradeCard } from "./upgrade-card";
import { DropdownSettings } from "./dropdown-settings";
import { BarChart, CreditCard, LayoutList, ShoppingBasket, SquareUserRound, Users } from "lucide-react";
import { Notifications } from "./notifications";

export function MainSidebar({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block lg:w-[280px] lg:shrink-0 lg:border-r lg:bg-gray-100/40 lg:dark:bg-gray-800/40">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="#">
              <MountainIcon className="h-6 w-6" />
              <span className="">Acme Inc</span>
            </Link>
            <Notifications />
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/"
              >
                <HomeIcon className="h-4 w-4" />
                Home
              </Link>
              <Collapsible className="grid gap-4">
                <CollapsibleTrigger className="flex items-center gap-3 rounded-lg py-2 [&[data-state=open]>svg]:rotate-90">
                  <div
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                    // href="#"
                  >
                    <ShoppingBasket className="h-4 w-4" />
                    Products
                  </div>
                  <ChevronRightIcon className="ml-auto h-5 w-5 transition-all" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="ml-2 p-2 space-y-4 bg-gray-100 dark:bg-gray-800">
                    <Link
                      className="group grid h-auto w-full justify-start gap-1"
                      href="#"
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        Shoes
                      </div>
                    </Link>
                    <Link
                      className="group grid h-auto w-full justify-start gap-1"
                      href="#"
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        Tops & T-Shirts
                      </div>
                    </Link>
                    <Link
                      className="group grid h-auto w-full justify-start gap-1"
                      href="#"
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        Shorts
                      </div>
                    </Link>
                    <Link
                      className="group grid h-auto w-full justify-start gap-1"
                      href="#"
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        Hoodies & Pullovers
                      </div>
                    </Link>
                    <Link
                      className="group grid h-auto w-full justify-start gap-1"
                      href="#"
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        Pants & Tights
                      </div>
                    </Link>
                    <Link
                      className="group grid h-auto w-full justify-start gap-1"
                      href="#"
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        Jackets & Vests
                      </div>
                    </Link>
                    <Link
                      className="group grid h-auto w-full justify-start gap-1"
                      href="#"
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        Tracksuits
                      </div>
                    </Link>
                    <Link
                      className="group grid h-auto w-full justify-start gap-1"
                      href="#"
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        Jordan
                      </div>
                    </Link>
                    <Link
                      className="group grid h-auto w-full justify-start gap-1"
                      href="#"
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        Socks
                      </div>
                    </Link>
                    <Link
                      className="group grid h-auto w-full justify-start gap-1"
                      href="#"
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        Accessories & Equipment
                      </div>
                    </Link>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/app/profile"
              >
                <SquareUserRound className="h-4 w-4" />
                Profile
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/app/dashboard"
              >
                <BarChart className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/app/users"
              >
                <Users className="h-4 w-4" />
                Users
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/app/subscription"
              >
                <CreditCard className="h-4 w-4" />
                Subscription
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/app/plans"
              >
                <LayoutList className="h-4 w-4" />
                Plans
              </Link>
            </nav>
          </div>
          <div className="p-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="sm">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 lg:h-[60px] justify-between lg:justify-end items-center  gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="lg:hidden" size="icon" variant="outline">
                <MenuIcon className="h-6 w-6" />
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
                    <MountainIcon className="h-6 w-6" />
                    <span className="">Acme Inc</span>
                  </Link>
                  <Notifications />
                </div>
                <div className="flex-1 overflow-auto py-2">
                  <nav className="grid items-start px-4 text-sm font-medium">
                    <Link
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      href="/app"
                    >
                      <HomeIcon className="h-4 w-4" />
                      Home
                    </Link>
                    <Collapsible className="grid gap-4">
                      <CollapsibleTrigger className="flex text-lg items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-5 [&[data-state=open]>svg]:rotate-90">
                        Products
                        <ChevronRightIcon className="ml-auto h-5 w-5 transition-all" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="p-2 space-y-4 bg-gray-100 dark:bg-gray-800">
                          <Link
                            className="group grid h-auto w-full justify-start gap-1"
                            href="#"
                          >
                            <div className="text-sm font-medium leading-none group-hover:underline">
                              Shoes
                            </div>
                          </Link>
                          <Link
                            className="group grid h-auto w-full justify-start gap-1"
                            href="#"
                          >
                            <div className="text-sm font-medium leading-none group-hover:underline">
                              Tops & T-Shirts
                            </div>
                          </Link>
                          <Link
                            className="group grid h-auto w-full justify-start gap-1"
                            href="#"
                          >
                            <div className="text-sm font-medium leading-none group-hover:underline">
                              Shorts
                            </div>
                          </Link>
                          <Link
                            className="group grid h-auto w-full justify-start gap-1"
                            href="#"
                          >
                            <div className="text-sm font-medium leading-none group-hover:underline">
                              Hoodies & Pullovers
                            </div>
                          </Link>
                          <Link
                            className="group grid h-auto w-full justify-start gap-1"
                            href="#"
                          >
                            <div className="text-sm font-medium leading-none group-hover:underline">
                              Pants & Tights
                            </div>
                          </Link>
                          <Link
                            className="group grid h-auto w-full justify-start gap-1"
                            href="#"
                          >
                            <div className="text-sm font-medium leading-none group-hover:underline">
                              Jackets & Vests
                            </div>
                          </Link>
                          <Link
                            className="group grid h-auto w-full justify-start gap-1"
                            href="#"
                          >
                            <div className="text-sm font-medium leading-none group-hover:underline">
                              Tracksuits
                            </div>
                          </Link>
                          <Link
                            className="group grid h-auto w-full justify-start gap-1"
                            href="#"
                          >
                            <div className="text-sm font-medium leading-none group-hover:underline">
                              Jordan
                            </div>
                          </Link>
                          <Link
                            className="group grid h-auto w-full justify-start gap-1"
                            href="#"
                          >
                            <div className="text-sm font-medium leading-none group-hover:underline">
                              Socks
                            </div>
                          </Link>
                          <Link
                            className="group grid h-auto w-full justify-start gap-1"
                            href="#"
                          >
                            <div className="text-sm font-medium leading-none group-hover:underline">
                              Accessories & Equipment
                            </div>
                          </Link>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                    <Link
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      href="/app/profile"
                    >
                      <SquareUserRound className="h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      href="/app/dashboard"
                    >
                      <BarChart className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      href="/app/users"
                    >
                      <Users className="h-4 w-4" />
                      Users
                    </Link>
                  </nav>
                </div>
                <UpgradeCard />
              </div>
            </SheetContent>
          </Sheet>
          <Link className="lg:hidden" href="#">
            <MountainIcon className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <DropdownSettings />
        </header>

        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}

function BellIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function ChevronRightIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function HomeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function LineChartIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}

function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ShoppingCartIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
