const SlackIntegration = require('./SlackIntegration');
const SlackIntegrationHelper = require('./SlackIntegrationHelper');
const ActionHelper = require('./ActionHelper');

require('dotenv').config();

const MAX_ELAPSED_TIME = process.env.MAX_ELAPSED_TIME * 60 * 1000;

class Actions extends SlackIntegration {
    /***
     * Add/change a user's responding status based on the button they have clicked
     *
     * @param {Object} payload - All the information relating to the message and button push action
     * @param {Response} res - The response which will be sent back to Slack
     */
    onButtonAction(payload, res) {
        try {
            const messageTime = new Date(payload.message.ts * 1000);
            const actionTime = new Date(payload.actions[0].action_ts * 1000);
            if ((actionTime - messageTime) < MAX_ELAPSED_TIME) {
                const attachments = ActionHelper.removeAttachmentByBlockId(
                    payload.message.attachments, payload.user.id);
                this.getSlackUser(payload.user.id).then(resp => {
                    const name = ActionHelper.getFormattedName(resp.user);
                    let blocks = [];
                    let color = '#7CD197';
                    if (payload.actions[0].action_id === 'statusYes') {
                        blocks = [SlackIntegrationHelper.buildSectionBlock(
                            payload.user.id, `*${name}* is *RESPONDING*.`)];
                    } else if (payload.actions[0].action_id === 'statusNo') {
                        blocks = [SlackIntegrationHelper.buildSectionBlock(
                            payload.user.id, `*${name}* is NOT RESPONDING.`)];
                        color = '#D3D3D3';
                    }
                    attachments.push({blocks, color});
                    this.deleteSlackMessage(payload.container.channel_id,
                        payload.message.ts);
                    this.postSlackMessageMA(payload.container.channel_id, attachments);
                });
            } else {
                this.postSlackEphemeral(payload.container.channel_id, 'Sorry, your' +
                    ' response was logged too long after the dispatch went out.',
                payload.user.id);
            }
        } catch (e) {
            res.status(500).send();
        }
    }
}

module.exports = Actions;
