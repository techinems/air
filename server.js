var express = require('express');
var app = express();
var info = require('./var.js');
var request = require('request');
var slack = require('express-slack');
const bodyParser = require('body-parser');


var air_channel = 'G6XGMATUP'; //#responding
var dispatch_channel = 'GAG3D0EBF'; //#dispatch

// var air_channel = 'C71B0PRDW'; //#development_scratch
// var rpialert_channel = 'C71B0PRDW'; //#development_scratch


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/slack', slack({
    scope: info.scope,
    token: info.token,
    store: 'data.json',
    client_id: info.client_id,
    client_secret: info.client_secret
}));

function compareTime(hr, min, direction) {

    var now = new Date();
    nowhr = now.getHours();
    nowmin = now.getMinutes();

    if (direction == "lt") {
        return (nowhr < hr) || ((nowhr == hr) && (nowmin < min));
    } else if (direction == "gt") {
        return (nowhr > hr) || ((nowhr == hr) && (nowmin > min));
    }

}

function makeDate() {
    var now = new Date();
    return [
        now.getFullYear(),
        '-',
        now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1),
        '-',
        now.getDate() < 10 ? "0" + (now.getDate()) : (now.getDate()),
        ' at ',
        now.getHours() < 10 ? "0" + (now.getHours()) : (now.getHours()),
        ':',
        now.getMinutes() < 10 ? "0" + (now.getMinutes()) : (now.getMinutes()),
        ':',
        now.getSeconds() < 10 ? "0" + (now.getSeconds()) : (now.getSeconds())
    ].join('');
}

app.post('/tmd_slack_notification', function(req, res) {

    if (req.body.verification == info.verification_email) {

        var air_message = "";
        var dispatch_message = "";

        if (compareTime(05, 55, "gt") && compareTime(18, 05, "lt")) {
            air_message = {
                unfurl_links: true,
                channel: air_channel,
                token: info.token,
                "attachments": [
                    {
                        "text": "RPI Ambulance dispatched on " + makeDate(),
                        "fallback": req.body.dispatch,
                        "callback_id": "responding",
                        "color": "#F35A00",
                        "attachment_type": "default",
                        "fields": [
                            {
                                "title": req.body.dispatch,
                                "value": "Are you responding?",
                                "short": true
                            }
                        ],
                        "actions": [
                            {
                                "name": "status",
                                "text": "Yes",
                                "style": "danger",
                                "type": "button",
                                "value": "yes"
                            },
                            {
                                "name": "status",
                                "text": "No",
                                "type": "button",
                                "value": "no"
                            }
                        ]
                    }
                ]
            };
            dispatch_message =  {
                unfurl_links: false,
                channel: dispatch_channel,
                token: info.token,
                "text": "RPI Ambulance dispatched on " + makeDate(),
                "fallback": req.body.dispatch,
                "attachments": [
                    {
                        "title": req.body.dispatch,
                        "short": true
                    }
                ]
            };
        } else {
            air_message = {
                unfurl_links: true,
                channel: air_channel,
                token: info.token,
                "attachments": [
                    {
                        "text": "RPI Ambulance dispatched on " + makeDate(),
                        "fallback": req.body.dispatch,
                        "callback_id": "responding",
                        "color": "#F35A00",
                        "attachment_type": "default",
                        "fields": [
                            {
                                "title": req.body.dispatch,
                                "value": "Night crew call. No response is needed.",
                                "short": true
                            }
                        ]
                    }
                ]
            };
            dispatch_message =  {
                unfurl_links: false,
                channel: dispatch_channel,
                token: info.token,
                "text": "RPI Ambulance dispatched on " + makeDate(),
                "fallback": req.body.dispatch,
                "attachments": [
                    {
                        "text": "RPI Ambulance dispatched on " + makeDate(),
                        "fallback": req.body.dispatch,
                        "callback_id": "responding",
                        "color": "#F35A00",
                        "attachment_type": "default",
                        "fields": [
                            {
                                "title": req.body.dispatch,
                                "value": "Night crew call. No response is needed.",
                                "short": true
                            }
                        ]
                    }
                ]
            };
        }
        slack.send('chat.postMessage', air_message);
        slack.send('chat.postMessage', dispatch_message);
        res.status(200).send(req.body.dispatch);
    } else {
        res.status(401).send();
    }
});

app.post('/tmd_slack_notification_long', function(req, res) {

    if (req.body.verification == info.verification_email) {

        var air_message = {
            unfurl_links: true,
            channel: air_channel,
            token: info.token,
            "attachments": [
                {
                    "text": "Rensslaer County longtone on " + makeDate(),
                    "fallback": req.body.dispatch,
                    "callback_id": "responding",
                    "color": "#F35A00",
                    "attachment_type": "default",
                    "fields": [
                        {
                            "title": req.body.dispatch,
                            "value": "",
                            "short": true
                        }
                    ]
                }
            ]
        };
        var dispatch_message = {
            unfurl_links: true,
            channel: dispatch_channel,
            token: info.token,
            "attachments": [
                {
                    "text": "Rensslaer County longtone on " + makeDate(),
                    "fallback": req.body.dispatch,
                    "callback_id": "responding",
                    "color": "#F35A00",
                    "attachment_type": "default",
                    "fields": [
                        {
                            "title": req.body.dispatch,
                            "value": "",
                            "short": true
                        }
                    ]
                }
            ]
        };
        slack.send('chat.postMessage', air_message);
        slack.send('chat.postMessage', dispatch_message);
        res.status(200).send(req.body.dispatch);
    } else {
        res.status(401).send();
    }
});

app.post("/slack_response", function(req, res) {
    var strReq = req.body.payload.toString();
    var strReq = JSON.parse(strReq);

    var maxElapsedTime = 12; //minutes to allow responses
    maxElapsedTime *= 60 * 1000;

    var messageTime = new Date(strReq.message_ts * 1000);
    var actionTime = new Date(strReq.action_ts * 1000);

    userID = strReq.user.id;

    if ((actionTime - messageTime) < maxElapsedTime) {

        request.post({url:'https://slack.com/api/users.info', form: {token:info.token,user:userID}}, function(error, response, body){
            var userinfo = response.body.toString();
            var userinfo = JSON.parse(userinfo);

            abbrname = userinfo.user.profile.first_name.charAt(0).toUpperCase() + ". " + userinfo.user.profile.last_name;
            var response_message = "";
            if (strReq.actions[0].value == "yes") {
                console.log(abbrname + " replied yes");
                response_message = {
                    unfurl_links: true,
                    channel: air_channel,
                    token: info.token,
                    "mrkdwn": true,
                    "attachments": [
                        {
                            "fallback": abbrname + " is RESPONDING",
                            "text": "*" + abbrname + "*" + " is *RESPONDING*",
                            "color": "#7CD197",
                            "mrkdwn_in": ["text"]
                        }
                    ]
                };
            } else {
                console.log(abbrname + " replied no");
                response_message = {
                    unfurl_links: true,
                    channel: air_channel,
                    token: info.token,
                    "mrkdwn": true,
                    "attachments": [
                        {
                            "fallback": abbrname + " is not responding",
                            "text": abbrname + " is NOT RESPONDING"
                        }
                    ]
                };
            }
            res.status(200).send();
            slack.send('chat.postMessage', response_message);
        });

    } else {
        var response_message = {
            channel: air_channel,
            token: info.token,
            user: userID,
            as_user: true,
            text: "Sorry, your response was logged too long after the dispatch went out."
        };
        res.status(200).send();
        slack.send('chat.postEphemeral', response_message);
    }

});

app.listen(5939, function () {
    console.log('Server up');
});
