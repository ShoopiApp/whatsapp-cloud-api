"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Middleware = /** @class */ (function () {
    function Middleware() {
    }
    Middleware.getInstance = function () {
        if (!Middleware.instance) {
            Middleware.instance = new Middleware();
        }
        return Middleware.instance;
    };
    Middleware.prototype.setMiddleware = function (middlewares) {
        this.middlewares = middlewares;
    };
    Middleware.prototype.addMiddleware = function (middleware) {
        this.middlewares.push(middleware);
    };
    Middleware.prototype.getMiddlewares = function () {
        return this.middlewares;
    };
    return Middleware;
}());
exports.default = Middleware;
//# sourceMappingURL=index.js.map