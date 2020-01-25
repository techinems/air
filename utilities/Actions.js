require('dotenv').config();

const MAX_ELAPSED_TIME = process.env.MAX_ELAPSED_TIME * 60 * 1000;

class Actions {
    constructor(webclient) {
        this.web = webclient;
    }

    postMessage(channel, blocks, color) {
        const msg = {channel:channel, attachments:[{color:color, blocks:blocks}]};
        return this.web.chat.postMessage(msg);
    }

    onButtonAction(payload, res) {
        try {
            const messageTime = new Date(payload.message.ts * 1000);
            const actionTime = new Date(payload.actions[0].action_ts * 1000);
            if ((actionTime - messageTime) < MAX_ELAPSED_TIME) {
                this.web.users.info({user: payload.user.id}).then(resp => {
                    const name = resp.user.real_name;
                    if (payload.actions[0].action_id === 'statusYes') {
                        const blocks = {
                            type: 'section',
                            block_id: 'responding',
                            text: {
                                type: 'mrkdwn',
                                text: `*${name}* is *RESPONDING*.`
                            }
                        };
                        this.postMessage(payload.container.channel_id,
                            [blocks], '#7CD197');
                    } else if (payload.actions[0].action_id === 'statusNo') {
                        const blocks = {
                            type: 'section',
                            block_id: 'notresponding',
                            text: {
                                type: 'mrkdwn',
                                text: `*${name}* is NOT RESPONDING.`
                            }
                        };
                        this.postMessage(payload.container.channel_id,
                            [blocks], '#d3d3d3');
                    }
                }
                );
            } else {
                this.web.chat.postEphemeral({
                    channel: payload.container.channel_id,
                    text: 'Sorry, your response was logged too' +
                        ' long after the dispatch went out.',
                    user: payload.user.id
                }
                ).then();
            }
        } catch (e) {
            res.status(500).send();
        }
    }
}

module.exports = {Actions};
