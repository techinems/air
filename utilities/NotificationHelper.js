class NotificationHelper {
    static dayCall(req) {
        return [
            this.dispatchMessage(req),
            {
                type: 'section',
                block_id: 'day',
                text:{
                    type: 'plain_text',
                    text: 'Are you responding?'
                }
            },
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
    static nightCall(req) {
        return [
            this.dispatchMessage(req),
            {
                type: 'section',
                block_id: 'night',
                text: {
                    type: 'plain_text',
                    text: 'Night crew call. No response is needed.'
                }
            }
        ];
    }

    static dispatchMessage(req) {
        return {
            type: 'section',
            block_id: 'dispatch',
            text: {
                type: 'mrkdwn',
                text: 'RPI Ambulance dispatched on ' +
                    `${this.getCurrentTime()}\n*${req.body.dispatch}*`
            }
        };
    }
    static longtoneMessage(req) {
        return [
            {
                type: 'section',
                block_id: 'longtone',
                text: {
                    type: 'mrkdwn',
                    text: 'Rensslaer County longtone on ' +
                        `${this.getCurrentTime()}\n*${req.body.dispatch}*`
                }
            }
        ];
    }

    static verifyNightCrew(start_time, end_time) {
        const start_time_list = start_time.split(':');
        const end_time_list = end_time.split(':');
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

module.exports = { NotificationHelper};
