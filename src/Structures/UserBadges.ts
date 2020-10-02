import BitField, { BitFieldResolvable } from "./Bitfield"

export default class UserBadges extends BitField {
  static FLAGS: Record<string, number> = {
       EMPLOYEE: 1 << 0,
       PARTNER: 1 << 1,
       HYPE_EVENTS: 1 << 2,
       BUG_HUNTER_1: 1 << 3,
       HYPE_BRAVERY: 1 << 6,
       HYPE_BRILLIANCE: 1 << 7,
       HYPE_BALANCE: 1 << 8,
       EARLY_SUPPORTER: 1 << 9,
       TEAM_USER: 1 << 10,
       SYSTEM: 1 << 12,
       BUG_HUNTER_2: 1 << 14,
       BOT_VERIFIED: 1 << 16,
       BOT_DEV_VERIFIED: 1 << 17,
  }

  constructor(bits: BitFieldResolvable) {
       super(bits)
  }
}
