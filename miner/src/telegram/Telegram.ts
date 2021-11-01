import axios from 'axios'
import FormData from 'form-data'

interface TelegramOptions {
  token: string
}

export class Telegram {
  private token: string

  constructor(options: TelegramOptions) {
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
