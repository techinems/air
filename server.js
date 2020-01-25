const {Notifications} = require('./utilities/Notifications');
const {Actions} = require('./utilities/Actions');
const {createMessageAdapter} = require('@slack/interactive-messages');
const {WebClient} = require('@slack/web-api');
const app = require('express')();
require('dotenv').config();
const bodyParser = require('body-parser');

if (!process.env.SLACK_BOT_TOKEN || !process.env.SLACK_SIGNING_SECRET) {
    throw 'Environment variables not properly loaded!';
}
const TOKEN = process.env.SLACK_BOT_TOKEN;
const PORT = process.env.NODE_PORT || 80;
const SECRET = process.env.SLACK_SIGNING_SECRET;

const webclient = new WebClient(TOKEN);
const notifications = new Notifications(webclient);
const actions = new Actions(webclient);

const slackInteractions = createMessageAdapter(SECRET);

app.listen(PORT, () => {
    console.log('AIR is up');
});

app.use('/slack/actions', slackInteractions.expressMiddleware());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/tmd_slack_notification', (req, res) => {
    notifications.normal(req, res);
});

app.post('/tmd_slack_notification_long', (req, res) => {
    notifications.longtone(req, res);
});

slackInteractions.action({type:'button'}, (payload, respond) => {
    console.log('button');
    actions.onButtonAction(payload, respond);
});

