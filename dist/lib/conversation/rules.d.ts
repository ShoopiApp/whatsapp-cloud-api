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
    private static instance;
    private rules;
    private constructor();
    static getInstance(): Rules;
    setRules(rules: Array<Rule>): void;
    private checkParagraph;
    validateMessage(type: IncomeMessageType, text: string): Rule;
}
