const axios = require("axios");
const jsonwebtoken = require("jsonwebtoken");

require('dotenv').config();

const REGEX = process.env.EMAIL_SPLIT_REGEX;
const EMAILS = process.env.DISPATCH_EMAIL_ADDRESS.toLowerCase().split('|');
const API_TOKEN  = process.env.POST_API_TOKEN;

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
        const regex = new RegExp('\\s*(?:' + REGEX + ')\\s*', 'g');
        const data = message.trim().split(regex);
        const result = new Map();
        data.shift();
        REGEX.split('|')
            .forEach((key, i) => result[key] = data[i]);
        return result;
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
    static postToAPI(url,data) {
        if (!API_TOKEN) {
            console.log('An API token is necessary to POST to another api ')
        }
        axios({
            url,
            data,
            method:"POST",
            headers: {"Authorization":`BEARER ${jsonwebtoken.sign({timestamp: Date.now()},API_TOKEN)}`}
        }).then();
    }
}

module.exports = Email;
