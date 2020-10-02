/**
 * SnowDir is the utility data structure of Avail
 */
export default class SnowDir<K, V> extends Map<K, V> {
     public first(): V | null
     public first(c?: number): V | V[] | null {
          if (this.size === 0) return null
          if (c === undefined || c === 1) return this.values().next().value
          return Array.from({ length: c }, () => this.values().next().value)
     }

     public firstKey(): K | null
     public firstKey(c?: number): K | K[] | null {
          if (this.size === 0) return null
          if (c === undefined || c === 1) return this.keys().next().value
          return Array.from({ length: c }, () => this.keys().next().value)
     }

     public last(): V | null
     public last(c: number): V[]
     public last(c?: number): V | V[] | null {
          if (this.size === 0) return null
          if (c === undefined || c === 1) return this.array().splice(-1)[0]
          return this.array().splice(-c)
     }

     public lastKey(): K
     public lastKey(c?: number): K | K[] {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (this.size === 0) return <any>undefined
          if (c === undefined || c === 1) return this.keyArray().splice(-1)[0]
          return this.keyArray().splice(-c)
     }

     public array(): V[] {
          return Array.from({ length: this.size }, this.values().next().value)
     }

     public keyArray(): K[] {
          return Array.from({ length: this.size }, this.keys().next().value)
     }

     public map<T>(fn: (value: V, index?: number, array?: V[]) => T): T[] {
          return this.array().map(fn)
     }

     public mapKey<T>(fn: (key: K, index?: number, array?: K[]) => T): T[] {
          return this.keyArray().map(fn)
     }

     public emptySet(arr: K[]): this {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          arr.forEach(x => this.set(x, <any>null))
          return this
     }

     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
     //@ts-ignore
     public set(key: K, value: V, override = true): V {
          if (super.has(key) && !override) return <V>super.get(key)
          else super.set(key, value)

          return value
     }

     public get<T extends V>(key: K): T {
          return super.get(key) as T
     }

     public findAll(func: (V: V, K: K) => boolean): SnowDir<K, V> {
          const res = new SnowDir<K, V>()
          for (const [key, value] of this) {
               if (func(value, key)) res.set(key, value)
          }
          return res
     }

     public find(func: (V: V, K: K) => boolean): V | undefined {
          for (const [key, value] of this) if (func(value, key)) return value
     }

     public concat(...snowdirs: SnowDir<K, V>[]): SnowDir<K, V> {
          const merged = this.clone()

          for (const snowdir of snowdirs) {
               for (const [key, value] of snowdir) merged.set(key, value)
          }

          return merged
     }

     public clone(): SnowDir<K, V> {
          return new SnowDir<K, V>(this)
     }

     public ask(cb: (V: V, K: K) => unknown): boolean {
          const sd = this.clone()

          let e = false;

          sd.forEach((v, k) => {
               if (!e) e = !cb(v, k)
          })

          return e
     }

     public static from<K, V>(fn: (value: V) => K, iterable: Iterable<V>): SnowDir<K, V> {
          const arr = Array.from(iterable)
          const res = new SnowDir<K, V>()

          for (const val of arr) {
               res.set(fn(val), val)
          }

          return res
     }
}
