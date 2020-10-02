import { BitFieldResolvable } from "./Bitfield"
import Guild from "./Guild"
import Member from "./Member"
import Permissions from "./Permissions"
import Role from "./Role"
import { Snowflake } from '../constants/Types/Types'

export default class PermissionOverwrite {
  id: Snowflake
  type: "role" | "member"
  allow: Permissions
  deny: Permissions
  guild: Guild

  constructor(id: Snowflake, type: "role" | "member", allow: BitFieldResolvable, deny: BitFieldResolvable, guild: Guild) {
       this.id = id
       this.type = type
       this.allow = new Permissions(allow)
       this.deny = new Permissions(deny)
       this.guild = guild
  }

  get owner(): Role | Member {
       if (this.type === "member") return this.guild.members.get(this.id)
       else return this.guild.roles.get(this.id)
  }

  public toJSON(): string {
       return JSON.stringify({
            id: this.id,
            type: this.type,
            allow: this.allow,
            deny: this.deny,
       })
  }
}

export interface MemberPermissionOverwrite extends PermissionOverwrite {
  type: "member"
  owner: Member
}

export interface RolePermissionOverwrite extends PermissionOverwrite {
  type: "role"
  owner: Role
}
