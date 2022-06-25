import { IncomeMessageType } from "@shoopi/whatsapp-cloud-api-responder/dist/income";
import { ContextType, ExpectedResponse } from "@shoopi/whatsapp-cloud-api-cache/src/conversation.interface";

export interface Rule {
  type: IncomeMessageType;
  triggers?: Array<string>;
  button_id?: string;
  response: {
    id: string;
  };
  expected_response: ExpectedResponse;
  matchs?: number;
  context: ContextType;
}

export default class Rules {
  private static instance: Rules;
  private rules: Array<Rule>;

  private constructor() {}

  public static getInstance(): Rules {
    if (!Rules.instance) {
      Rules.instance = new Rules();
    }

    return Rules.instance;
  }

  public setRules(rules: Array<Rule>) {
    this.rules = rules;
  }

  private checkParagraph(text: string) {
    const words = text.split(" ");
    return this.rules.find((r) => {
      let count = 0;
      r.triggers?.filter((item) => words.forEach((w) => (w.toLowerCase() === item ? count++ : null)));
      //Check if have minimun matchs
      return count >= (r.matchs || 1);
    });
  }

  public validateMessage(type: IncomeMessageType, text: string) {
    return this.rules.find((r) => r.type === type && r.button_id === text) || this.checkParagraph(text);
  }
}
