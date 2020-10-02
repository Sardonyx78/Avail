import BitField, { BitFieldResolvable } from "../Bitfield"

export default class Speaking extends BitField {
  static FLAGS = {
       NONE: 0,
       SPEAKING: 1 << 0,
       SOUNDSHARE: 1 << 1,
       PRIORITY_SPEAKING: 1 << 2,
  }

  constructor(bits: BitFieldResolvable) {
       super(bits)
  }
}
