import { MiddlewareFunction } from "@shoopi/whatsapp-cloud-api-responder/dist/income";
export default class WhatsappCloudApi {
    constructor(config: {
        templates: any;
        rules: any;
        middlewares?: Array<MiddlewareFunction>;
    });
    connectWebhook(): Promise<void>;
}
