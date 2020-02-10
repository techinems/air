class SlackIntegrationHelper {
    static buildSectionBlock(block_id, text) {
        return {type: 'section', block_id, text: {type: 'mrkdwn', text}};
    }
    static buildButton(action_id, text, style=null) {
        let button = {type:'button', action_id,
            text: {type: 'plain_text', text, emoji: false}};
        if (style) {
            button['style'] = style;
        }
        return button;
    }
}

module.exports = SlackIntegrationHelper;
