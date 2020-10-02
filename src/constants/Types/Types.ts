/* eslint-disable  */
export type Data = string | Buffer

export type GatewayPayload = {
     op: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
     d: any
     s?: number
     t?: WS_EVENT
}

export enum NITRO {
     "NONE" = 0,
     "CLASSIC" = 1,
     "NORMAL" = 2,
}

export enum MESSAGE_NOTIFICATION_LEVEL {
     ALL_MESAGES = 0,
     ONLY_MENTIONS = 1,
}

export enum MFA_LEVEL {
     NONE = 0,
     ELEVATED = 1,
}

export enum EXPLICIT_CONTENT_FILTER {
     DISABLED = 0,
     MEMBERS_WITHOUT_ROLES = 1,
     ALL_MEMBERS = 2,
}

export enum PREMIUM_TIER {
     NONE = 0,
     TIER_1 = 1,
     TIER_2 = 2,
     TIER_3 = 3,
}

export enum WS_EVENT {
     READY = "READY",
     RESUMED = "RESUMED",
     RECONNECT = "RECONNECT",
     GUILD_CREATE = "GUILD_CREATE",
     GUILD_DELETE = "GUILD_DELETE",
     GUILD_UPDATE = "GUILD_UPDATE",
     INVITE_CREATE = "INVITE_CREATE",
     INVITE_DELETE = "INVITE_DELETE",
     GUILD_MEMBER_ADD = "GUILD_MEMBER_ADD",
     GUILD_MEMBER_REMOVE = "GUILD_MEMBER_REMOVE",
     GUILD_MEMBER_UPDATE = "GUILD_MEMBER_UPDATE",
     GUILD_MEMBERS_CHUNK = "GUILD_MEMBERS_CHUNK",
     GUILD_INTEGRATIONS_UPDATE = "GUILD_INTEGRATIONS_UPDATE",
     GUILD_ROLE_CREATE = "GUILD_ROLE_CREATE",
     GUILD_ROLE_DELETE = "GUILD_ROLE_DELETE",
     GUILD_ROLE_UPDATE = "GUILD_ROLE_UPDATE",
     GUILD_BAN_ADD = "GUILD_BAN_ADD",
     GUILD_BAN_REMOVE = "GUILD_BAN_REMOVE",
     GUILD_EMOJIS_UPDATE = "GUILD_EMOJIS_UPDATE",
     CHANNEL_CREATE = "CHANNEL_CREATE",
     CHANNEL_DELETE = "CHANNEL_DELETE",
     CHANNEL_UPDATE = "CHANNEL_UPDATE",
     CHANNEL_PINS_UPDATE = "CHANNEL_PINS_UPDATE",
     MESSAGE_CREATE = "MESSAGE_CREATE",
     MESSAGE_DELETE = "MESSAGE_DELETE",
     MESSAGE_UPDATE = "MESSAGE_UPDATE",
     MESSAGE_DELETE_BULK = "MESSAGE_DELETE_BULK",
     MESSAGE_REACTION_ADD = "MESSAGE_REACTION_ADD",
     MESSAGE_REACTION_REMOVE = "MESSAGE_REACTION_REMOVE",
     MESSAGE_REACTION_REMOVE_ALL = "MESSAGE_REACTION_REMOVE_ALL",
     MESSAGE_REACTION_REMOVE_EMOJI = "MESSAGE_REACTION_REMOVE_EMOJI",
     USER_UPDATE = "USER_UPDATE",
     PRESENCE_UPDATE = "PRESENCE_UPDATE",
     TYPING_START = "TYPING_START",
     VOICE_STATE_UPDATE = "VOICE_STATE_UPDATE",
     VOICE_SERVER_UPDATE = "VOICE_SERVER_UPDATE",
     WEBHOOKS_UPDATE = "WEBHOOKS_UPDATE"
}

export type HTTP_METHOD = "ACL" | "BIND" | "CHECKOUT" | "CONNECT" | "COPY" | "DELETE" | "GET" | "HEAD" | "LINK" | "LOCK" | "M-SEARCH" | "MERGE" | "MKACTIVITY" | "MKCALENDAR" | "MKCOL" | "MOVE" | "NOTIFY" | "OPTIONS" | "PATCH" | "POST" | "PROPFIND" | "PROPPATCH" | "PURGE" | "PUT" | "REBIND" | "REPORT" | "SEARCH" | "SOURCE" | "SUBSCRIBE" | "TRACE" | "UNBIND" | "UNLINK" | "UNLOCK" | "UNSUBSCRIBE"

/**
 * Twitter's snowflake is the id system of Discord, they determine every each user. And they are totally unique.
 *
 * An example snowflake: 703285637964628022
 *
 * Lets turn that into binary
 * ```
 * 64                                          22       17        12             0
 *  000001000001100011010111100011000010011101    00010     00000    000000000001
 *  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^    ^^^^^     ^^^^^    ^^^^^^^^^^^^
 *       The milliseconds passed between          worker     PID    The order of the
 *          snowflake generation and                ID            id that was created in
 *          the first second of 2015                                the same process.
 * ```
 *
 *
 * https://discordapp.com/developers/docs/reference#snowflakes
 */
export type Snowflake = string

export type Status = "online" | "dnd" | "idle" | "invisible" | "offline"

export type _1_100_ =
     | 0
     | 1
     | 2
     | 3
     | 4
     | 5
     | 6
     | 7
     | 8
     | 9
     | 10
     | 11
     | 12
     | 13
     | 14
     | 15
     | 16
     | 17
     | 18
     | 19
     | 20
     | 21
     | 22
     | 23
     | 24
     | 25
     | 26
     | 27
     | 28
     | 29
     | 30
     | 31
     | 32
     | 33
     | 34
     | 35
     | 36
     | 37
     | 38
     | 39
     | 40
     | 41
     | 42
     | 43
     | 44
     | 45
     | 46
     | 47
     | 48
     | 49
     | 50
     | 51
     | 52
     | 53
     | 54
     | 55
     | 56
     | 57
     | 58
     | 59
     | 60
     | 61
     | 62
     | 63
     | 64
     | 65
     | 66
     | 67
     | 68
     | 69
     | 70
     | 71
     | 72
     | 73
     | 74
     | 75
     | 76
     | 77
     | 78
     | 79
     | 80
     | 81
     | 82
     | 83
     | 84
     | 85
     | 86
     | 87
     | 88
     | 89
     | 90
     | 91
     | 92
     | 93
     | 94
     | 95
     | 96
     | 97
     | 98
     | 99
     | 100
