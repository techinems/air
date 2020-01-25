const {NotificationHelper} = require('./NotificationHelper');

require('dotenv').config();

const AIR_CHANNEL = process.env.AIR_CHANNEL;
const DISPATCH_CHANNEL = process.env.DISPATCH_CHANNEL;
const VERIFICATION = process.env.VERIFICATION_TOKEN;

class Notifications {
    constructor(webclient) {
        this.web = webclient;
    }

    postMessage(channel, blocks, unfurl_links=true, color='#F35A00') {
        const msg = {channel:channel, attachments:[{color:color, blocks:blocks}],
            unfurl_links:unfurl_links};
        return this.web.chat.postMessage(msg);
    }

    normal(req, res) {
        if (req.body.verification === VERIFICATION) {
            if (NotificationHelper.compareTime(5, 55, 'gt')
                && NotificationHelper.compareTime(18, 5, 'lt')) {
                this.postMessage(AIR_CHANNEL, NotificationHelper.dayCall(req));
                this.postMessage(DISPATCH_CHANNEL,
                    [NotificationHelper.dispatchMessage(req)]);
            } else {
                this.postMessage(AIR_CHANNEL, NotificationHelper.nightCall(req));
                this.postMessage(DISPATCH_CHANNEL, NotificationHelper.nightCall(req));
            }
        } else {
            res.status(401).send();
        }
    }

    longtone(req, res) {
        if (req.body.verification === VERIFICATION) {
            this.postMessage(AIR_CHANNEL, NotificationHelper.longtoneMessage(req));
            this.postMessage(DISPATCH_CHANNEL, NotificationHelper.longtoneMessage(req));
        }
        else {
            res.status(401).send();
        }
    }
}

module.exports = {Notifications};
