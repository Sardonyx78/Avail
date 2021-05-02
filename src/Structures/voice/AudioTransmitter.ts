import { Writable } from "stream";
import Connection from "./Connection";
import LibSodium from "sodium-native"

export class AudioTransmitter extends Writable {
     connection: Connection
     startTimestamp?: Date
     endTimestamp?: Date
     nonce = Buffer.alloc(24)
     duration = 0
     sequence = 0
     count = 1

     constructor(connection: Connection) {
          super()
          this.connection = connection
     }

     _write(chunk: Buffer, _: BufferEncoding, callback: (error: Error | undefined) => any) {
          if (!this.startTimestamp) this.startTimestamp = new Date()

          try {
               this.connection.udpClient.send(chunk)

               this.sequence++
               this.duration += 240
     
               if (this.sequence >= 2 ** 16) this.sequence = 0
               if (this.duration >= 2 ** 32) this.duration = 0
     
               this.connection.udpClient.send(this.encryptPackage(chunk))

               setTimeout(() => {
                    callback(undefined)
                    this.count++
               }, 20 * (this.count + 1) - (Date.now() - this.startTimestamp.valueOf()))
          } catch (error) {
               callback(error)
          }

          
     }

     _destroy(error: Error | null, callback: (error?: Error | null | undefined) => void) {
          this.endTimestamp = new Date()
          super._destroy(error, callback)
     }

     encryptPackage(buffer: Buffer): Buffer {
          const packet = Buffer.alloc(12)
          packet[0] = 0x80
          packet[1] = 0x78

          packet.writeUIntBE(this.sequence, 2, 2)
          packet.writeUIntBE(this.duration, 4, 4)

          const _buffer = Buffer.allocUnsafe(buffer.length + LibSodium.crypto_secretbox_MACBYTES)
          
          packet.copy(this.nonce, 0, 0, 12)
          LibSodium.crypto_secretbox_easy(_buffer, packet, this.nonce, Buffer.from(this.connection.udpClient.secret_key!))

          return packet
     }
}