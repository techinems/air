const SlackIntegrationHelper = require('./SlackIntegrationHelper');
require('dotenv').config();

const NC_START = process.env.NIGHT_CREW_START;
const NC_END = process.env.NIGHT_CREW_END;
const ORDER = process.env.MESSAGE_ORDER;

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

    static emailMessage(data) {
        let text = '';
        const order = ORDER.split('|');
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
        const now = new Date();
        const start = new Date();
        start.setHours(parseInt(start_time_list[0]), parseInt(start_time_list[1]), 0);
        const end = new Date();
        end.setHours(parseInt(end_time_list[0]), parseInt(end_time_list[1]), 0);
        return now < start || now > end;
    }

    static getCurrentTime() {
        const now = new Date();
        return new Date(now.getTime() - (now.getTimezoneOffset() * 60000 ))
            .toISOString().split('T')[0] + ' at '
            + now.toTimeString().split(' ')[0];
    }
}

module.exports = NotificationHelper;
