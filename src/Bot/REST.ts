import fetch, { BodyInit, HeaderInit, Response } from "node-fetch"
import { Bot } from "./Bot"
import DiscordAPIError from "../Errors/DiscordAPIError"
import { HTTP_METHOD } from '../constants/Types/Types'

export const BASE_URL = "https://discord.com/api/v6/"

export default class REST {
  bot: Bot

  constructor(bot: Bot) {
       this.bot = bot
  }

  route: string[] = []

  request<T>(endpoint: string[], method: HTTP_METHOD, body?: BodyInit, headers?: HeaderInit): Promise<T> {
       return new Promise(async (resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res: Response & { final?: any } = await fetch(BASE_URL + endpoint.join("/"), {
                 body,
                 headers: Object.assign(
                      {
                           Authorization: "Bot " + this.bot.token,
                           "Content-Type": method !== "GET" && method !== "DELETE" ? "application/json" : undefined,
                      },
                      headers
                 ),
                 method
            })

            res.final = await res.json()

            if ([200, 201, 204, 304].includes(res.status)) resolve(res.final)
            else reject(new DiscordAPIError(res))
       })
  }

  discord<T>(): Endpoint<T> {
       const route: string[] = []

       const funcs = {
            get: (body?: URLSearchParams, headers?: HeaderInit): Promise<T> => this.request<T>(route, "GET", body, headers),
            post: (body?: BodyInit, headers?: HeaderInit): Promise<T> => this.request<T>(route, "POST", body, headers),
            put: (body?: BodyInit, headers?: HeaderInit): Promise<T> => this.request<T>(route, "PUT", body, headers),
            delete: (body?: BodyInit, headers?: HeaderInit): Promise<T> => this.request<T>(route, "PUT", body, headers),
            patch: (body?: BodyInit, headers?: HeaderInit): Promise<T> => this.request<T>(route, "PATCH", body, headers),
       }

       // eslint-disable-next-line @typescript-eslint/no-empty-function
       const x = () => {}

       const handler = {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            get: (__: any, value: string): EndpointProperties<T> | EndpointProperties<T>[keyof EndpointProperties<T>] => {
                 if (value === "me") value = "@me"

                 switch (value) {
                 case "get":
                      return funcs.get
                 case "post":
                      return funcs.post
                 case "put":
                      return funcs.put
                 case "delete":
                      return funcs.delete
                 case "patch":
                      return funcs.patch
                 default:
                      route.push(value)
                      return new Proxy(x, handler)
                 }
            },
            apply: (__: any, _: any, [arg]: [string]): Endpoint<T> => {
                 route.push(arg)
                 return new Proxy(x, handler)
            },
       }

       return new Proxy(x, handler)
  }
}

interface EndpointProperties<T> {
  get(body?: URLSearchParams, headers?: HeaderInit): Promise<T>
  post(body?: BodyInit, header?: HeaderInit): Promise<T>
  put(body?: BodyInit, header?: HeaderInit): Promise<T>
  delete(): Promise<T>
  patch(body?: BodyInit, header?: HeaderInit): Promise<T>
}

type Endpoint<T> = EndpointProperties<T> & {
  [x: string]: ((arg: string) => Endpoint<T>) & Endpoint<T>
}
