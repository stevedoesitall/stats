const path = require("path");
const fs = require("fs");
const dir = __dirname;

const creds = path.join(dir, "../creds.json");

const api_key = require(creds).api_key;
const api_secret = require(creds).api_secret;
const sailthru = require("sailthru-client").createSailthruClient(api_key, api_secret);

const label = "active";
const stat = "send";
const active_templates = [];

const date_path = path.join(dir, "../modules/dates.js");
const generator_path = path.join(dir, "../modules/folder_gen.js");

const today = require(date_path).today;
const start_date = require(date_path).start_date;
const end_date = require(date_path).end_date;

const reports_folder = path.join(dir, "../../../../Reports/Send/");
const folder_month = require(date_path).folder_month;
const folder_year = require(date_path).folder_year;

const top_folder = `${reports_folder}${folder_year}`;
const sub_folder = `${reports_folder}${folder_year}/${folder_month}`;

const generator = require(generator_path).generator;

sailthru.apiGet("template", { }, 
function(err, response) {
    if (err) {
        console.log(err);
    }
    else {
        const all_templates = response.templates;
        all_templates.forEach(template => {
            const template_name = template.name;
            if (template.labels && template.labels.includes(label)) {
                sailthru.apiGet("stats", {
                    "stat": stat,
                    "template": template_name,
                    "start_date": start_date,
                    "end_date": end_date
                    }, 
                function(err, response) {
                    if (err || response.error) {
                        console.log(`No stats for ${template.name}.`);
                    }
                    else {
                        response.template = template.name;

                        if (!response.hardbounce) {
                            response.hardbounce = 0;
                            response.hardbounce_rate = 0;
                        }
                        else {
                            response.hardbounce_rate = ((response.count / response.hardbounce) * 100).toFixed(2);
                        }
    
                        if (!response.softbounce) {
                            response.softbounce = 0;
                            response.softbounce_rate = 0;
                        }
                        else {
                            response.softbounce_rate = ((response.count / response.softbounce) * 100).toFixed(2);
                        }
    
                        response.delivered = response.count - (response.hardbounce + response.softbounce);

                        if (!response.confirmed_opens) {
                            response.confirmed_opens = 0;
                            response.open_rate = 0
                        }
                        else {
                            response.open_rate = ((response.confirmed_opens / response.count) * 100).toFixed(2);
                        }

                        if (!response.click) {
                            response.click = 0;
                            response.cto_rate = 0;
                        }
                        else {
                            response.cto_rate = ((response.click / response.confirmed_opens) * 100).toFixed(2);
                        }

                        if (!response.pv) {
                            response.pv = 0;
                        }

                        if (!response.purchase) {
                            response.purchase = 0;
                            response.purchase_rate = 0;
                        }
                        else {
                            response.purchase_rate = ((response.purchase / response.delivered) * 100).toFixed(2);
                        }

                        if (!response.rev) {
                            response.rev = 0;
                        }

                        else {
                            response.rev = response.rev / 100;
                        }

                        if (!response.optout) {
                            response.optout = 0;
                            response.optout_rate = 0;
                        }
                        else {
                            response.optout_rate = ((response.optout / response.delivered) * 100).toFixed(2);
                        }
    
                        if (!response.spam) {
                            response.spam = 0;
                            response.spam_rate = 0;
                        }
                        else {
                            response.spam_rate = ((response.spam / response.delivered) * 100).toFixed(2);
                        }

                        active_templates.push(response);
                    }
                });
            }
        });
    }   
});

setTimeout(() => {
    const Json2csvParser = require("json2csv").Parser;
    const fields = ["template", "count", "delivered", "confirmed_opens", "open_rate", "click", "cto_rate", "pv", "purchase", "purchase_rate", "rev", "softbounce", "softbounce_rate", "optout", "optout_rate", "spam", "spam_rate"];
    const file_name = `${today} send stats.csv`;

    const json2csvParser = new Json2csvParser({ fields });
    const csv = json2csvParser.parse(active_templates);
        generator(top_folder, sub_folder, file_name, csv);
}, 5000);