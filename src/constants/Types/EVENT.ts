/* eslint-disable camelcase */
import ClientUser from "../../Structures/ClientUser"
import Guild from "../../Structures/Guild"
import Member from "../../Structures/Member"
import Message from "../../Structures/Message"
import Speaking from "../../Structures/voice/Speaking"

export default interface EVENT {
  debug: [string]
  error: [string]
  ready: [ClientUser]
  guild_create: [Guild]
  message_create: [Message]
  update_speaking: [Member, Speaking]
}
