export default class AvailVoiceError extends Error {
     constructor(message: string) {
          super(message)
          this.name = "Avail Voice Error"
     }
}
