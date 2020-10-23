import Emoji from './Emoji';
import GuildChannel from './GuildChannel';
import GuildPreview from './GuildPreview';
import GuildTextChannel from './GuildTextChannel';
import GuildVoice from './GuildVoice';
import Member from './Member';
import Role from './Role';
import SnowDir from './SnowDir';
import SystemChannelFlags from './SystemChannelFlags';
import VoiceChannel from './VoiceChannel';
import Bot from '../Bot/Bot';
import DiscordAPIError from '../Errors/DiscordAPIError';
import { APIGUILD, APIGUILDPREVIEW, APIMEMBER, APIROLE, APITEXTCHANNEL, APIVOICECHANNEL, CHANNEL_TYPES } from '../constants/Types/Responses';
import { Snowflake, MFA_LEVEL, EXPLICIT_CONTENT_FILTER, PREMIUM_TIER } from '../constants/Types/Types';
// since its used as a type
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserAlike } from '../constants/util/Resolver';

export default class Guild {

     bot: Bot
     members = new SnowDir<Snowflake, Member>();
     emojis = new SnowDir<Snowflake, Emoji>();
     id!: Snowflake;
     isLarge = false;
     systemChannelID!: Snowflake;
     roles = new SnowDir<Snowflake, Role>();
     iconhash?: string;
     splashhash!: string;
     mfaLevel!: MFA_LEVEL;
     verificationLevel!: number;
     region!: string;
     unavailable!: boolean;
     locale!: string;
     features!: (
          'INVITE_SPLASH'
          | 'VIP_REGIONS'
          | 'VANITY_URL'
          | 'VERIFIED'
          | 'PARTNERED'
          | 'PUBLIC'
          | 'COMMERCE'
          | 'NEWS'
          | 'DISCOVERABLE'
          | 'FEATURABLE'
          | 'ANIMATED_ICON'
          | 'BANNER'
          | 'PUBLIC_DISABLED'
          | 'WELCOME_SCREEN_ENABLE'
     )[];
     ownerID!: Snowflake;
     afkTimeout!: number;
     publicUpdatesChannelID?: Snowflake;
     vanityInviteCode?: string;
     name!: string;
     afkChannelID?: Snowflake;
     joinedAt!: Date;
     //presences?: SnowDir<Snowflake, Presence>;
     applicationID?: Snowflake;
     rulesChannelID?: Snowflake;
     maxVideoChannelParticipants?: number;
     bannerhash?: string;
     contentFilter!: EXPLICIT_CONTENT_FILTER;
     voice: GuildVoice;
     discoverySplashhash?: string;
     nitroBoosterCount!: number;
     description?: string;
     systemChannelFlags!: SystemChannelFlags;
     allMessagesNotification!: boolean;
     large!: boolean;
     nitroBoostingLevel!: PREMIUM_TIER;
     everyone!: Role;
     channels = new SnowDir<Snowflake, GuildChannel>()

     constructor(bot: Bot, data: APIGUILD) {
          this.bot = bot;
          this.voice = new GuildVoice(this.bot, this);
          this.patch(data);
     }

     patch(data: APIGUILD): this {
          this.id = data.id;
          this.systemChannelID = data.system_channel_id;

          for (const emoji of data.emojis) {
               this.emojis.set(emoji.id, new Emoji(this.bot, emoji, this.id));
          }

          for (const role of data.roles) {
               this.roles.set(role.id, new Role(this.bot, this, role));
          }

          for (const channel of data.channels) {
               let constructedChannel: GuildChannel;
               if (channel.type === CHANNEL_TYPES.VOICE) constructedChannel = new VoiceChannel(this.bot, channel as APIVOICECHANNEL)
               else constructedChannel = new GuildTextChannel(this.bot, channel as APITEXTCHANNEL)

               this.bot.channels.set(channel.id, constructedChannel)
               this.channels.set(channel.id, constructedChannel)
          }

          this.iconhash = data.icon;
          this.splashhash = data.discovery_splash;

          for (const member of data.members) {
               this.members.set(member.user.id, new Member(this.bot, member, this));
          }

          this.features = data.features;
          this.nitroBoosterCount = data.premium_subscription_count;
          this.nitroBoostingLevel = data.premium_tier;
          this.allMessagesNotification = !!data.default_message_notifications;

          return this
     }

     async getPreview(): Promise<GuildPreview> {
          return new GuildPreview(
               this.bot,
               await this.bot.REST.discord<APIGUILDPREVIEW>().guilds(this.id).preview.get(),
          );
     }

     get systemChannel(): GuildTextChannel {
          return this.channels.get(this.systemChannelID);
     }

     // eslint-disable-next-line camelcase
     async addMember(UserAlike: UserAlike, access_token: string, options?: { nick: string; roles: Role[]; muted: boolean; deafen: boolean }): Promise<Member> {

          const user = this.bot.resolver.idOf(UserAlike)

          return new Member(this.bot, await this.bot.REST.discord<APIMEMBER>().guilds(this.id).members(user).put(JSON.stringify(Object.assign(access_token, options))), this)
     }

     async kickMember(UserAlike: UserAlike): Promise<Member> {
          
          const user = this.bot.resolver.idOf(UserAlike)

          if (!this.members.has(user)) throw new DiscordAPIError("User isn't in the guild!")

          const member = this.members.get(user)

          await this.bot.REST.discord<void>().guilds(this.id).members(user).delete()

          return member

     }

     async fetchRoles(): Promise<SnowDir<Snowflake, Role>> {
          this.roles = new SnowDir();
          const roles = await this.bot.REST.discord<APIROLE[]>().guilds(this.id).roles.get();

          for (const role of roles) {
               this.roles.set(role.id, new Role(this.bot, this, role));
          }

          return this.roles;
     }
}
