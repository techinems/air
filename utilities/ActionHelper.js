require('dotenv').config();

const NAME_FORMAT = process.env.NAME_FORMAT;

/***
 * A user
 * @typedef {Object} User
 */

class ActionHelper {
    /***
     *  Removes an attachment from the list of attachments based on the block id of the attachment.
     *
     * @param {MessageAttachment[]} attachments - List of attachments
     * @param {string} block_id - A block id of a suspected attachment
     * @returns {MessageAttachment[]} A list of attachments without attachments with the passed block id
     */
    static removeAttachmentByBlockId(attachments, block_id) {
        attachments.forEach((attachment, index) => {
            if (attachment.blocks[0].block_id === block_id) {
                attachments.splice(index, 1);
            }
        });
        return attachments;
    }

    /***
     * Formats a given name based on the configuration file
     *
     * @param {User} user - A Slack User object of the user that needs their name formatted
     * @returns {string} - Formatted name
     */
    static getFormattedName(user) {
        let name = user.real_name;
        switch (NAME_FORMAT.toLowerCase()) {
        case 'short':
            const name_list = user.real_name.split(' ');
            name = `${name_list[0].charAt(0)}. ` +
                `${name_list[name_list.length - 1]}`;
            break;
        case 'full':
            break;
        case 'mention':
            name = `<${user.id}>`;
            break;
        }
        return name;
    }
}

module.exports = ActionHelper;
