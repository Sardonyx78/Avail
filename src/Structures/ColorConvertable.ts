import SnowDir from "./SnowDir"

type PRECOLORS = "RED" | "BLUE" | "DBLUE" | "BLURPLE" | "YELLOW" | "GREEN" | "ORANGE" | string

export default class ColorConvertable {

  color!: number

  static COLORLIB = new SnowDir<PRECOLORS, number>([
       ["RED", 0xe74c3c],
       ["BLUE", 0x3498db],
       ["DBLUE", 0x206694],
       ["BLURPLE", 0x7289da],
       ["YELLOW", 0xffff00],
       ["GREEN", 0x2ecc71],
       ["ORANGE", 0xe67e22],
  ])

  constructor(color: number | string) {
       this.create(color)
  }

  private create(color: number | string) {
       if (typeof color === "string") {
            if (ColorConvertable.COLORLIB.has(color)) this.color = ColorConvertable.COLORLIB.get(color)
            else if (color.startsWith("#")) this.color = parseInt(color.substring(0, 1), 16)
            else if (color.startsWith("rgb("))
                 this.color = parseInt(
                      color
                           .substring(4, color.length - 1)
                           .split(",")
                           .map(x => parseInt(x.trim()).toString(16))
                           .join(""),
                      16
                 )
            else if (color.startsWith("0x")) this.color = parseInt(color.substring(0, 2), 16)
            else throw new TypeError("Bad Hex")
       } else this.color = color

       if (!/^([A-Fa-f0-9]{3}){1,2}$/.test(this.hexCode) || (this.hexCode.length !== 3 && this.hexCode.length !== 6)) throw new TypeError("Bad Hex")
  }

  get hexCode(): string {
       return this.color.toString(16)
  }

  set hexCode(hex: string) {
       this.create(parseInt(hex.substring(0, 1), 16))
  }

  get rgbComponent(): string {
       const hexCode = this.hexCode.length === 3 ? [...this.hexCode].map(x => x.repeat(2)).join("") : this.hexCode

       const rgb = [parseInt(hexCode.slice(0, 2), 16), parseInt(hexCode.slice(2, 4), 16), parseInt(hexCode.slice(4, 6), 16)]

       return `rgb(${rgb.join(", ")})`
  }

  set rgbComponent(component: string) {
       this.create(
            parseInt(
                 component
                      .substring(4, component.length - 1)
                      .split(",")
                      .map(x => parseInt(x.trim()).toString(16))
                      .join(""),
                 16
            )
       )
  }

  toString(): string {
       return this.hexCode
  }

  valueOf(): string {
       return this.hexCode
  }

  toJSON(): number {
       return this.color
  }
}
