const NotificationHelper = require('./NotificationHelper');

require('dotenv').config();

const AIR_CHANNEL = process.env.AIR_CHANNEL;
const DISPATCH_CHANNEL = process.env.DISPATCH_CHANNEL;

class Notifications {
    constructor(webclient) {
        this.web = webclient;
    }

    postMessage(channel, blocks,color='#F35A00') {
        const msg = {channel:channel, attachments:[{color:color, blocks:blocks}]};
        return this.web.chat.postMessage(msg);
    }

    updateMessage(channel, ts, blocks, color='#F35A00') {
        const msg = {channel, ts, attachments:[{color, blocks}]};
        return this.web.chat.update(msg);
    }

    normal(req, res) {
        if (NotificationHelper.verifyNightCrew()) {
            this.postMessage(AIR_CHANNEL, NotificationHelper.nightCall(req));
            this.postMessage(DISPATCH_CHANNEL, NotificationHelper.nightCall(req));
        } else {
            this.postMessage(AIR_CHANNEL, NotificationHelper.dayCall(req));
            this.postMessage(DISPATCH_CHANNEL, [NotificationHelper.dispatchTime(),
                NotificationHelper.dispatchMessage(req)]);
        }
        res.status(200).send();
    }

    longtone(req, res) {
        this.postMessage(AIR_CHANNEL, NotificationHelper.longtoneMessage(req));
        this.postMessage(DISPATCH_CHANNEL, NotificationHelper.longtoneMessage(req));
        res.status(200).send();
    }

    email(data) {
        this.web.conversations.history({channel:AIR_CHANNEL, limit:1}).then((result) => {
            const blocks =result.messages[0].attachments[0].blocks;
            blocks[1] = NotificationHelper.emailMessage(data);
            this.updateMessage(AIR_CHANNEL, result.messages[0].ts, blocks);
        });
    }
}

module.exports = Notifications;
