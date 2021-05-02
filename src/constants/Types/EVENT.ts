/* eslint-disable camelcase */
import ClientUser from "../../Structures/ClientUser"
import Guild from "../../Structures/Guild"
import Member from "../../Structures/Member"
import Message from "../../Structures/Message"
import { Reaction } from "../../Structures/Reaction"
import SnowDir from "../../Structures/SnowDir"
import User from "../../Structures/User"
import Speaking from "../../Structures/voice/Speaking"
import { Snowflake } from "./Types"

export default interface EVENT {
  debug: [string]
  error: [string]
  ready: [ClientUser]
  guild_create: [Guild]
  message_create: [Message]
  message_update: [Message, Message]
  message_delete: [Message]
  message_delete_bulk: [SnowDir<Snowflake, Message>]
  update_speaking: [Member, Speaking]
  reaction_add: [Reaction, User]
  reaction_remove: [Reaction, User]
  reaction_remove_all: [Reaction]
  reaction_clear: [Message]
}
