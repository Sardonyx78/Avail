import BitField, { BitFieldResolvable } from "./Bitfield"

export default class MessageFlags extends BitField {
     static FLAGS = {
          CROSSPOSTED: 1 << 0,
          IS_CROSSPOSTED: 1 << 1,
          SUPPRESS_EMBEDS: 1 << 2,
          SOURCE_MESSAGE_DELETED: 1 << 3,
          URGENT: 1 << 4,
     }

     constructor(bits: BitFieldResolvable) {
          super(bits)
     }
}
