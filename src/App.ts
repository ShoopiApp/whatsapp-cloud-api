import helmet from "helmet";
import express from "express";
import ConversationHandler from "./lib/conversation/conversation";

export default class App {
  public app: express.Application;
  public path = process.env.WEBHOOK || "/whatsapp_webhook";

  constructor() {
    this.app = express();
    this.initializeHelmet();
    this.initializeMiddleware();
    this.initializeController();
  }

  public async listen(): Promise<void> {
    const port = process.env.WEBHOOK_PORT || 9500;
    this.app.listen(port, () => {
      console.log(`Express server listening on port ${port}`);
    });
  }

  private initializeHelmet() {
    this.app.use(helmet());
  }

  private initializeMiddleware() {
    this.app.use(express.json());
  }

  private initializeController() {
    this.app.get("/api", (_, res) => {
      res.status(200).send("API works.");
    });

    this.app.get(this.path, (req, res) => {
      const verify_token = process.env.VERIFY_TOKEN;
      // Parse params from the webhook verification request
      const mode = req.query["hub.mode"];
      const token = req.query["hub.verify_token"];
      const challenge = req.query["hub.challenge"];

      // Check if a token and mode were sent
      if (mode && token) {
        // Check the mode and token sent are correct
        if (mode === "subscribe" && token === verify_token) {
          // Respond with 200 OK and challenge token from the request
          console.log("WEBHOOK_VERIFIED");
          res.status(200).send(challenge);
        } else {
          // Responds with '403 Forbidden' if verify tokens do not match
          res.sendStatus(403);
        }
      }
    });

    // this.app.use("/", () => {});

    this.app.post(this.path, (req, res) => {
      if (req.body.object) {
        if (
          req.body.entry &&
          req.body.entry[0].changes &&
          req.body.entry[0].changes[0] &&
          req.body.entry[0].changes[0].value.messages &&
          req.body.entry[0].changes[0].value.messages[0]
        ) {
          const sender = req.body.entry[0].changes[0].value.metadata;
          const message = req.body.entry[0].changes[0].value.messages[0];
          const contact = req.body.entry[0].changes[0].value.contacts[0];
          const conversation = new ConversationHandler();
          conversation.run(sender, contact, message);
        }
        res.sendStatus(200);
      } else {
        // Return a '404 Not Found' if event is not from a WhatsApp API
        res.sendStatus(404);
      }
    });
  }
}
