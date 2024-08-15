import { AbilityBuilder } from "@casl/ability";
import { AppAbility } from ".";
import { User } from "./models/user";
import { Role } from "./roles";


type PermissionsByRole = (user: User, builder: AbilityBuilder<AppAbility>) => void;

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN(user, { can, cannot }) {
    can('manage', 'all')
  },
  PRESIDENT(user, { can }) {
    can('manage', 'User')
    can('manage', 'Session')
  },
  COUNCILOR(user, { can }) {
    can(['get', 'update'], 'User', {
      id: {
        $eq: user.id
      }
    })
    can('get', 'Session')
  },
  SECRETARY(user, { can }) {
    can(['get', 'update'], 'User', {
      id: {
        $eq: user.id
      }
    })
    can(['get', 'update'], 'Session')
  },
  ASSISTANT(user, { can }) {
    can('get', 'User')
    can(['update'], 'User', {
      id: {
        $eq: user.id
      }
    })
    can('list', 'User')
    can('create', 'User', {
      role: {
        $eq: 'COUNCILOR'
      }
    })
    can('manage', 'Session')
  }
}