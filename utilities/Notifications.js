const {NotificationHelper} = require('./NotificationHelper');

require('dotenv').config();

const AIR_CHANNEL = process.env.AIR_CHANNEL;
const DISPATCH_CHANNEL = process.env.DISPATCH_CHANNEL;
const NC_START = process.env.NIGHT_CREW_START;
const NC_END = process.env.NIGHT_CREW_END;

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
        if (NC_START && NC_END &&
            NotificationHelper.verifyNightCrew(NC_START, NC_END)) {
            this.postMessage(AIR_CHANNEL, NotificationHelper.nightCall(req));
            this.postMessage(DISPATCH_CHANNEL, NotificationHelper.nightCall(req));
        } else {
            this.postMessage(AIR_CHANNEL, NotificationHelper.dayCall(req));
            this.postMessage(DISPATCH_CHANNEL,
                [NotificationHelper.dispatchMessage(req)]);
        }
        res.status(200).send();
    }

    longtone(req, res) {
        this.postMessage(AIR_CHANNEL, NotificationHelper.longtoneMessage(req));
        this.postMessage(DISPATCH_CHANNEL, NotificationHelper.longtoneMessage(req));
        res.status(200).send();
    }
}

module.exports = {Notifications};
