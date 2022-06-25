import { OutcomeMessageTypes } from "@shoopi/whatsapp-cloud-api-responder/dist/outcome";

export interface MessageTemplate {
  [key: string]: OutcomeMessageTypes;
}

export default class Templates {
  private static instance: Templates;
  private templates: MessageTemplate;

  private constructor() {}

  public static getInstance(): Templates {
    if (!Templates.instance) {
      Templates.instance = new Templates();
    }

    return Templates.instance;
  }

  public setTemplate(templates: MessageTemplate) {
    this.templates = templates;
  }

  public getTemplate(id: string) {
    return this.templates[id];
  }
}
