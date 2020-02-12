class SlackIntegration {
    constructor(webclient) {
        this.web = webclient;
    }
    postSlackMessage(channel, blocks, color='#F35A00') {
        const msg = {channel, attachments:[{color, blocks}]};
        return this.web.chat.postMessage(msg);
    }

    postSlackMessageMA(channel, attachments) {
        const msg = {channel, attachments};
        return this.web.chat.postMessage(msg);
    }

    updateSlackMessage(channel, ts, blocks, color='#F35A00') {
        const msg = {channel, ts, attachments:[{color, blocks}]};
        return this.web.chat.update(msg);
    }

    updateSlackMessageMA(channel, ts, attachments) {
        const msg = {channel, ts, attachments};
        return this.web.chat.update(msg);
    }

    postSlackEphemeral(channel, text, user) {
        return this.web.chat.postEphemeral({channel, text, user});
    }

    deleteSlackMessage(channel, ts) {
        return this.web.chat.delete({channel, ts});
    }

    async getlatestSlackMessage(channel) {
        return await this.web.conversations.history({channel, limit:1});
    }

    async getSlackUser(user) {
        return await this.web.users.info({user})
    }

}

module.exports = SlackIntegration;
