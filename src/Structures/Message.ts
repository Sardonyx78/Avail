import Attachment from './Attachment'
import Embed from './Embed'
import GuildTextChannel from './GuildTextChannel'
import Member from './Member'
import Mentions from './Mentions'
import MessageFlags from './MessageFlags'
import SnowDir from "./SnowDir"
import TextChannel from './TextChannel'
import User from "./User"
import Bot from "../Bot/Bot"
import { APIMESSAGE, APIUSER, MESSAGE_TYPES } from "../constants/Types/Responses"
import { Snowflake } from '../constants/Types/Types'

export default class Message {

     id!: Snowflake
     reactions: SnowDir<string, User[]>
     private cachedAuthorData!: APIUSER
     private cachedEditedAt?: Date 
     attachments = new SnowDir<Snowflake, Attachment>()
     tts!: boolean
     embeds: Embed[] = []
     creation!: Date
     pinned!: boolean
     bot: Bot
     channelID!: string
     mentions!: Mentions
     edited!: boolean
     nonce?: string | number
     content!: string
     type!: MESSAGE_TYPES
     flags!: MessageFlags
     authorID!: string

     constructor(bot: Bot, data: APIMESSAGE) {
          this.bot = bot
          this.patch(data)
          this.reactions = new SnowDir()
     }

     patch(data: APIMESSAGE): this {
          this.id = data.id
          this.authorID = data.author.id
          this.tts = data.tts
          
          for (const attachment of data.attachments) 
               this.attachments.set(attachment.id, new Attachment(attachment))
          
          for (const embed of data.embeds)
               this.embeds.push(new Embed(embed))

          this.creation = new Date(data.timestamp)

          this.pinned = data.pinned

          this.channelID = data.channel_id

          this.mentions = new Mentions(this, data.mentions, data.mention_roles, data.mention_channels, data.mention_everyone)

          this.nonce = data.nonce

          this.content = data.content || ""

          this.type = data.type

          this.flags = new MessageFlags(data.flags || 0)

          //this.reference = new MessageReference(this, data.reference)

          //this.activity = new MessageApplication(this, data.activity, data.application)

          return this
     }

     get channel(): TextChannel {
          return this.bot.channels.get<TextChannel>(this.channelID)
     }

     get editedAt(): Date {
          return this.cachedEditedAt || this.creation
     }

     get author(): User {
          return this.bot.users.get(this.authorID)
     }

     get member(): Member {
          return (this.channel as GuildTextChannel).guild.members.get(this.authorID)
     }
}
