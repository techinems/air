# Am I Responding
    
AIR provides IAmResponding-type functionality for free and within a Slack team. It utilizes Slack's bot users API to post an interactive message when a call is dispatched. 

If your agency receives email dispatches, the email information can be attached to the Slack message.

There are two channels that AIR will post in. The first channel is where a dispatch message will be posted and people can click the buttons to respond or not. The second channel will only post the dispatch message, and is optional.
## Configuration

Base setup for AIR is easy and straightforward, and is similar to other self-hosted Slack integrations.
### Basic Setup

#### Assumptions

1. A domain or subdomain is pointing to AIR and the correct port. Unfortunately, since every user's configuration is slightly different, we are unable to provide a complete set of instructions to do this. However, a quick search should be able to bring up a guide if needed for your agency's specific setup.
2. A way to detect a dispatch and send out a GET request to AIR. Again, every agency has their own setup so we are unable to provide instructions on how to do this. Here are RPI Ambulance, we use a combination of [Two Tone Detect](https://www.twotonedetect.net/) and [Slack Tones](https://github.com/rpiambulance/slack-tones).


#### Slack

1. Head over to [Slack's app portal](https://api.slack.com/apps), and create a new app.
1. Click on the green "Create New App" button.
1. Name your Slack app, select your agency's workspace, and select "Create App".
1. On the left hand side under the **Features** category, select "Interactive Components".
1. Turn Interactivity On.
1. In the **Request URL** section, input the domain/subdomain followed by `/slack/actions` pointing to AIR. Ex: `https://air.example.com/slack/actions`
1. Select the green "Save Changes" button in the lower right hand corner.
1. Under the **Features** category, select "OAuth & Permissions".
1. Scroll down to "Scopes" and add the follow scopes under Bot Token Scopes:
    * channels:history
    * channels:read
    * chat:write
    * links:write
    * users:read
1. Now scroll back up to "OAuth Tokens & Redirect URLs" and click the green "Install App to Workspace" button.
1. On the following screen, click the green "Allow" button.
1. Please take note of the token under "Bot User OAuth Access Token". We will be adding this to the .env file in a following section.
1. On the left hand side under the **Settings** category, select "Basic Information".
1. Scroll down "App Credentials".
1. Under "Signing Secret", click "Show" and copy down the Signing Secret. We will be adding this to the .env file as well.
1. Hurray, you have completed this part of the section.


#### Dispatch Detection Application

Setup the GET request to use the following structure: 

`{ "verification":"<VERIFICATION TOKEN">, "dispatch":"<MESSAGE>"}`

VERIFICATION TOKEN - This will be the token used to verify the dispatch message is coming from the dispatch detection application. This will be the same as the `VERIFICATION_TOKEN` stored in .env file.
MESSAGE - This will be the message that will be posted to both the AIR and DISPATCH channels.

#### AIR .env File

This is the main configuration file for AIR. We have split up the file into different sections for easy setup. Everything in this section will be in the `#Basic Setup` section.

##### Configuation

NODE_PORT: The port that AIR will run on. This should be the same as the port the domain/subdomain is pointing to.

SLACK_BOT_TOKEN: The Slack "Bot User OAuth Access Token" that we took note of earlier.

SLACK_SIGNING_SECRET: The Slack "Signing Secret" that we took note of earlier.

AIR_CHANNEL: The channel id of the Slack where where you will want people to respond if they are responding or not. You can find out where to get the channel id [here](https://www.wikihow.com/Find-a-Channel-ID-on-Slack-on-PC-or-Mac).

DISPATCH_CHANNEL: The channel id where only the dispatch message will be posted.

VERIFICATION_TOKEN: The token used to verify the GET request is from the appropriate application. This should be the same as the `Verification Token` used by the Dispatch Detection Application.

MAX_ELAPSED_TIME: The maximum elapse time to click the responding buttons in minutes.

NAME_FORMAT: The option to select what name format used to display names when responding. Options: short, full, mention

BEGIN_NORMAL_MESSAGE: The first statement of a normal dispatch/responding message. A time will posted at the end of the statement. 

Ex: `RPI Ambulance dispatched on` will produce `RPI Ambulance dispatched on 2020-01-26 at 16:45:01`

BEGIN_LONGTONE_MESSAGE:  The first statement of a longtone dispatch/responding message. A time will posted at the end of the statement.

Ex: `Renselaer County longtone on` will produce `Renselaer County longtone on 2020-01-26 at 16:45:01`

TZ: The timezone where the agency is. Ex: America/New York

**Congrats!** Once completed, AIR should be good to go. Run the `npm install` and then `npm start` command to start the program. 

### Optional Features

These features are completely optional and will be dependent on how your agency is run. All variables can be found in the .env file under `#Optional Features`.

#### Night Crew

If there is a dedicated crew for night shifts, this feature will turn off the responding buttons and state that the night crew is handling the call.

##### Configuration

Under `#Night Crew`:

NIGHT_CREW_START: The start time of the night crew. This will be in military time. Ex: 18:00
NIGHT_CREW_END: The end time of the night crew. This will be in military time. Ex: 6:00

#### Email

If the agency receives email dispatches, this feature will update the initial messages with the information from the email in any order.

##### Assumption

Setup of records to point incoming email messages to of a domain to point port 25 of AIR.

##### Configuration

Under `#Email`:

DISPATCH_EMAIL_ADDRESS: The email address of the dispatcher. This is to verify that the email is a dispatch message.

EMAIL_SPLIT_REGEX: A regular expression to split apart email with. [Here](https://regex101.com/) is a useful tool to test the regular expression.

Ex: `INCIDENT|CALL TYPE|ADDRESS|LOCATION|CROSS STREETS|LATITUDE|LONGITUDE`

AIR_MESSAGE_ORDER: The order you want the message for the responding channel to be in. These should be split apart by `|` and have the same values as the `EMAIL_SPLIT_REGEX`. 

Ex: `CALL TYPE|LOCATION|ADDRESS|CROSS STREETS|LATITUDE|LONGITUDE|INCIDENT`

DISPATCH_MESSAGE_ORDER: The order you want the message for the dispatch channel to be in. These should be split apart by `|` and have the same values as the `EMAIL_SPLIT_REGEX`. 

Ex: `CALL TYPE|LOCATION|ADDRESS|CROSS STREETS`

