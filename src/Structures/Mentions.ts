/* eslint-disable camelcase */ // Because of the guild_id
import Channel from './Channel';
import GuildTextChannel from './GuildTextChannel';
import Message from './Message';
import Role from './Role';
import SnowDir from './SnowDir';
import User from './User';
import { APIROLE, APIUSER, CHANNEL_TYPES } from '../constants/Types/Responses';
import { Snowflake } from '../constants/Types/Types';

export default class Mentions {
     message: Message
     users: SnowDir<Snowflake, User>
     roles: SnowDir<Snowflake, Role>
     channels: SnowDir<Snowflake, Channel>
     partialChannels: SnowDir<Snowflake, { id: Snowflake, guild_id: Snowflake, type: CHANNEL_TYPES }>
     everyone: boolean

     constructor(message: Message, users: APIUSER[], roles: APIROLE[], channels: { id: Snowflake, guild_id: Snowflake, type: CHANNEL_TYPES }[], everyone: boolean) {
          this.message = message
          this.users = message.bot.users.findAll(v => users.map(x => x.id).includes(v.id))
          if (roles.length) {
               this.roles = (message.channel as GuildTextChannel).guild.roles.findAll(x => roles.map(y => y.id).includes(x.id))
          } else this.roles = new SnowDir()
          if (channels) this.channels = message.bot.channels.findAll(v => channels.map(x => x.id).includes(v.id))
          else this.channels = new SnowDir()
          if (channels) this.partialChannels = SnowDir.from(channels, ({ id }) => id)
          else this.partialChannels = new SnowDir()
          this.everyone = everyone
     }


}