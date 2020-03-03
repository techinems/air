const NotificationHelper = require('./NotificationHelper');
const SlackIntegration = require('./SlackIntegration');

require('dotenv').config();

const AIR_CHANNEL = process.env.AIR_CHANNEL;
const DISPATCH_CHANNEL = process.env.DISPATCH_CHANNEL;

class Notifications extends SlackIntegration {
    messageAIR = null;
    messageDispatch = null;

    /***
     * Sends out the appropriate message for normal dispatch
     *
     * @param {string} message - The message received from POST request
     */
    normal(message) {
        if (NotificationHelper.verifyNightCrew()) {
            this.postSlackMessage(AIR_CHANNEL, NotificationHelper.nightCall(message)).then(message => {
                this.messageAIR=message
                });
            if (!DISPATCH_CHANNEL) return;
            this.postSlackMessage(DISPATCH_CHANNEL,
                NotificationHelper.nightCall(message)).then(message => {
                this.messageDispatch=message
            });
        } else {
            this.postSlackMessage(AIR_CHANNEL, NotificationHelper.dayCall(message)).then(message => {
                this.messageAIR=message
            });
            if (!DISPATCH_CHANNEL) return;
            this.postSlackMessage(DISPATCH_CHANNEL, [NotificationHelper.dispatchTime(),
                NotificationHelper.normalMessage(message)]).then(message => {
                this.messageDispatch=message
                })
        }
    }

    /***
     * Sends out the appropriate message for longtone
     *
     * @param {string} message - The message received from POST request
     */
    longtone(message) {
        this.postSlackMessage(AIR_CHANNEL, NotificationHelper.longtoneMessage(message)).then(message => {
            this.messageDispatch = message;
        });
        if (!DISPATCH_CHANNEL) return;
        this.postSlackMessage(DISPATCH_CHANNEL,
            NotificationHelper.longtoneMessage(message)).then(message => {
            this.messageDispatch = message;
        })
    }

    /***
     * Updates the latest message from AIR for responding and dispatch with the email information
     *
     * @param {Map.<string,string>} data - Information from email
     */
    email(data) {
        this.messageAIR.message.attachments[0].blocks[1] =
            NotificationHelper.emailMessage(data);
        this.updateSlackMessageMA(AIR_CHANNEL, this.messageAIR.message.ts,
            this.messageAIR.message.attachments);
        if (!DISPATCH_CHANNEL) return;
        this.messageDispatch.message.attachments[0].blocks[1] =
            NotificationHelper.emailMessage(data, true);
        this.updateSlackMessageMA(DISPATCH_CHANNEL, this.messageDispatch.message.ts,
            this.messageDispatch.message.attachments);
    }

}

module.exports = Notifications;
