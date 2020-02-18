const SlackIntegrationHelper = require('./SlackIntegrationHelper');

require('dotenv').config();

const NC_START = process.env.NIGHT_CREW_START;
const NC_END = process.env.NIGHT_CREW_END;
const AIR_ORDER = process.env.AIR_MESSAGE_ORDER;
const DISPATCH_ORDER = process.env.DISPATCH_MESSAGE_ORDER;

class NotificationHelper {
    static dayCall(req) {
        return [
            this.dispatchTime(),
            this.normalMessage(req),
            SlackIntegrationHelper.buildSectionBlock('day', 'Are you responding?'),
            {
                type: 'actions',
                elements: [
                    SlackIntegrationHelper.buildButton('statusYes', 'Yes', 'danger'),
                    SlackIntegrationHelper.buildButton('statusNo', 'No'),
                ]
            }
        ];
    }

    static nightCall(req) {
        return [
            this.dispatchTime(),
            this.normalMessage(req),
            SlackIntegrationHelper.buildSectionBlock('night',
                'Night crew call. No response is needed.')
        ];
    }

    static normalMessage(req) {
        return SlackIntegrationHelper.buildSectionBlock('dispatch', req.body.dispatch);
    }

    static dispatchTime() {
        return SlackIntegrationHelper.buildSectionBlock('time',
            `RPI Ambulance dispatched on ${this.getCurrentTime()}`);
    }

    static longtoneMessage(req) {
        return [SlackIntegrationHelper.buildSectionBlock('longtone',
            `Rensslaer County longtone on 
            ${this.getCurrentTime()}\n*${req.body.dispatch}*`)];
    }

    static emailMessage(data, dispatch=false) {
        let text = '';
        const order = dispatch ? DISPATCH_ORDER.split('|') : AIR_ORDER.split('|');
        order.forEach((key) => {
            if (data[key]) {
                text += `${key}: ${data[key]}\n`;
            }
        });
        return SlackIntegrationHelper.buildSectionBlock('email', text);
    }

    static verifyNightCrew() {
        if (!NC_START || !NC_END) return false;
        const start_time_list = NC_START.split(':');
        const end_time_list = NC_END.split(':');
        const start = parseInt(start_time_list[0]) * 60 + parseInt(start_time_list[1]);
        const end = parseInt(end_time_list[0]) * 60 + parseInt(end_time_list[1]);
        const date = new Date();
        const now = date.getHours() * 60 + date.getMinutes();
        return start <= now || end >= now;
    }

    static getCurrentTime() {
        const now = new Date();
        return new Date(now.getTime() - (now.getTimezoneOffset() * 60000 ))
            .toISOString().split('T')[0] + ' at '
            + now.toTimeString().split(' ')[0];
    }
}

module.exports = NotificationHelper;
