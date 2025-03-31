export class HttpException {
  status!: number;
  message!: string;
  additionalInfo!: any;

  constructor(status = 500, message: string, additionalInfo: any = {}) {
    this.message = message;
    this.status = status;
    this.additionalInfo = additionalInfo;
  }
}

export default HttpException;
