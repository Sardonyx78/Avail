export default class BitField {
     bitfield: number
     static FLAGS: Record<string, number>

     constructor(bits: BitFieldResolvable) {
          this.bitfield = BitField.resolve(bits)
     }

     has(bit: BitFieldResolvable): boolean {
          if (Array.isArray(bit)) return bit.every(p => this.has(p))
          bit = BitField.resolve(bit)
          return (this.bitfield & (bit as number)) === bit
     }

     static resolve(bit: BitFieldResolvable = 0): number {
          if (typeof bit === "number" && bit >= 0) return bit
          if ((bit as BitField).bitfield) return (bit as BitField).bitfield
          if (Array.isArray(bit)) return bit.map(p => this.resolve(p)).reduce((prev, p) => prev | p, 0)
          if (typeof bit === "string" && typeof this.FLAGS[bit] !== "undefined") return this.FLAGS[bit]
          throw new RangeError("BITFIELD_INVALID")
     }

     toJSON(): string {
          return this.bitfield.toString()
     }
}

export type BitFieldResolvable = string | number | BitField | BitFieldResolvable[]
