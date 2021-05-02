import GuildChannel from './GuildChannel';
import Message from './Message';
import SnowDir from './SnowDir';
import TextChannel, { MessageConvertable, MessageOptions } from './TextChannel';
import { Bot } from '../Bot';
import DiscordAPIError from '../Errors/DiscordAPIError';
import { APITEXTCHANNEL } from '../constants/Types/Responses';
import { Snowflake } from '../constants/Types/Types';
import Guild from './Guild';


export default class GuildTextChannel extends GuildChannel implements TextChannel {
     messages = new SnowDir<Snowflake, Message>()

     constructor(bot: Bot, data: APITEXTCHANNEL, guild: Guild) {
          super(bot, data, guild)
     }
     
     send(options: MessageOptions): Promise<Message>;
     send(msg: MessageConvertable, options?: MessageOptions): Promise<Message>;
     send(msg: MessageConvertable, options?: MessageOptions): Promise<Message> {
          return TextChannel.prototype.send.call(this, msg, options)
     }

     async bulkDelete(messages: Snowflake[] | SnowDir<Snowflake, Message> | number | Message[]): Promise<SnowDir<Snowflake, Message>> {
          let res: Snowflake[];

          if (messages instanceof SnowDir) {
               if (!messages.ask(msg => msg.channel.id === this.id)) throw new DiscordAPIError("All messages have to be in the executed channel!")
               else res = messages.map(x => x.id)
          } else if (typeof messages === "number") {
               return this.bulkDelete(this.messages.last(messages))
          } else {
               if (!Array.isArray(messages)) throw new DiscordAPIError("Supplied messages are not valid")

               res = (messages as Array<Snowflake | Message>).map((msg: Snowflake | Message) => msg instanceof Message ? msg.id : msg)
          }

          const toBeReturned = this.messages.findAll(x => res.includes(x.id)).clone()

          this.bot.REST.discord<void>().channels(this.id)["bulk-delete"].post(JSON.stringify(res))

          return toBeReturned
     }

}