export class Response {
  constructor(message: string | Record<string, any>) {
    this.message = message;
  }

  message: string | Record<string, any>;
}
