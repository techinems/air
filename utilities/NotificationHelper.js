const SlackIntegrationHelper = require('./SlackIntegrationHelper');

require('dotenv').config();

const NC_START = process.env.NIGHT_CREW_START;
const NC_END = process.env.NIGHT_CREW_END;
const AIR_ORDER = process.env.AIR_MESSAGE_ORDER;
const DISPATCH_ORDER = process.env.DISPATCH_MESSAGE_ORDER;
const BEGIN_NORMAL_MESSAGE= process.env.BEGIN_NORMAL_MESSAGE;
const BEGIN_LONGTONE_MESSAGE= process.env.BEGIN_LONGTONE_MESSAGE;

class NotificationHelper {
    /***
     * Returns a day call message
     *
     * @param {string} message - The message received from POST request
     * @returns {KnownBlock[]} - An array of appropriate blocks which forms the message
     */
    static dayCall(message) {
        return [
            this.dispatchTime(),
            this.normalMessage(message),
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

    /***
     * Returns a night call message
     *
     * @param {string} message - The message received from POST request
     * @returns {KnownBlock[]} - An array of appropriate blocks which forms the message
     */
    static nightCall(message) {
        return [
            this.dispatchTime(),
            this.normalMessage(message),
            SlackIntegrationHelper.buildSectionBlock('night',
                'Night crew call. No response is needed.')
        ];
    }

    /***
     * Forms a block based on dispatch message
     *
     * @param {string} message - The message received from POST request
     * @returns {SectionBlock} - The dispatch message block
     */
    static normalMessage(message) {
        return SlackIntegrationHelper.buildSectionBlock('dispatch', message);
    }

    /***
     * Returns first statement of the normal dispatch/responding message with current time
     *
     * @returns {SectionBlock} - The first statement block
     */
    static dispatchTime() {
        return SlackIntegrationHelper.buildSectionBlock('time',
            `${BEGIN_NORMAL_MESSAGE} ${this.getCurrentTime()}`);
    }

    /***
     * Returns array of KnownBlock for the longtone message of a longtone
     *
     * @returns {KnownBlock[]}  An array of appropriate blocks which forms the message
     */
    static longtoneMessage(message) {
        return [SlackIntegrationHelper.buildSectionBlock('longtone',
            `${BEGIN_LONGTONE_MESSAGE} ${this.getCurrentTime()}\n*${message}*`)];
    }

    /***
     * Formats and returns message made of up the information form the email message
     *
     * @param {Map.<string,string>} data - Information from email
     * @param {boolean} dispatch - Whether this is going to the dispatch channel or responding channel. True is for dispatch channel/
     * @returns {SectionBlock} The block with the necessary message information
     */
    static emailMessage(data, dispatch=false) {
        let text = '';
        const order = dispatch ? DISPATCH_ORDER.split('|') : AIR_ORDER.split('|');
        if ('message' in data) {
            return SlackIntegrationHelper.buildSectionBlock('email',data['message']);
        }
        order.forEach((key) => {
            if (data[key]) {
                text += `${key}: ${data[key]}\n`;
            }
        });
        return SlackIntegrationHelper.buildSectionBlock('email', text);
    }

    /***
     * Verify the current time is during night crew. Returns true if it is night crew
     *
     * @returns {boolean} Whether it is night crew or not
     */
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

    /***
     * Returns the current time
     *
     * @returns {string} Current Time
     */
    static getCurrentTime() {
        const now = new Date();
        return new Date(now.getTime() - (now.getTimezoneOffset() * 60000 ))
            .toISOString().split('T')[0] + ' at '
            + now.toTimeString().split(' ')[0];
    }
}

module.exports = NotificationHelper;
