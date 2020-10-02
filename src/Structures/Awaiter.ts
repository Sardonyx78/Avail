import { EventEmitter } from "events"
import SnowDir from "./SnowDir"
import { WS_EVENT } from '../constants/Types/Types'

export default class Awaiter extends EventEmitter {
  filter: (obj: unknown) => boolean

  options: { max?: number; time?: number; idle?: number }

  destroyed = false
  ended = false

  found = new SnowDir<number, unknown>()

  type: WS_EVENT

  private idleTimeout?: NodeJS.Timeout

  constructor(filter: (obj: unknown) => boolean, options: { max?: number; time?: number; idle?: number }, type: WS_EVENT) {
       super()

       this.filter = filter
       this.options = options
       this.type = type

       if (options.idle) this.idleTimeout = setTimeout(() => this.end(), options.idle)
  }

  destroy(): void {
       this.destroyed = true
       this.ended = true
       this.emit("destroyed")
       this.emit("end", this.found)
  }

  private end() {
       this.ended = true
       this.emit("end", this.found)
  }

  add(value: unknown): void {
       const numb = this.found.lastKey() ? 0 : this.found.lastKey() + 1

       this.found.set(numb, value)

       this.emit("data", value)
       if (this.found.size === this.options.max) this.end()

       if (this.idleTimeout) {
            clearTimeout(this.idleTimeout)

            if (this.options.idle) this.idleTimeout = setTimeout(() => this.end(), this.options.idle)
       }
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface Awaiter extends EventEmitter {
  on<K extends keyof AwaiterEvents>(event: K, listener: (...args: AwaiterEvents[K]) => any): this
  once<K extends keyof AwaiterEvents>(event: K, listener: (...args: AwaiterEvents[K]) => any): this
  emit<K extends keyof AwaiterEvents>(event: K, ...args: AwaiterEvents[K]): boolean
}

interface AwaiterEvents {
  start: []
  data: [unknown]
  end: [SnowDir<number, unknown>]
  destroyed: []
}
