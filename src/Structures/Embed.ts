import ColorConvertable from "./ColorConvertable"
import { APIEMBED } from "../constants/Types/Responses"

export default class Embed {
     title?: string
     type!: "rich" | "image" | "video" | "gifv" | "article" | "link"
     description?: string
     url?: string
     timestamp?: string
     color?: ColorConvertable
     footer?: {
          text: string
          // eslint-disable-next-line camelcase
          icon_url?: string
          // eslint-disable-next-line camelcase
          proxy_url?: string
     }
     image?: {
          url?: string
          // eslint-disable-next-line camelcase
          proxy_url?: string
          height?: string
          width?: string
     }
     thumbnail?: {
          url?: string
          // eslint-disable-next-line camelcase
          proxy_url?: string
          height?: string
          width?: string
     }
     video?: {
          url?: string
          height?: string
          width?: string
     }
     provider?: {
          name?: string
          url?: string
     }
     author?: {
          name?: string
          url?: string
          // eslint-disable-next-line camelcase
          icon_url?: string
          // eslint-disable-next-line camelcase
          proxy_icon_url?: string
     }
     fields?: {
          name: string
          value: string
          inline?: boolean
     }[]

     constructor(data: APIEMBED) {
          this.patch(data)
     }

     patch(data: APIEMBED): this {
          this.title = data.title
          this.type = data.type
          this.description = data.description
          this.url = data.url
          this.timestamp = data.timestamp
          this.color = new ColorConvertable(data.color || 0xfff)
          this.footer = data.footer
          this.image = data.image
          this.thumbnail = data.thumbnail
          this.video = data.video
          this.provider = data.provider
          this.author = data.author
          this.fields = data.fields

          return this
     }

     toJSON(): string {
          const res: APIEMBED = {
               title: this.title,
               type: this.type,
               description: this.description,
               url: this.url,
               timestamp: this.timestamp,
               color: this.color?.color,
               footer: this.footer,
               image: this.image,
               thumbnail: this.thumbnail,
               video: this.video,
               provider: this.provider,
               author: this.author,
               fields: this.fields
          }

          return JSON.stringify(res)
     }
}
