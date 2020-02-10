const NotificationHelper = require('./NotificationHelper');
const SlackIntegration = require('./SlackIntegration');

require('dotenv').config();

const AIR_CHANNEL = process.env.AIR_CHANNEL;
const DISPATCH_CHANNEL = process.env.DISPATCH_CHANNEL;

class Notifications extends SlackIntegration {

    normal(req, res) {
        if (NotificationHelper.verifyNightCrew()) {
            this.postSlackMessage(AIR_CHANNEL, NotificationHelper.nightCall(req));
            this.postSlackMessage(DISPATCH_CHANNEL, NotificationHelper.nightCall(req));
        } else {
            this.postSlackMessage(AIR_CHANNEL, NotificationHelper.dayCall(req));
            this.postSlackMessage(DISPATCH_CHANNEL, [NotificationHelper.dispatchTime(),
                NotificationHelper.normalMessage(req)]);
        }
        res.status(200).send();
    }

    longtone(req, res) {
        this.postSlackMessage(AIR_CHANNEL, NotificationHelper.longtoneMessage(req));
        this.postSlackMessage(DISPATCH_CHANNEL, NotificationHelper.longtoneMessage(req));
        res.status(200).send();
    }

    email(data) {
        this.getlatestSlackMessage(AIR_CHANNEL).then((result) => {
            result.messages[0].attachments[0].blocks[1] =
                NotificationHelper.emailMessage(data);
            this.updateSlackMessageMA(AIR_CHANNEL, result.messages[0].ts,
                result.messages[0].attachments);
        });
    }
}

module.exports = Notifications;
