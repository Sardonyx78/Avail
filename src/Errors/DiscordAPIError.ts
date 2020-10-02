import { Response } from "node-fetch"

export default class DiscordAPIError extends Error {
     //eslint-disable-next-line
     constructor(res?: Response & { final?: any } | string) {
          if (typeof res === "string") super(res)
          else if (res) {
               if (res.final.message) super(res.final.message)
               else
                    switch (res.status) {
                    case 400:
                         super("Bad Request.")
                         break
                    case 401:
                         super("Invalid token was provided.")
                         break
                    case 403:
                         super("Forbidden, you do not have permission to the resource.")
                         break
                    case 404:
                         super("Resource was not found.")
                         break
                    case 405:
                         super("This method is not allowed!")
                         break
                    case 429:
                         super(`You are passing the rate limit! Ratelimit will reset in: ${res.headers.get("X-RateLimit-Reset")}, Current Rate Limit Bucket: ${res.headers.get("X-RateLimit-Bucket")}`)
                         break
                    default:
                         super("Internal Server Error")
                         break
                    }
               this.name = "Discord API Error"
          }
     }
}
