const NotificationHelper = require('./NotificationHelper');
const SlackIntegration = require('./SlackIntegration');

require('dotenv').config();

const AIR_CHANNEL = process.env.AIR_CHANNEL;
const DISPATCH_CHANNEL = process.env.DISPATCH_CHANNEL;

class Notifications extends SlackIntegration {
    /***
     * Sends out the appropriate message for normal dispatch
     *
     * @param {string} message - The message received from POST request
     */
    normal(message) {
        if (NotificationHelper.verifyNightCrew()) {
            this.postSlackMessage(AIR_CHANNEL, NotificationHelper.nightCall(message));
            if (!DISPATCH_CHANNEL) return;
            this.postSlackMessage(DISPATCH_CHANNEL, NotificationHelper.nightCall(message));
        } else {
            this.postSlackMessage(AIR_CHANNEL, NotificationHelper.dayCall(message));
            if (!DISPATCH_CHANNEL) return;
            this.postSlackMessage(DISPATCH_CHANNEL, [NotificationHelper.dispatchTime(),
                NotificationHelper.normalMessage(message)]);
        }
    }

    /***
     * Sends out the appropriate message for longtone
     *
     * @param {string} message - The message received from POST request
     */
    longtone(message) {
        this.postSlackMessage(AIR_CHANNEL, NotificationHelper.longtoneMessage(message));
        if (!DISPATCH_CHANNEL) return;
        this.postSlackMessage(DISPATCH_CHANNEL, NotificationHelper.longtoneMessage(message));
    }

    /***
     * Updates the latest message for responding and dispatch with the email information
     *
     * @param {Map.<string,string>} data - Information from email
     */
    email(data) {
        this.getlatestSlackMessage(AIR_CHANNEL).then((result) => {
            result.messages[0].attachments[0].blocks[1] =
                NotificationHelper.emailMessage(data);
            this.updateSlackMessageMA(AIR_CHANNEL, result.messages[0].ts,
                result.messages[0].attachments);
        });
        if (!DISPATCH_CHANNEL) return;
        this.getlatestSlackMessage(DISPATCH_CHANNEL).then((result) => {
            result.messages[0].attachments[0].blocks[1] =
                NotificationHelper.emailMessage(data, true);
            this.updateSlackMessageMA(DISPATCH_CHANNEL, result.messages[0].ts,
                result.messages[0].attachments);
        });
    }
}

module.exports = Notifications;
