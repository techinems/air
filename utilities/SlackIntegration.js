class SlackIntegration {
    /***
     * Constructs the Slack Integration
     *
     * @param {WebClient} webclient - A Slack Web Client
     */
    constructor(webclient) {
        this.web = webclient;
    }

    /***
     * Posts a Slack message as an attachment
     *
     * @param {string} channel - Channel id where the message will be posted
     * @param KnownBlock[] blocks - An array of blocks for the attachment
     * @param {string} color - Color used for side bar of attachment. Default: #F35A00
     * @returns {Promise<WebAPICallResult>} Promise of the message sending
     */
    postSlackMessage(channel, blocks, color='#F35A00') {
        const msg = {channel, attachments:[{color, blocks}]};
        return this.web.chat.postMessage(msg);
    }

    /***
     * Post a Slack message with multiple attachments
     *
     * @param {string} channel - Channel id where the message will be posted
     * @param MessageAttachment[] attachments - An array of attachments to be posted
     * @returns {Promise<WebAPICallResult>}  Promise of the message sending
     */
    postSlackMessageMA(channel, attachments) {
        const msg = {channel, attachments};
        return this.web.chat.postMessage(msg);
    }

    /***
     * Updates a Slack message with multiple attachments
     *
     * @param {string} channel - Channel id where the message is currently
     * @param {number} ts - Timestamp of message
     * @param MessageAttachment[] attachments - An array of attachments to be updated
     * @returns {Promise<WebAPICallResult>}  Promise of the message updating
     */
    updateSlackMessageMA(channel, ts, attachments) {
        const msg = {channel, ts, attachments};
        return this.web.chat.update(msg);
    }

    /***
     * Sends a Slack Ephemeral message
     *
     * @param {string} channel - Channel id where the message will be displayed
     * @param {string} text - The text of the message being sent
     * @param {string} user - User id to whom the message will be seen by
     * @returns {Promise<WebAPICallResult>} Promise of the message sending
     */
    postSlackEphemeral(channel, text, user) {
        return this.web.chat.postEphemeral({channel, text, user});
    }

    /***
     * Deletes a Slack message
     *
     * @param {string} channel - Channel id where the message is currently
     * @param {number} ts - Timestamp of message
     * @returns {Promise<WebAPICallResult>} Promise of the message being deleted
     */
    deleteSlackMessage(channel, ts) {
        return this.web.chat.delete({channel, ts});
    }

    /***
     * Get's latest Slack message from a channel
     *
     * @param {string} channel - Channel id of the channel to be searched
     * @returns {Promise<WebAPICallResult>} - Promise of the message being searched for
     */
    async getlatestSlackMessage(channel) {
        return await this.web.conversations.history({channel, limit:1});
    }

    /**
     * Get's Slack user give a user id
     *
     * @param {string} user - Slack user id for person being searched
     * @returns {Promise<WebAPICallResult>} - Promise of the user being searched for
     */
    async getSlackUser(user) {
        return await this.web.users.info({user});
    }

}

module.exports = SlackIntegration;
