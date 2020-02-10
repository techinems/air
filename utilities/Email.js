require('dotenv').config();

const REGEX = process.env.EMAIL_SPLIT_REGEX;
const EMAIL = process.env.DISPATCH_EMAIL_ADDRESS;

class Email {
    static parseEmail(message) {
        const regex = new RegExp('\\s*(?:' + REGEX + ')\\s*', 'g');
        const data = message.trim().split(regex);
        const result = {};
        data.shift();
        REGEX.split('|')
            .forEach((key, i) => result[key] = data[i]);
        return result;
    }

    static verifySender(address, callback) {
        if (address === EMAIL.toLowerCase()) {
            callback();
        } else {
            const err = new Error('Non approved email address');
            err.responseCode = 530;
            callback(err);
        }
    }
}

module.exports = Email;
