import { OutcomeMessageTypes } from "@shoopi/whatsapp-cloud-api-responder/dist/outcome";
export interface MessageTemplate {
    [key: string]: OutcomeMessageTypes;
}
export default class Templates {
    private static instance;
    private templates;
    private constructor();
    static getInstance(): Templates;
    setTemplate(templates: MessageTemplate): void;
    getTemplate(id: string): OutcomeMessageTypes;
}
