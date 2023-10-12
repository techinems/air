const express = require('express');
const app = express();
const request = require('request');
const slack = require('express-slack');
const bodyParser = require('body-parser');
const axios = require('axios');

require('dotenv').config();

//globals
const AIR_CHANNEL = process.env.AIR_CHANNEL;
const DISPATCH_CHANNEL = process.env.DISPATCH_CHANNEL;
const SLACK_SCOPE = process.env.SLACK_SCOPE;
const SLACK_TOKEN = process.env.SLACK_TOKEN;
const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID;
const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET;
const VERIFICATION_TOKEN = process.env.VERIFICATION_TOKEN;
const OOS_URL = process.env.OOS_URL;
const OOS_TOKEN = process.env.OOS_TOKEN;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/slack', slack({
    scope: SLACK_SCOPE,
    token: SLACK_TOKEN,
    store: 'data.json',
    client_id: SLACK_CLIENT_ID,
    client_secret: SLACK_CLIENT_SECRET
}));

const compareTime = (hr, min, direction) => {

    const now = new Date();
    const currHr = now.getHours();
    const currMin = now.getMinutes();

    if (direction == 'lt') {
        return (currHr < hr) || ((currHr == hr) && (currMin < min));
    } else if (direction == 'gt') {
        return (currHr > hr) || ((currHr == hr) && (currMin > min));
    }

};

const makeDate = () => {
    const now = new Date();
    return [
        now.getFullYear(),
        '-',
        now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1),
        '-',
        now.getDate() < 10 ? '0' + (now.getDate()) : (now.getDate()),
        ' at ',
        now.getHours() < 10 ? '0' + (now.getHours()) : (now.getHours()),
        ':',
        now.getMinutes() < 10 ? '0' + (now.getMinutes()) : (now.getMinutes()),
        ':',
        now.getSeconds() < 10 ? '0' + (now.getSeconds()) : (now.getSeconds())
    ].join('');
};

const areOos = async () => {
    const {data} = await axios.get(OOS_URL + OOS_TOKEN);
    return data == 1;
};

app.post('/tmd_slack_notification', (req, res) => {

    if (req.body.verification != VERIFICATION_TOKEN) res.status(401).send();

    const areOos = () => {
        const { data: oos } = axios.get(`${info.oos_url}?token=${info.oos_token}`);
        return !!oos;
    };

    let air_message = '';
    let dispatch_message = '';

    if ((compareTime(05, 55, 'gt') && compareTime(18, 05, 'lt')) || areOos()) {
        air_message = {
            unfurl_links: true,
            channel: AIR_CHANNEL,
            token: info.token,
            'attachments': [
                {
                    'text': 'RPI Ambulance dispatched on ' + makeDate(),
                    'fallback': req.body.dispatch,
                    'callback_id': 'responding',
                    'color': '#F35A00',
                    'attachment_type': 'default',
                    'fields': [
                        {
                            'title': req.body.dispatch,
                            'value': 'Are you responding?',
                            'short': true
                        }
                    ],
                    'actions': [
                        {
                            'name': 'status',
                            'text': 'Yes',
                            'style': 'danger',
                            'type': 'button',
                            'value': 'yes'
                        },
                        {
                            'name': 'status',
                            'text': 'No',
                            'type': 'button',
                            'value': 'no'
                        }
                    ]
                }
            ]
        };
        dispatch_message =  {
            unfurl_links: false,
            channel: DISPATCH_CHANNEL,
            token: info.token,
            'text': 'RPI Ambulance dispatched on ' + makeDate(),
            'fallback': req.body.dispatch,
            'attachments': [
                {
                    'title': req.body.dispatch,
                    'short': true
                }
            ]
        };
    } else {
        air_message = {
            unfurl_links: true,
            channel: AIR_CHANNEL,
            token: info.token,
            'attachments': [
                {
                    'text': 'RPI Ambulance dispatched on ' + makeDate(),
                    'fallback': req.body.dispatch,
                    'callback_id': 'responding',
                    'color': '#F35A00',
                    'attachment_type': 'default',
                    'fields': [
                        {
                            'title': req.body.dispatch,
                            'value': 'Night crew call. No response is needed.',
                            'short': true
                        }
                    ]
                }
            ]
        };
        dispatch_message =  {
            unfurl_links: false,
            channel: DISPATCH_CHANNEL,
            token: info.token,
            'text': 'RPI Ambulance dispatched on ' + makeDate(),
            'fallback': req.body.dispatch,
            'attachments': [
                {
                    'text': 'RPI Ambulance dispatched on ' + makeDate(),
                    'fallback': req.body.dispatch,
                    'callback_id': 'responding',
                    'color': '#F35A00',
                    'attachment_type': 'default',
                    'fields': [
                        {
                            'title': req.body.dispatch,
                            'value': 'Night crew call. No response is needed.',
                            'short': true
                        }
                    ]
                }
            ]
        };
    }
    slack.send('chat.postMessage', air_message);
    slack.send('chat.postMessage', dispatch_message);
    res.status(200).send(req.body.dispatch);
    
});

