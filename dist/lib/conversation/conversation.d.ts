import { IncomeMessage } from "@shoopi/whatsapp-cloud-api-responder/dist/income";
import { Sender } from "@shoopi/whatsapp-cloud-api-responder/dist/outcome";
export default class ConversationHandler {
    private sender;
    private contact;
    private message;
    private whatsappMessage;
    private conversation;
    private middlewares;
    constructor();
    executeMiddleware(middlewares: Array<Function>, sender: Sender, message: IncomeMessage, next: any): void;
    run(sender: any, contact: any, message: any): void;
    private checkConversation;
    private initConversation;
    private handleContext;
}
