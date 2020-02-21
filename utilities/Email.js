require('dotenv').config();

const REGEX = process.env.EMAIL_SPLIT_REGEX;
const EMAIL = process.env.DISPATCH_EMAIL_ADDRESS;

class Email {
    /***
     * Parses the email and stores the extracted information into a map of keywords to email information
     *
     * @param {string} message - The email message that will be parsed
     * @returns {Map.<string,string>} A map of the keyword to information from the email message
     */
    static parseEmail(message) {
        const regex = new RegExp('\\s*(?:' + REGEX + ')\\s*', 'g');
        const data = message.trim().split(regex);
        const result = new Map();
        data.shift();
        REGEX.split('|')
            .forEach((key, i) => result[key] = data[i]);
        return result;
    }

    /***
     * Verifies the sender address matches the one in the configuration. Returns a 530 error if it is not.
     *
     * @param {string} address - Email address to check
     * @param {Function} callback - Function to respond back with
     */
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
