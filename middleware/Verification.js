require('dotenv').config();

const VERIFICATION = process.env.VERIFICATION_TOKEN;

class Verification {
    static verification(req, res, next) {
        if (req.body.verification === VERIFICATION) {
            next();
        }
        res.status(401).send();
    }
    static verifyMessage(req, res, next) {
        if (!req.body.dispatch) {
            res.status(400).send('A dispatch message can\'t be blank and is needed.');
            return;
        }
        next();
    }
}

module.exports = {Verification};
