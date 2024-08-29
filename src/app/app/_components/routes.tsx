import { FileCheck, FileClock, Landmark, SquareUserRound, Users } from 'lucide-react';
import { ReactNode } from 'react';

interface Route {
  title: string;
  icon: ReactNode;
  href: string;
}

interface User {
  id: string;
  role: 'ADMIN' | 'PRESIDENT' | 'SECRETARY' | 'ASSISTANT' | 'COUNCILOR',
  affiliatedCouncil: {
    id: string;
    name: string;
  }
}


export const routes = (user: User) => {
  let routesThatUserCanAccess: Route[] = [];

  switch (user.role) {
    case 'ADMIN':
      routesThatUserCanAccess = [
        {
          title: 'Perfil',
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
          href: `/app/city-councils/${user.affiliatedCouncil.id}/sessions`
        },
        {
          title: 'Perfil',
          icon: <SquareUserRound className="h-4 w-4" />,
          href: "/app/profile"
        },
        {
          title: 'Usuários',
          icon: <Users className="h-4 w-4" />,
          href: `/app/city-councils/${user.affiliatedCouncil.id}/users`
        }
      ];
      break;
    case 'COUNCILOR':
      routesThatUserCanAccess = [
        {
          title: 'Sessões',
          icon: <FileCheck className="h-4 w-4" />,
          href: `/app/city-councils/${user.affiliatedCouncil.id}/sessions`
        },
        {
          title: 'Perfil',
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
           href: `/app/city-councils/${user.affiliatedCouncil.id}/sessions`
        },
        {
          title: 'Perfil',
          icon: <SquareUserRound className="h-4 w-4" />,
          href: "/app/profile"
        }
      ];
      break;
    case 'ASSISTANT':
      routesThatUserCanAccess = [
        {
          title: 'Perfil',
          icon: <SquareUserRound className="h-4 w-4" />,
          href: "/app/profile"
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
  }

  return routesThatUserCanAccess;
}