app.post('/tmd_slack_notification_long', (req, res) => {

    if (req.body.verification == info.verification_email) {

        let air_message = {
            unfurl_links: true,
            channel: AIR_CHANNEL,
            token: info.token,
            'attachments': [
                {
                    'text': 'Rensslaer County longtone on ' + makeDate(),
                    'fallback': req.body.dispatch,
                    'callback_id': 'responding',
                    'color': '#F35A00',
                    'attachment_type': 'default',
                    'fields': [
                        {
                            'title': req.body.dispatch,
                            'value': '',
                            'short': true
                        }
                    ]
                }
            ]
        };
        let dispatch_message = {
            unfurl_links: true,
            channel: DISPATCH_CHANNEL,
            token: info.token,
            'attachments': [
                {
                    'text': 'Rensslaer County longtone on ' + makeDate(),
                    'fallback': req.body.dispatch,
                    'callback_id': 'responding',
                    'color': '#F35A00',
                    'attachment_type': 'default',
                    'fields': [
                        {
                            'title': req.body.dispatch,
                            'value': '',
                            'short': true
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

app.post('/slack_response', (req, res) => {
    var strReq = req.body.payload.toString();
    var strReq = JSON.parse(strReq);

    let maxElapsedTime = 12; //minutes to allow responses
    maxElapsedTime *= 60 * 1000;

    let messageTime = new Date(strReq.message_ts * 1000);
    let actionTime = new Date(strReq.action_ts * 1000);

    userID = strReq.user.id;

    if ((actionTime - messageTime) < maxElapsedTime) {

        request.post({url:'https://slack.com/api/users.info', form: {token:info.token,user:userID}}, (error, response, body)=> {
            var userinfo = response.body.toString();
            var userinfo = JSON.parse(userinfo);

            abbrname = userinfo.user.profile.first_name.charAt(0).toUpperCase() + '. ' + userinfo.user.profile.last_name;
            let response_message = '';
            if (strReq.actions[0].value == 'yes') {
                console.log(abbrname + ' replied yes');
                response_message = {
                    unfurl_links: true,
                    channel: AIR_CHANNEL,
                    token: info.token,
                    'mrkdwn': true,
                    'attachments': [
                        {
                            'fallback': abbrname + ' is RESPONDING',
                            'text': '*' + abbrname + '*' + ' is *RESPONDING*',
                            'color': '#7CD197',
                            'mrkdwn_in': ['text']
                        }
                    ]
                };
            } else {
                console.log(abbrname + ' replied no');
                response_message = {
                    unfurl_links: true,
                    channel: AIR_CHANNEL,
                    token: info.token,
                    'mrkdwn': true,
                    'attachments': [
                        {
                            'fallback': abbrname + ' is not responding',
                            'text': abbrname + ' is NOT RESPONDING'
                        }
                    ]
                };
            }
            res.status(200).send();
            slack.send('chat.postMessage', response_message);
        });

    } else {
        let response_message = {
            channel: AIR_CHANNEL,
            token: info.token,
            user: userID,
            as_user: true,
            text: 'Sorry, your response was logged too long after the dispatch went out.'
        };
        res.status(200).send();
        slack.send('chat.postEphemeral', response_message);
    }

});

app.listen(5939, () => {
    console.log('Server up');
});
