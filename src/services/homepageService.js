require("dotenv").config();
import request from "request";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

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

module.exports = {
    setUpPersistentMenuService: setUpPersistentMenuService
};