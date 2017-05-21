const Bot = require('./app/Bot.js');

if (process.env.SLACK_BOT_TOKEN &&
  process.env.SLACK_APP_CLIENT_ID &&
  process.env.SLACK_APP_CLIENT_SECRET) {
  new Bot().run();
} else {
  console.log('Error: Specify Slack Tokens by environment variable');
  process.exit(1);
}
