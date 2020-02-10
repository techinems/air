const SlackIntegration = require('./SlackIntegration');
const SlackIntegrationHelper = require('./SlackIntegrationHelper');

require('dotenv').config();

const MAX_ELAPSED_TIME = process.env.MAX_ELAPSED_TIME * 60 * 1000;
const NAME_FORMAT = process.env.NAME_FORMAT;

class Actions extends SlackIntegration {
    onButtonAction(payload) {
        try {
            const messageTime = new Date(payload.message.ts * 1000);
            const actionTime = new Date(payload.actions[0].action_ts * 1000);
            if ((actionTime - messageTime) < MAX_ELAPSED_TIME) {
                payload.message.attachments.forEach((attachment, index) => {
                    if (attachment.blocks[0].block_id === payload.user.id) {
                        payload.message.attachments.splice(index, 1);
                    }

                });
                this.getSlackUser(payload.user.id).then(resp => {
                    let name = resp.user.real_name;
                    switch (NAME_FORMAT.toLowerCase()) {
                    case 'short':
                        const name_list = resp.user.real_name.split(' ');
                        name = `${name_list[0].charAt(0)}. ` +
                            `${name_list[name_list.length - 1]}`;
                        break;
                    case 'full':
                        break;
                    case 'mention':
                        name = `<${payload.user.id}>`;
                        break;
                    }
                    let blocks = {};
                    let color = '';
                    if (payload.actions[0].action_id === 'statusYes') {
                        blocks = [SlackIntegrationHelper.buildSectionBlock(
                            payload.user.id, `*${name}* is *RESPONDING*.`)];
                        color = '#7CD197';
                    } else if (payload.actions[0].action_id === 'statusNo') {
                        blocks = [SlackIntegrationHelper.buildSectionBlock(
                            payload.user.id, `*${name}* is NOT RESPONDING.`)];
                        color = '#d3d3d3';
                    }
                    payload.message.attachments.push({blocks, color});
                    this.deleteSlackMessage(payload.container.channel_id,
                        payload.message.ts);
                    this.postSlackMessageMA(payload.container.channel_id,
                        payload.message.attachments);
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
