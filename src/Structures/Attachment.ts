import { Data } from 'ws';
import { APIATTACHMENT } from '../constants/Types/Responses';
import { Snowflake } from '../constants/Types/Types';
import DataUtil from '../constants/util/DataUtil';

export default class Attachment {
  private __file!: Data;
  name!: string;
  id!: Snowflake;
  size!: number;
  url!: string;
  proxyUrl!: string;
  height!: string;
  width!: string;

  constructor(data: APIATTACHMENT)
  constructor(file: Data, name?: string)
  constructor(file: Data | APIATTACHMENT, name = 'undefined') {
       if ((file as APIATTACHMENT).id) this.patch(file as APIATTACHMENT);
       else {
            this.__file = file as Data;
            this.name = name;
       }
  }

  patch(data: APIATTACHMENT): this {
       this.name = data.filename;
       this.id = data.id;
       this.size = data.size;
       this.url = data.url;
       this.proxyUrl = data.proxy_url;
       this.height = data.height;
       this.width = data.width;

       return this
  }

  async getFile(): Promise<Buffer> {
       if (this.__file) return DataUtil.file(this.__file);
       else return DataUtil.file(this.url);
  }
}