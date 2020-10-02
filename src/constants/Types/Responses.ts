/* eslint-disable camelcase */
/** This page is full of the API Response objects as types */

import { NITRO, Snowflake, PREMIUM_TIER, EXPLICIT_CONTENT_FILTER } from './Types';
import { BitFieldResolvable } from "../../Structures/Bitfield"

export interface APIUSER {
	id: string
	username: string
	discriminator: string
	avatar: string
	system: boolean
	flags: number
	premium_type: NITRO
	public_flags: number
	bot: boolean
}

export enum MESSAGE_ACTIVITY_TYPES {
	JOIN = 0,
	SPECTATE = 1,
	LISTEN = 3,
	JOIN_REQUEST = 4,
}

export enum MESSAGE_TYPES {
	DEFAULT = 0,
	RECIPIENT_ADD = 1,
	RECIPIENT_REMOVE = 2,
	CALL = 3,
	CHANNEL_NAME_CHANGE = 4,
	CHANNEL_ICON_CHANGE = 5,
	CHANNEL_PINNED_MESSAGE = 6,
	GUILD_MEMBER_JOIN = 7,
	USER_PREMIUM_GUILD_SUBSCRIPTION = 8,
	USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1 = 9,
	USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2 = 10,
	USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3 = 11,
	CHANNEL_FOLLOW_ADD = 12,
	GUILD_DISCOVERY_DISQUALIFIED = 14,
	GUILD_DISCOVERY_REQUALIFIED = 15,
}

export interface APIMESSAGE_APPLICATION {
	id: Snowflake
	cover_image?: string
	description: string
	icon?: string
	name: string
}

export interface APICHANNEL {
	type: CHANNEL_TYPES
	id: Snowflake
}

export interface APIDMCHANNEL extends APICHANNEL {
	last_message_id?: string
	recipients: APIUSER[]
}

export interface APITEXTCHANNEL extends APICHANNEL {
	guild_id: Snowflake
	name: string
	position: number
	permission_overwrites: APIPERMS[]
	rate_limit_per_user: number
	nsfw: boolean
	topic: string
	last_message_id: Snowflake
	parent_id: Snowflake
}

export interface APICATEGORYCHANNEL extends APICHANNEL {
	permission_overwrites: APIPERMS[]
	name: string
	parent_id: null
	nsfw: false
	position: number
	guild_id: Snowflake
}

export interface APIVOICECHANNEL extends APICHANNEL {
	guild_id: Snowflake
	name: string
	type: number
	nsfw: boolean
	position: number
	permission_overwrites: APIPERMS[]
	bitrate: number
	user_limit: number
	parent_id: Snowflake
}

export interface APIPERMS {
	id: Snowflake
	type: "role" | "member"
	allow: BitFieldResolvable
	allow_new: BitFieldResolvable
	deny: BitFieldResolvable
	deny_new: BitFieldResolvable
}

export enum CHANNEL_TYPES {
	TEXT = 0,
	DM = 1,
	VOICE = 2,
	GROUP_DM = 3,
	CATEGORY = 4,
	NEWS = 5,
	STORE = 6,
}

export interface APIMESSAGE {
	reactions: APIREACTION[]
	attachments: APIATTACHMENT[]
	tts: boolean
	embeds: APIEMBED[]
	timestamp: string
	mention_everyone: boolean
	id: Snowflake
	pinned: boolean
	edited_timestamp: string
	author: APIUSER
	mention_roles: APIROLE[]
	mention_channels: {
		id: Snowflake
		guild_id: Snowflake
		type: CHANNEL_TYPES
	}[]
	nonce?: string
	content?: string
	channel_id: string
	mentions: APIUSER[]
	type: MESSAGE_TYPES
	flags?: BitFieldResolvable
	message_reference?: APIMESSAGEREFERENCE
	activity?: {
		type: MESSAGE_ACTIVITY_TYPES
		party_id?: string
	}
	application: APIMESSAGE_APPLICATION
}

export interface APIMESSAGEREFERENCE {
	message_id: string
	channel_id: string
	guild_id: string
}

export interface APIREACTION {
	count: number
	me: boolean
	emoji: APIEMOJI
}

export interface APIEMOJI {
	id?: Snowflake
	name: string
	roles?: Snowflake[]
	user?: APIUSER
	require_colons?: boolean
	managed?: boolean
	animated?: boolean
	available?: boolean
}

