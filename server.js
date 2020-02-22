//global packages
const {ActionBlock, SectionBlock, WebAPICallResult, KnownBlock, MessageAttachment} = require("@slack/types");
const {createMessageAdapter} = require('@slack/interactive-messages');
const {WebClient} = require('@slack/web-api');
const {Verification} = require('./middleware/Verification');
const nodeMailin = require('node-mailin');
require('dotenv').config();
const app = require('express')();
const bodyParser = require('body-parser');

//local packages
const Notifications = require('./utilities/Notifications');
const Actions = require('./utilities/Actions');
const Email = require('./utilities/Email');

//Check if we have the necessary Slack parameters
if (!process.env.SLACK_BOT_TOKEN || !process.env.SLACK_SIGNING_SECRET) {
    throw 'Environment variables not properly loaded!';
}

//globals
/***
 * @type {string} TOKEN - Slack bot access token
 * @type {string|number} PORT - port for the application to listen to messages on
 * @type {string} SECRET - Slack Signing Secret
 */
const TOKEN = process.env.SLACK_BOT_TOKEN;
const PORT = process.env.NODE_PORT || 80;
const SECRET = process.env.SLACK_SIGNING_SECRET;
const API = process.env.POST_API;

/***
 *
 * @type {WebClient}
 * @type {Notifications}
 * @type {Actions}
 */
const webclient = new WebClient(TOKEN);
const notifications = new Notifications(webclient);
const actions = new Actions(webclient);

/***
 * Starts the application
 */
app.listen(PORT, () => {
    console.log('AIR is up');
});

/***
 * Setups of the message adapter to read incoming actions
 *
 * @type {SlackMessageAdapter}
 */
const slackInteractions = createMessageAdapter(SECRET);
app.use('/slack/actions', slackInteractions.expressMiddleware());
slackInteractions.action({type:'button'}, (payload, respond) => {
    actions.onButtonAction(payload, respond);
});

/***
 *  Set's up express' middleware and endpoints
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    Verification.verification(req, res, next);
});

app.post('/tmd_slack_notification', (req, res) => {
    notifications.normal(req.body.dispatch);
    res.status(200).send();

});

app.post('/tmd_slack_notification_long', (req, res) => {
    notifications.longtone(req.body.dispatch);
    res.status(200).send();
});


/***
 * Set's up email to receive and process
 */
nodeMailin.start({
    port: 25
});

// eslint-disable-next-line require-await
nodeMailin.on('validateSender', async (session, address, callback) => {
    Email.verifySender(address, callback);
});

nodeMailin.on('message', async (connection, data) => {
    const dataEmail = Email.parseEmail(data.text);
    notifications.email(dataEmail);
    if (API) {
        Email.postToAPI(API, dataEmail);
    }
});

