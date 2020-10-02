export default class DiscordGatewayError extends Error {
     constructor(message: string) {
          super(message)
          this.name = "Discord Gateway Error"
     }
}