export interface APGUILDEMOJI extends APIEMOJI {
	id: Snowflake
	name: string
	roles: Snowflake[]
	user: APIUSER
	require_colons: boolean
	managed: boolean
	animated: boolean
	available: boolean
}

export interface APIATTACHMENT {
	id: Snowflake
	filename: string
	size: number
	url: string
	proxy_url: string
	height: string
	width: string
}

export interface APIEMBED {
	title?: string
	type: "rich" | "image" | "video" | "gifv" | "article" | "link"
	description?: string
	url?: string
	timestamp?: string
	color?: number
	footer?: {
		text: string
		icon_url?: string
		proxy_url?: string
	}
	image?: {
		url?: string
		proxy_url?: string
		height?: string
		width?: string
	}
	thumbnail?: {
		url?: string
		proxy_url?: string
		height?: string
		width?: string
	}
	video?: {
		url?: string
		height?: string
		width?: string
	}
	provider?: {
		name?: string
		url?: string
	}
	author?: {
		name?: string
		url?: string
		icon_url?: string
		proxy_icon_url?: string
	}
	fields?: {
		name: string
		value: string
		inline?: boolean
	}[]
}

export interface APIMEMBER {
	user: APIUSER
	nick?: string
	roles: Snowflake[]
	joined_at: string
	deaf: boolean
	mute: boolean
}

export interface APIROLE {
	id: Snowflake
	name: string
	color: number
	hoist: boolean
	position: number
	permissions: BitFieldResolvable
	managed: boolean
	mentionable: boolean
}

export interface APIRECOMMENDEDWS {
	url: string
	shards: number
}

export interface APIVOICESTATE {
	guild_id: string
	channel_id: string
	user_id: string
	member: APIMEMBER
	session_id: string
	deaf: boolean
	mute: boolean
	self_mute: boolean
	self_deaf: boolean
	self_stream: boolean
	self_video: boolean
	suppress: boolean
}

export interface APIGUILD {
	roles: APIROLE[]
	system_channel_id: Snowflake
	mfa_level: number
	emojis: APGUILDEMOJI[]
	verification_level: number
	region: string
	unavailable: boolean
	preferred_locale: string
	features: ("INVITE_SPLASH" | "VIP_REGIONS" | "VANITY_URL" | "VERIFIED" | "PARTNERED" | "PUBLIC" | "COMMERCE" | "NEWS" | "DISCOVERABLE" | "FEATURABLE" | "ANIMATED_ICON" | "BANNER" | "PUBLIC_DISABLED" | "WELCOME_SCREEN_ENABLE")[]
	channels: (APITEXTCHANNEL | APIVOICECHANNEL)[]
	premium_tier: PREMIUM_TIER
	owner_id: Snowflake
	afk_timeout: number
	public_updates_channel_id?: Snowflake
	vanity_url_code?: string
	name: string
	afk_channel_id?: Snowflake
	joined_at: string
	presences?: PresenceData[]
	member_count: number
	application_id?: Snowflake
	splash?: string
	icon?: string
	rules_channel_id?: Snowflake
	max_video_channel_users?: number
	banner?: string
	explicit_content_filter: EXPLICIT_CONTENT_FILTER
	voice_states: APIVOICESTATE[]
	discovery_splash: string
	premium_subscription_count: number
	description: string
	members: APIMEMBER[]
	system_channel_flags: number
	default_message_notifications: number
	large: boolean
	id: string
}

export interface APIGUILDPREVIEW {
	id: string
	name: string
	icon?: string
	splash?: string
	discovery_splash?: string
	emojis: APGUILDEMOJI[]
	features: ("INVITE_SPLASH" | "VIP_REGIONS" | "VANITY_URL" | "VERIFIED" | "PARTNERED" | "PUBLIC" | "COMMERCE" | "NEWS" | "DISCOVERABLE" | "FEATURABLE" | "ANIMATED_ICON" | "BANNER" | "PUBLIC_DISABLED" | "WELCOME_SCREEN_ENABLE")[]
	approximate_member_count: number
	approximate_presence_count: number
	description?: string
}

export interface PresenceData {
	user: APIUSER
	status: string
	game: Activity | null
	client_status: {
		desktop?: string
		web?: string
	}
	activities: Activity[]
}

export interface Activity {
	type: number
	timestamps: string
	state: string
	name: string
	id: Snowflake
	details: string
	created_at: number
	assets: ActivityAssets
	application_id: string
}

interface ActivityAssets {
	small_text: string
	small_image: string
	large_text: string
	large_image: string
}


export interface ExtendableObject {
	[x: string]: ExtendableObject
}