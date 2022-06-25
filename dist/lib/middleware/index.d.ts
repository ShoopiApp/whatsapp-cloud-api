import { MiddlewareFunction } from "@shoopi/whatsapp-cloud-api-responder/dist/income";
export default class Middleware {
    private static instance;
    private middlewares;
    private constructor();
    static getInstance(): Middleware;
    setMiddleware(middlewares: Array<MiddlewareFunction>): void;
    addMiddleware(middleware: MiddlewareFunction): void;
    getMiddlewares(): MiddlewareFunction[];
}
