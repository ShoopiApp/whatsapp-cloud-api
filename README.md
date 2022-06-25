# WhatsApp Cloud Api

This is an unofficial package for the WhatsApp Cloud Api, the project still under development.

## Requirements

- Access to the Cloud Api, you can read more [here](https://developers.facebook.com/docs/whatsapp/cloud-api/)
- A Redis server can [download](https://redis.io/download/) and remember use the command `redis-stack-server` to start it localy
- Subscribed to the `message` webhook read more [here](https://developers.facebook.com/docs/graph-api/webhooks/reference/whatsapp_business_account/#messages)

## Installation

Install Whatsapp Cloud Api with npm

```bash
  npm install @shoopi/whatsapp-cloud-api
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

| Parameter      | Description                                | Required |
| :------------- | :----------------------------------------- | :------- |
| `ACCESS_TOKEN` | Temporal o permanent WhatsApp Access token | ✅       |
| `VERIFY_TOKEN` | Any secret string                          | ✅       |
| `WEBHOOK_PORT` | The port to start the webhook              |          |

`environment`=`DEV` Will connect to the default local redis server

If you are using online redis server need to add those environment variables

`REDIS_PORT`

`REDIS_USERNAME`

`REDIS_PASSWORD`

## Usage/Examples

```javascript
import WhatsappCloudApi from "@shoopi/whatsapp-cloud-api";
import templates from "./templates.json";
import rules from "./rules.json";

function main() {
  new WhatsappCloudApi({
    templates: templates,
    rules: rules,
  });
}
main();
```

When use the discord bot have to add this environment variables

| Parameter                | Description                             | Required |
| :----------------------- | :-------------------------------------- | :------- |
| `DISCORD_TOKEN`          | The discord bot token                   | ✅       |
| `DISCORD_CLIENT`         | The discord bot client                  | ✅       |
| `DISCORD_GUILD_ID`       | The server where the bot will work      | ✅       |
| `DISCORD_QUEUE_CHANNEL`  | The channel to send request to chat     | ✅       |
| `DISCORD_CHATS_CATEGORY` | By default will take the parent channel |          |

## [Discord bot middleware](https://github.com/ShoopiApp/whatsapp-cloud-api-plugin-discord) for whatsapp cloud api

```javascript
import DiscordPlugin from "@shoopi/whatsapp-cloud-api-plugin-discord";
import WhatsappCloudApi from "@shoopi/whatsapp-cloud-api";
import templates from "./templates.json";
import rules from "./rules.json";

function main() {
  const discordbot = DiscordPlugin.getInstance();
  discordbot.init();
  new WhatsappCloudApi({
    templates: templates,
    rules: rules,
    middlewares: [discordbot.getMiddleware()],
  });
}
main();
```

## Template and Rules

To start the bot you need two params `template` and `rules` those can be a .json or variable but need to follow this structure

### `template`

```
{
    "default_unknow_response":{
       "type":"text",
       "text":{
          "body":"Please select a valid option."
       }
    },
    "welcome_menu":{
       "type":"interactive",
       "interactive":{
          "type":"button",
          "header":{
             "type":"text",
             "text":"This is the header"
          },
          "body":{
             "text":"This is the body of your message"
          },
          "action":{
             "buttons":[
                {
                   "type":"reply",
                   "reply":{
                      "id":"button-one-id",
                      "title":"Button one"
                   }
                },
                {
                   "type":"reply",
                   "reply":{
                      "id":"button-two-id",
                      "title":"Button two"
                   }
                },
                {
                   "type":"reply",
                   "reply":{
                      "id":"button-three-id",
                      "title":"Button three"
                   }
                }
             ]
          }
       }
    },
    "response_one":{
       "type":"text",
       "text":{
            "body":"This is a response for the first button"
       }
    },
    "response_two":{
       "type":"text",
       "text":{
            "body":"This is a response for the second button"
       }
    },
    "response_three":{
       "type":"text",
       "text":{
            "body":"This is a response for the third button"
       }
    },
    "response_trigger":{
       "type":"text",
       "text":{
            "body":"This is a response for the trigger"
       }
    },
    "template_message":{
       "type":"template",
       "template":{
          "name":"sample_shipping_confirmation",
          "language":{
             "code":"en"
          },
          "components":[
             {
                "type":"body",
                "parameters":[
                   {
                      "type":"text",
                      "text":"1"
                   }
                ]
             }
          ]
       }
    }
}
```

The template need at least `welcome_menu` and `default_unknow_response`

Read the full [documentation](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages) of all message type.

### `rules`

```
[
    {
       "type":"interactive",
       "button_id":"button-one-id",
       "context":"user_request_information",
       "expected_response":{
          "type":"interactive"
       },
       "response":{
          "id":"response_one"
       }
    },
    {
       "type":"interactive",
       "button_id":"button-two-id",
       "context":"user_request_information",
       "expected_response":{
          "type":"interactive"
       },
       "response":{
          "id":"response_two"
       }
    },
    {
       "type":"interactive",
       "button_id":"button-three-id",
       "context":"user_request_information",
       "expected_response":{
          "type":"text"
       },
       "response":{
          "id":"response_three"
       }
    },
    {
       "type":"text",
       "triggers":[
          "this",
          "trigger",
          "i",
          "some"
       ],
       "context":"user_request_information",
       "expected_response":{
          "type":"text"
       },
       "matchs":2,
       "response":{
          "id":"response_trigger"
       }
    }
]
```

The `type` can be:

```
text
image
location
interactive
template
```

If the type is `interactive` and expect a button you have to pass the `button_id`

The `context` accept those types and can use whatever you want:

```
unknow
welcome
waiting_for_action
waiting_for_information
user_request_information
waiting_to_talk_with_human
talking_with_human
```

When use the `triggers` pass the array of words to trigger that rule and can set the numbers of `matchs` the default is `1`

## Roadmap

- Image support

- Location suport

- Document support

- Contact support

## Contributing

Contributions are always welcome!

## Feedback

If you have any feedback, please reach out to us at info@shoopi.app
