import User from "./User"
import { Bot } from "../Bot"
import { APIUSER } from "../constants/Types/Responses"
import { Data, Snowflake, Status } from '../constants/Types/Types'
import DataUtil from "../constants/util/DataUtil"

export default class ClientUser extends User {
     bot!: Bot
     id!: Snowflake
     private presence: {
          game?: { name: string; type: 0 | 1 | 2; url?: string }
          afk: boolean
          status: Status
     }

     constructor(bot: Bot, data: APIUSER) {
          super(bot, data)
          this.presence = { status: "online", afk: false }
     }

     async update(options: { username: string; avatar: Data }): Promise<this> {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (options.avatar) options.avatar = await DataUtil.image(options.avatar)

          return this.patch(await this.bot.REST.discord<APIUSER>().me.patch(JSON.stringify(options)))
     }

     setPresence(options: { game?: { name: string; type: 0 | 1 | 2; url?: string }; afk?: boolean; status?: Status }): undefined {
          this.presence = options = Object.assign(this.presence, options)


          this.bot.ws.send({
               op: 3,
               d: options,
          })

          return
     }
}
