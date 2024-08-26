import { FileCheck, FileClock, Landmark, SquareUserRound, Users } from 'lucide-react';
import { Role } from "@/permissions/roles";
import { ReactNode } from 'react';

interface Route {
  title: string;
  icon: ReactNode;
  href: string;
}


export const routes = (userRole: Role) => {
  let routesThatUserCanAccess: Route[] = [];

  switch (userRole) {
    case 'ADMIN':
      routesThatUserCanAccess = [
        {
          title: 'Sessões',
          icon: <FileCheck className="h-4 w-4" />,
          href: "/app/sessions"
        },
        {
          title: 'Profile',
          icon: <SquareUserRound className="h-4 w-4" />,
          href: "/app/profile"
        },
        {
          title: 'Logs',
          icon: <FileClock className="h-4 w-4" />,
          href: "/app/logs"
        },
        {
          title: 'Usuários',
          icon: <Users className="h-4 w-4" />,
          href: "/app/users"
        },
        {
          title: 'Câmaras',
          icon: <Landmark className="h-4 w-4" />,
          href: "/app/city-councils"
        }
      ];
      break;
    case 'PRESIDENT':
      routesThatUserCanAccess = [
        {
          title: 'Sessões',
          icon: <FileCheck className="h-4 w-4" />,
          href: "/app/sessions"
        },
        {
          title: 'Profile',
          icon: <SquareUserRound className="h-4 w-4" />,
          href: "/app/profile"
        },
        {
          title: 'Usuários',
          icon: <Users className="h-4 w-4" />,
          href: "/app/users"
        }
      ];
      break;
    case 'COUNCILOR':
      routesThatUserCanAccess = [
        {
          title: 'Sessões',
          icon: <FileCheck className="h-4 w-4" />,
          href: "/app/sessions"
        },
        {
          title: 'Profile',
          icon: <SquareUserRound className="h-4 w-4" />,
          href: "/app/profile"
        }
      ];
      break;
    case 'SECRETARY':
      routesThatUserCanAccess = [
        {
          title: 'Sessões',
          icon: <FileCheck className="h-4 w-4" />,
          href: "/app/sessions"
        },
        {
          title: 'Profile',
          icon: <SquareUserRound className="h-4 w-4" />,
          href: "/app/profile"
        }
      ];
      break;
    case 'ASSISTANT':
      routesThatUserCanAccess = [
        {
          title: 'Sessões',
          icon: <FileCheck className="h-4 w-4" />,
          href: "/app/sessions"
        },
        {
          title: 'Profile',
          icon: <SquareUserRound className="h-4 w-4" />,
          href: "/app/profile"
        },
        {
          title: 'Usuários',
          icon: <Users className="h-4 w-4" />,
          href: "/app/users"
        }
      ];
      break;
  }

  return routesThatUserCanAccess;
}