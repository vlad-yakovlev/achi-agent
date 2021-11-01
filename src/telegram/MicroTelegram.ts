import axios from 'axios'
import FormData from 'form-data'

interface MicroTelegramOptions {
  token: string
}

export class MicroTelegram {
  private token: string

  constructor(options: MicroTelegramOptions) {
    this.token = options.token
  }

  async sendDocument(
    chatId: string,
    filename: string,
    content: Buffer,
  ) {
    const formData = new FormData()

    formData.append('document', content, filename)

    await axios.post(`https://api.telegram.org/bot${this.token}/sendDocument`, formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
      },

      params: {
        chat_id: chatId,
      },
    })
  }
}
