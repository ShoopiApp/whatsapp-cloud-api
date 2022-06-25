"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var helmet_1 = __importDefault(require("helmet"));
var express_1 = __importDefault(require("express"));
var conversation_1 = __importDefault(require("./lib/conversation/conversation"));
var App = /** @class */ (function () {
    function App() {
        this.path = process.env.WEBHOOK || "/whatsapp_webhook";
        this.app = (0, express_1.default)();
        this.initializeHelmet();
        this.initializeMiddleware();
        this.initializeController();
    }
    App.prototype.listen = function () {
        return __awaiter(this, void 0, void 0, function () {
            var port;
            return __generator(this, function (_a) {
                port = process.env.WEBHOOK_PORT || 9500;
                this.app.listen(port, function () {
                    console.log("Express server listening on port ".concat(port));
                });
                return [2 /*return*/];
            });
        });
    };
    App.prototype.initializeHelmet = function () {
        this.app.use((0, helmet_1.default)());
    };
    App.prototype.initializeMiddleware = function () {
        this.app.use(express_1.default.json());
    };
    App.prototype.initializeController = function () {
        this.app.get("/api", function (_, res) {
            res.status(200).send("API works.");
        });
        this.app.get(this.path, function (req, res) {
            var verify_token = process.env.VERIFY_TOKEN;
            // Parse params from the webhook verification request
            var mode = req.query["hub.mode"];
            var token = req.query["hub.verify_token"];
            var challenge = req.query["hub.challenge"];
            // Check if a token and mode were sent
            if (mode && token) {
                // Check the mode and token sent are correct
                if (mode === "subscribe" && token === verify_token) {
                    // Respond with 200 OK and challenge token from the request
                    console.log("WEBHOOK_VERIFIED");
                    res.status(200).send(challenge);
                }
                else {
                    // Responds with '403 Forbidden' if verify tokens do not match
                    res.sendStatus(403);
                }
            }
        });
        // this.app.use("/", () => {});
        this.app.post(this.path, function (req, res) {
            if (req.body.object) {
                if (req.body.entry &&
                    req.body.entry[0].changes &&
                    req.body.entry[0].changes[0] &&
                    req.body.entry[0].changes[0].value.messages &&
                    req.body.entry[0].changes[0].value.messages[0]) {
                    var sender = req.body.entry[0].changes[0].value.metadata;
                    var message = req.body.entry[0].changes[0].value.messages[0];
                    var contact = req.body.entry[0].changes[0].value.contacts[0];
                    var conversation = new conversation_1.default();
                    conversation.run(sender, contact, message);
                }
                res.sendStatus(200);
            }
            else {
                // Return a '404 Not Found' if event is not from a WhatsApp API
                res.sendStatus(404);
            }
        });
    };
    return App;
}());
exports.default = App;
//# sourceMappingURL=App.js.map