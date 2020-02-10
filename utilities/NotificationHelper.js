require('dotenv').config();

const NC_START = process.env.NIGHT_CREW_START;
const NC_END = process.env.NIGHT_CREW_END;

class NotificationHelper {
    static dayCall(data, email = false) {
        return [
            email ? this.emailMessage(data) : this.dispatchMessage(data),
            this.buildSectionBlock('day', 'Are you responding?'),
            {
                type: 'actions',
                elements: [
                    {
                        type: 'button',
                        text: {
                            type: 'plain_text',
                            text: 'Yes',
                            emoji: false
                        },
                        action_id: 'statusYes',
                        style: 'danger'
                    },
                    {
                        type: 'button',
                        text: {
                            type: 'plain_text',
                            text: 'No',
                            emoji: false
                        },
                        action_id: 'statusNo',
                    }
                ]
            }
        ];
    }

    static nightCall(data, email = false) {
        return [
            email ? this.emailMessage(data) : this.dispatchMessage(data),
            this.buildSectionBlock('night', 'Night crew call. No response is needed.')
        ];
    }

    static dispatchMessage(req) {
        return this.buildSectionBlock('dispatch', 'RPI Ambulance dispatched ' +
            `on ${this.getCurrentTime()}\n*${req.body.dispatch}*`);
    }

    static longtoneMessage(req) {
        return [this.buildSectionBlock('longtone', 'Rensslaer County longtone on ' +
            `${this.getCurrentTime()}\n*${req.body.dispatch}*`)];
    }

    static emailMessage(data) {
        let text = '\n';
        for (let key in data) {
            text += `${key}: ${data[key]}\n`;
        }
        return this.buildSectionBlock('email', text);
    }

    static buildSectionBlock(block_id, text) {
        return {type: 'section', block_id, text: {type: 'mrkdwn', text}};
    }

    static verifyNightCrew() {
        if (!NC_START || !NC_END) return false;
        const start_time_list = NC_START.split(':');
        const end_time_list = NC_END.split(':');
        const now = new Date();
        const start = new Date();
        start.setHours(parseInt(start_time_list[0]), parseInt(start_time_list[1]), 0);
        const end = new Date();
        end.setDate(start.getDate()+1);
        end.setHours(parseInt(end_time_list[0]), parseInt(end_time_list[1]), 0);
        return now > start && now < end;

    }

    static getCurrentTime() {
        const now = new Date();
        return new Date(now.getTime() - (now.getTimezoneOffset() * 60000 ))
                .toISOString().split('T')[0] + ' at '
            + now.toTimeString().split(' ')[0];
    }
}

module.exports = NotificationHelper;
