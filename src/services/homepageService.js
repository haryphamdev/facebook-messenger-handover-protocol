require("dotenv").config();
import request from "request";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PAGE_INBOX_ID = process.env.PAGE_INBOX_ID;

let setUpPersistentMenuService = () => {
    return new Promise(((resolve, reject) => {

        let uri = `https://graph.facebook.com/v7.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`;
        let request_body = {
            "get_started":{
                "payload":"GET_STARTED"
            },
            "persistent_menu": [
                {
                    "locale": "default",
                    "composer_input_disabled": false,
                    "call_to_actions": [
                        {
                            "type": "postback",
                            "title": "Talk to an agent",
                            "payload": "CARE_HELP"
                        },
                        {
                            "type": "postback",
                            "title": "Outfit suggestions",
                            "payload": "CURATION"
                        },
                        {
                            "type": "web_url",
                            "title": "Shop now",
                            "url": "https://www.originalcoastclothing.com/",
                            "webview_height_ratio": "full"
                        }
                    ]
                }
            ]
        };
        // Send the HTTP request to the Messenger Platform
        request({
            "uri": uri,
            "method": "POST",
            "json": request_body
        }, (err, res, body) => {
            console.log(body);
            if (!err) {
                resolve("done");
            } else {
               reject("Unable to send message:" + err);
            }
        });
    }));
};

let passThreadControl = (sender_psid) =>{
    return new Promise ((resolve, reject) => {
        let request_body = {
            "recipient": {
                "id": sender_psid
            },
            "target_app_id": PAGE_INBOX_ID,
            "metadata":"Pass this conversation to the page inbox"
        };

        // Send the HTTP request to the Messenger Platform
        request({
            "uri": `https://graph.facebook.com/v6.0/me/pass_thread_control?access_token=${PAGE_ACCESS_TOKEN}`,
            "method": "POST",
            "json": request_body
        }, (err, res, body) => {
            if (!err) {
                resolve("done")
            } else {
               reject("Unable to send message:" + err);
            }
        });
    });
};

let takeControlConversation = (sender_psid) => {
    return new Promise ((resolve, reject) => {
        let request_body = {
            "recipient": {
                "id": sender_psid
            },
            "metadata":"Pass this conversation to the user, turn on the bot"
        };

        // Send the HTTP request to the Messenger Platform
        request({
            "uri": `https://graph.facebook.com/v6.0/me/take_thread_control?access_token=${PAGE_ACCESS_TOKEN}`,
            "method": "POST",
            "json": request_body
        }, async (err, res, body) => {
            if (!err) {
                let response = {
                    "text": "The super bot came back !!!"
                };
                await sendMessage(response, sender_psid);
                resolve("done")
            } else {
                reject("Unable to send message:" + err);
            }
        });
    });
};

let sendMessage = (response, sender_psid) => {
    return new Promise ((resolve, reject) => {
        let request_body = {
            "recipient": {
                "id": sender_psid
            },
            "message": response
        };

        // Send the HTTP request to the Messenger Platform
        request({
            "uri": "https://graph.facebook.com/v6.0/me/messages",
            "qs": { "access_token": PAGE_ACCESS_TOKEN },
            "method": "POST",
            "json": request_body
        }, (err, res, body) => {
            if (!err) {
                resolve('message sent!')
            } else {
               reject("Unable to send message:" + err);
            }
        });
    });
};

module.exports = {
    setUpPersistentMenuService: setUpPersistentMenuService,
    passThreadControl: passThreadControl,
    takeControlConversation: takeControlConversation
};