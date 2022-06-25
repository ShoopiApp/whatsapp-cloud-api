import { MiddlewareFunction } from "@shoopi/whatsapp-cloud-api-responder/dist/income";

export default class Middleware {
  private static instance: Middleware;
  private middlewares: Array<MiddlewareFunction>;

  private constructor() {}

  public static getInstance(): Middleware {
    if (!Middleware.instance) {
      Middleware.instance = new Middleware();
    }

    return Middleware.instance;
  }

  public setMiddleware(middlewares: Array<MiddlewareFunction>) {
    this.middlewares = middlewares;
  }

  public addMiddleware(middleware: MiddlewareFunction) {
    this.middlewares.push(middleware);
  }

  public getMiddlewares() {
    return this.middlewares;
  }
}
