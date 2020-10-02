import BitField, { BitFieldResolvable } from "./Bitfield"

export default class SystemChannelFlags extends BitField {
  static FLAGS = {
       SUPPRESS_JOIN_NOTIFICATIONS: 1 << 0,
       SUPPRESS_PREMIUM_SUBSCRIPTIONS: 1 << 1,
  }

  constructor(bits: BitFieldResolvable) {
       super(bits)
  }
}
