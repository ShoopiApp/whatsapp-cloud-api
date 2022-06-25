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
var templates_1 = __importDefault(require("./templates"));
var rules_1 = __importDefault(require("./rules"));
var whatsapp_cloud_api_responder_1 = __importDefault(require("@shoopi/whatsapp-cloud-api-responder"));
var whatsapp_cloud_api_cache_1 = require("@shoopi/whatsapp-cloud-api-cache");
var middleware_1 = __importDefault(require("../middleware"));
var generator_1 = require("../generator");
var moment_1 = __importDefault(require("moment"));
var ConversationHandler = /** @class */ (function () {
    function ConversationHandler() {
        this.middlewares = middleware_1.default.getInstance().getMiddlewares() || [];
    }
    ConversationHandler.prototype.executeMiddleware = function (middlewares, sender, message, next) {
        var composition = middlewares.reduceRight(function (next, fn) { return function () {
            fn(sender, message, next);
        }; }, next);
        composition(sender, message);
    };
    ConversationHandler.prototype.run = function (sender, contact, message) {
        var _this = this;
        this.executeMiddleware(this.middlewares, sender, message, function () {
            _this.sender = sender;
            _this.contact = contact;
            _this.message = message;
            _this.whatsappMessage = new whatsapp_cloud_api_responder_1.default(_this.sender.phone_number_id);
            _this.checkConversation();
        });
    };
    ConversationHandler.prototype.checkConversation = function () {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var _d, timestamp, conversationduration, duration;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _d = this;
                        return [4 /*yield*/, (0, whatsapp_cloud_api_cache_1.getConversation)(this.message.from)];
                    case 1:
                        _d.conversation = _e.sent();
                        if (!((_c = (_b = (_a = this.conversation) === null || _a === void 0 ? void 0 : _a.context) === null || _b === void 0 ? void 0 : _b.last_message) === null || _c === void 0 ? void 0 : _c.timestamp)) return [3 /*break*/, 4];
                        timestamp = moment_1.default.unix(parseInt(this.conversation.context.last_message.timestamp));
                        conversationduration = +process.env.RESET_CONVERSATION_AFTER_OF || 30;
                        duration = moment_1.default.duration((0, moment_1.default)().diff(timestamp)).asMinutes();
                        if (!(Math.round(duration) >= conversationduration)) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, whatsapp_cloud_api_cache_1.deleteFeatureConversation)(this.conversation.id)];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, (0, whatsapp_cloud_api_cache_1.deleteConversation)(this.message.from)];
                    case 3:
                        _e.sent();
                        this.conversation = null;
                        _e.label = 4;
                    case 4:
                        if (this.conversation) {
                            this.handleContext();
                        }
                        else {
                            this.initConversation();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ConversationHandler.prototype.initConversation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var context, rule, template, conversation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        context = {
                            type: "welcome",
                            last_message: this.message,
                            last_message_send: null,
                            expected_response: {
                                type: null,
                                interactive: null,
                            },
                        };
                        rule = rules_1.default.getInstance().validateMessage(this.message.type, this.message.text.body);
                        if (rule) {
                            template = templates_1.default.getInstance().getTemplate(rule.response.id);
                            context.expected_response = rule.expected_response;
                        }
                        else {
                            template = templates_1.default.getInstance().getTemplate("welcome_menu");
                            context.expected_response = {
                                type: "interactive",
                            };
                        }
                        this.whatsappMessage.sendMessage(this.message.from, template);
                        context.last_message_send = template;
                        conversation = {
                            id: (0, generator_1.id)(),
                            sender: this.sender,
                            contact: this.contact,
                            context: context,
                            messages: [this.message],
                        };
                        return [4 /*yield*/, (0, whatsapp_cloud_api_cache_1.setConversation)(this.message.from, conversation)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ConversationHandler.prototype.handleContext = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, rule, template;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = this.conversation.context.type;
                        switch (_b) {
                            case "unknow": return [3 /*break*/, 1];
                            case "welcome": return [3 /*break*/, 1];
                            case "waiting_for_action": return [3 /*break*/, 1];
                            case "waiting_for_information": return [3 /*break*/, 1];
                            case "user_request_information": return [3 /*break*/, 1];
                        }
                        return [3 /*break*/, 4];
                    case 1:
                        rule = void 0;
                        template = void 0;
                        if (this.conversation.context.expected_response.type === this.message.type) {
                            switch (this.message.type) {
                                case "text":
                                    rule = rules_1.default.getInstance().validateMessage(this.message.type, this.message.text.body);
                                    break;
                                case "interactive":
                                    if ((_a = this.message.interactive) === null || _a === void 0 ? void 0 : _a.button_reply) {
                                        rule = rules_1.default.getInstance().validateMessage(this.message.type, this.message.interactive.button_reply.id);
                                    }
                                    else {
                                        template = templates_1.default.getInstance().getTemplate("default_unknow_response");
                                    }
                                    break;
                                case "image":
                                    console.log("Process image");
                                    break;
                                case "location":
                                    console.log("Process location");
                                    break;
                            }
                        }
                        else if (this.message.type === "text") {
                            rule = rules_1.default.getInstance().validateMessage(this.message.type, this.message.text.body);
                        }
                        else {
                            template = templates_1.default.getInstance().getTemplate("default_unknow_response");
                        }
                        if (rule) {
                            template = templates_1.default.getInstance().getTemplate(rule.response.id);
                            this.conversation.context.type = rule.context;
                            if (rule.context !== "unknow") {
                                this.conversation.context.last_message_send = template;
                            }
                        }
                        if (!template) return [3 /*break*/, 3];
                        this.whatsappMessage.sendMessage(this.message.from, template);
                        return [4 /*yield*/, (0, whatsapp_cloud_api_cache_1.setConversation)(this.message.from, this.conversation)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4: return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return ConversationHandler;
}());
exports.default = ConversationHandler;
//# sourceMappingURL=conversation.js.map