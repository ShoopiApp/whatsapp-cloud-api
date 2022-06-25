import Templates from "./templates";
import Rules, { Rule } from "./rules";
import { IncomeMessage, MiddlewareFunction } from "@shoopi/whatsapp-cloud-api-responder/dist/income";
import { Contact } from "@shoopi/whatsapp-cloud-api-responder/src/contact";
import WhatsappMessage from "@shoopi/whatsapp-cloud-api-responder";
import { OutcomeMessageTypes, Sender } from "@shoopi/whatsapp-cloud-api-responder/dist/outcome";
import {
  deleteConversation,
  deleteFeatureConversation,
  getConversation,
  setConversation,
} from "@shoopi/whatsapp-cloud-api-cache";
import { Context, Conversation } from "@shoopi/whatsapp-cloud-api-cache/src/conversation.interface";
import Middleware from "../middleware";
import { id } from "../generator";
import moment from "moment";

export default class ConversationHandler {
  private sender: Sender;
  private contact: Contact;
  private message: IncomeMessage;
  private whatsappMessage: WhatsappMessage;
  private conversation: Conversation;
  private middlewares: Array<MiddlewareFunction>;

  constructor() {
    this.middlewares = Middleware.getInstance().getMiddlewares() || [];
  }

  executeMiddleware(middlewares: Array<Function>, sender: Sender, message: IncomeMessage, next: any) {
    const composition = middlewares.reduceRight(
      (next, fn) => () => {
        fn(sender, message, next);
      },
      next
    );
    composition(sender, message);
  }

  run(sender: any, contact: any, message: any) {
    this.executeMiddleware(this.middlewares, sender, message, () => {
      this.sender = sender;
      this.contact = contact;
      this.message = message;
      this.whatsappMessage = new WhatsappMessage(this.sender.phone_number_id);
      this.checkConversation();
    });
  }

  private async checkConversation() {
    this.conversation = await getConversation(this.message.from);
    if (this.conversation?.context?.last_message?.timestamp) {
      const timestamp = moment.unix(parseInt(this.conversation.context.last_message.timestamp));
      const conversationduration = +process.env.RESET_CONVERSATION_AFTER_OF || 30;
      const duration = moment.duration(moment().diff(timestamp)).asMinutes();
      if (Math.round(duration) >= conversationduration) {
        await deleteFeatureConversation(this.conversation.id);
        await deleteConversation(this.message.from);
        this.conversation = null;
      }
    }
    if (this.conversation) {
      this.handleContext();
    } else {
      this.initConversation();
    }
  }

  private async initConversation() {
    const context: Context = {
      type: "welcome",
      last_message: this.message,
      last_message_send: null,
      expected_response: {
        type: null,
        interactive: null,
      },
    };
    const rule = Rules.getInstance().validateMessage(this.message.type, this.message.text.body);
    let template: OutcomeMessageTypes;
    if (rule) {
      template = Templates.getInstance().getTemplate(rule.response.id);
      context.expected_response = rule.expected_response;
    } else {
      template = Templates.getInstance().getTemplate("welcome_menu");
      context.expected_response = {
        type: "interactive",
      };
    }
    this.whatsappMessage.sendMessage(this.message.from, template);
    context.last_message_send = template;
    const conversation: Conversation = {
      id: id(),
      sender: this.sender,
      contact: this.contact,
      context: context,
      messages: [this.message],
    };
    await setConversation(this.message.from, conversation);
  }

  private async handleContext() {
    switch (this.conversation.context.type) {
      case "unknow":
      case "welcome":
      case "waiting_for_action":
      case "waiting_for_information":
      case "user_request_information":
        let rule: Rule;
        let template: OutcomeMessageTypes;
        if (this.conversation.context.expected_response.type === this.message.type) {
          switch (this.message.type) {
            case "text":
              rule = Rules.getInstance().validateMessage(this.message.type, this.message.text.body);
              break;

            case "interactive":
              if (this.message.interactive?.button_reply) {
                rule = Rules.getInstance().validateMessage(this.message.type, this.message.interactive.button_reply.id);
              } else {
                template = Templates.getInstance().getTemplate("default_unknow_response");
              }
              break;

            case "image":
              console.log("Process image");
              break;

            case "location":
              console.log("Process location");
              break;
          }
        } else if (this.message.type === "text") {
          rule = Rules.getInstance().validateMessage(this.message.type, this.message.text.body);
        } else {
          template = Templates.getInstance().getTemplate("default_unknow_response");
        }
        if (rule) {
          template = Templates.getInstance().getTemplate(rule.response.id);
          this.conversation.context.type = rule.context;
          if (rule.context !== "unknow") {
            this.conversation.context.last_message_send = template;
          }
        }
        if (template) {
          this.whatsappMessage.sendMessage(this.message.from, template);
          await setConversation(this.message.from, this.conversation);
        }
        break;

      default:
        break;
    }
  }
}
