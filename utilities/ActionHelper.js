require('dotenv').config();

const NAME_FORMAT = process.env.NAME_FORMAT;

class ActionHelper {
    static removeAttachmentByBlockId(attachments, block_id) {
        attachments.forEach((attachment, index) => {
            if (attachment.blocks[0].block_id === block_id) {
                attachments.splice(index, 1);
            }
        });
        return attachments;
    }

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
