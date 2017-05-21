const Botkit = require("botkit");
const url = require("url");
const redisURL = url.parse(process.env.REDISTOGO_URL || process.env.REDIS_URL);
const redisStorage = require("botkit-storage-redis")({
  namespace: "howWasToday",
  host: redisURL.hostname,
  port: redisURL.port,
  auth_pass: redisURL.auth && redisURL.auth.split(":")[1],
});
const env = process.env;

class Bot {
  constructor() {
    this.controller = Botkit.slackbot({
      retry: 10,
      clientId: env.SLACK_APP_CLIENT_ID,
      clientSecret: env.SLACK_APP_CLIENT_SECRET,
      scopes: ["bot"],
      storage: redisStorage,
    });
  }

  setupWebserver() {
    this.controller.setupWebserver(env.PORT, () => {
      this.controller.createOauthEndpoints(this.controller.webserver, (error, request, response) => {
        if (error) {
          response.status(500).send(`ERROR: ${error}`);
        } else {
          response.send("Success!");
        }
      });
    });
  }

  run() {
    this.controller.spawn({
      token: env.SLACK_BOT_TOKEN,
    }).startRTM((error) => {
      throw new Error(error);
    });

    this.setupWebserver();
  }
}

module.exports = Bot;
