require('dotenv').config();

const VERIFICATION = process.env.VERIFICATION_TOKEN;

class Verification {
    static verification(req, res, next) {
        console.log("Verification: " + req.body.verification);
        if (req.body.verification === VERIFICATION) {
            next();
        }
        res.status(401).send();
    }
}

module.exports = {Verification};
