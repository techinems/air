class SlackIntegrationHelper {
    /***
     * Creates a SectionBlock
     *
     * @param {string} block_id - the id for the SectionBlock
     * @param {string} text - the message inside the SectionBlock
     * @returns {SectionBlock} the built SectionBlock
     */
    static buildSectionBlock = (block_id, text) => {
        return {type: 'section', block_id, text: {type: 'mrkdwn', text}};
    };

    /***
     * Creates a button
     * @param {string} action_id - the id for the button
     * @param {string} text- the message inside the button
     * @param {string|null} style - the style of the button
     * @returns {ActionBlock} the button
     */
    static buildButton = (action_id, text, style=null) => {
        let button = {type:'button', action_id,
            text: {type: 'plain_text', text, emoji: false}};
        if (style) {
            button['style'] = style;
        }
        return button;
    }
}

module.exports = SlackIntegrationHelper;
