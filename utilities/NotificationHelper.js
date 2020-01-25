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
                fields: [
                    {
                        type: 'plain_text',
                        text: 'Night crew call. No response is needed.'
                    }
                ]
            }
        ];
    }

    static dispatchMessage(req) {
        return {
            type: 'section',
            block_id: 'dispatch',
            fields: [
                {
                    type: 'mrkdwn',
                    text: `RPI Ambulance dispatched on
                     ${this.makeDate()}\n*${req.body.dispatch}*`
                }
            ]
        };
    }
    static longtoneMessage(req) {
        return {
            type: 'section',
            block_id: 'longtone',
            fields: [
                {
                    type: 'mrkdwn',
                    text: `Rensslaer County longtone on
                     ${this.makeDate()}\n*${req.body.dispatch}*`
                }
            ]
        };
    }

    static compareTime(hr, min, direction) {

        const now = new Date();
        const nowhr = now.getHours();
        const nowmin = now.getMinutes();

        if (direction === 'lt') {
            return (nowhr < hr) || ((nowhr === hr) && (nowmin < min));
        } else if (direction === 'gt') {
            return (nowhr > hr) || ((nowhr === hr) && (nowmin > min));
        }
    }

    static makeDate() {
        const now = new Date();
        return [
            now.getFullYear(),
            '-',
            now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1),
            '-',
            now.getDate() < 10 ? '0' + (now.getDate()) : (now.getDate()),
            ' at ',
            now.getHours() < 10 ? '0' + (now.getHours()) : (now.getHours()),
            ':',
            now.getMinutes() < 10 ? '0' + (now.getMinutes()) : (now.getMinutes()),
            ':',
            now.getSeconds() < 10 ? '0' + (now.getSeconds()) : (now.getSeconds())
        ].join('');
    }
}

module.exports = { NotificationHelper};
