import { stat, readFile } from "fs/promises"
import path from "path"
import { Stream } from "stream"
import fetch from "node-fetch"
import { Data } from ".."

export default class DataUtil {
     constructor() {
          throw new Error(`The ${this.constructor.name} class may not be instantiated.`)
     }

     static async image(image: Data): Promise<string | null> {
          if (!image) return null
          if (typeof image === "string" && image.startsWith("data:")) return image
          const file = await this.file(image)
          if (Buffer.isBuffer(file)) return `data:image/jpg;base64,${file.toString("base64")}`
          return file
     }

     static file(data: Data | Stream): Promise<Buffer> {
          if (Buffer.isBuffer(data)) return Promise.resolve(data)

          if (typeof data === "string") {
               if (/^https?:\/\//.test(data)) return fetch(data).then(d => d.buffer())
               else
                    return new Promise(async (resolve) => {
                         const file = await stat(path.resolve(data))

                         if (!file.isFile()) throw new Error(`ENOENT: no such file, open '${path.resolve(data)}'`)

                         resolve(await readFile(path.resolve(data)))
                    })
          } else if (data instanceof Stream) {
               return new Promise((resolve, reject) => {
                    const buffers: Buffer[] = []
                    data.once("error", reject)
                    data.on("data", buffers.push)
                    data.once("end", () => resolve(Buffer.concat(buffers)))
               })
          } else throw new TypeError("The provided data is not a string or Buffer or Stream")
     }
}
