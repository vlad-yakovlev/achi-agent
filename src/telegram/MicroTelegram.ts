import axios, { Axios } from 'axios';
import FormData from 'form-data';

export class MicroTelegram {
  private axios: Axios;

  private fileAxios: Axios;

  constructor(token: string) {
    this.axios = axios.create({
      baseURL: `https://api.telegram.org/bot${token}/`,
    });

    this.fileAxios = axios.create({
      baseURL: `https://api.telegram.org/file/bot${token}/`,
    });
  }

  async sendMessage(
    chatId: number,
    text: string,
  ) {
    return this.axios.get('sendMessage', {
      params: {
        chat_id: chatId,
        parse_mode: 'Markdown',
        text,
      },
    });
  }

  async sendDocument(
    chatId: number,
    filename: string,
    content: Buffer,
  ) {
    const formData = new FormData();

    formData.append('document', content, filename);

    return this.axios.post('sendDocument', formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
      },

      params: {
        chat_id: chatId,
      },
    });
  }

  async sendSticker(
    chatId: number,
    sticker: string,
  ) {
    return this.axios.get('sendSticker', {
      params: {
        chat_id: chatId,
        sticker,
      },
    });
  }

  async downloadFile(filePath: string) {
    return (await this.fileAxios.get(filePath)).data;
  }
}
