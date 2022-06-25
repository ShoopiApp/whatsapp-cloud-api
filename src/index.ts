import App from "./App";
import dotenv from "dotenv";
import Middleware from "./lib/middleware";
import Rules from "./lib/conversation/rules";
import Templates from "./lib/conversation/templates";
import Cache from "@shoopi/whatsapp-cloud-api-cache";
import { MiddlewareFunction } from "@shoopi/whatsapp-cloud-api-responder/dist/income";

export default class WhatsappCloudApi {
  constructor(config: { templates: any; rules: any; middlewares?: Array<MiddlewareFunction> }) {
    dotenv.config();
    Cache.getInstance().init();
    const templates = Templates.getInstance();
    const rules = Rules.getInstance();
    templates.setTemplate(config.templates);
    rules.setRules(config.rules);
    if (config.middlewares && config.middlewares.length > 0) {
      const middlewares = Middleware.getInstance();
      middlewares.setMiddleware(config.middlewares);
    }
    this.connectWebhook();
  }

  public async connectWebhook() {
    new App().listen();
  }
}
