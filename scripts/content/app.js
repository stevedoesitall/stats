const path = require("path");
const dir = __dirname;

const creds = path.join(dir, "../creds.json");

const api_key = require(creds).api_key;
const api_secret = require(creds).api_secret;
const sailthru = require("sailthru-client").createSailthruClient(api_key, api_secret);

const items = 20000;

sailthru.apiGet("content", {
    items: items
}, function(err, response) {
    if (err) {
        console.log(err);
    }
    else { 
        const all_content = response.content;
        all_content.forEach(content => {
            console.log(content);
        });
    }
});