require('dotenv').config();

const REGEXES = process.env.EMAIL_SPLIT_REGEX.split('||');
const EMAILS = process.env.DISPATCH_EMAIL_ADDRESS.toLowerCase().split('|');

class Email {
    /***
     * Parses the email and stores the extracted information
     * into a map of keywords to email information
     *
     * @param {string} message - The email message that will be parsed
     * @returns {Map.<string,string>} A map of the keyword to
     * information from the email message
     */
    static parseEmail(message) {
        for (const regexString of REGEXES) {
            const regex = new RegExp('\\s*(?:' + regexString + ')\\s*', 'g');
            const data = message.trim().split(regex);
            const result = new Map();
            data.shift();
            if (data.length === 0) continue;
            regexString.split('|')
                .forEach((key, i) => {
                    result[key] = data[i]
                });
            return result;
        }
    }

    /***
     * Verifies the sender address matches the one in the configuration.
     * Returns a 530 error if it is not.
     *
     * @param {string} address - Email address to check
     * @param {Function} callback - Function to respond back with
     */
    static verifySender(address, callback) {
        if (EMAILS.indexOf(address) > -1) {
            callback();
        } else {
            const err = new Error('Non approved email address');
            err.responseCode = 530;
            callback(err);
        }
    }
}

module.exports = Email;
