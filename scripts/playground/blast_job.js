const path = require("path");
const fs = require("fs");
const https = require("https");

const dir = __dirname;

const reports_folder = path.join(dir, "../../../../Reports/Blast/");
const scripts_folder = path.join(dir, "../");

const creds = path.join(dir, "../creds.json");

const api_key = require(creds).api_key;
const api_secret = require(creds).api_secret;
const sailthru = require("sailthru-client").createSailthruClient(api_key, api_secret);

const parse = require("csv-parse");

const job = "blast_query";
const status = "sent";
const limit = 0;

const date_path = path.join(dir, "../dates.js");
const today = require(date_path).today;
const start_date = require(date_path).start_date;
const end_date = require(date_path).end_date;

const downloader = (job_id) => {
    sailthru.apiGet("job", {
        "job_id": job_id
        }, 
    function(err, response) {
        if (err || response.error) {
            console.log(err);
        }
        else if (response.status == "pending") {
            console.log("Retrying...");
            setTimeout(() => {
                downloader(job_id);
            }, 10000);
        }
        else if (response.status == "completed") {
            const export_url = response.export_url;
            const filename = response.filename;
            const writeable_file = fs.createWriteStream(filename); //Makes CSV writeable
            https.get(export_url, (response) => {
                //Need to update to retrieve blast name and user email addresses
                console.log(filename, "Downloading file...");
                response.pipe(writeable_file);
                fs.rename(scripts_folder + filename, reports_folder + filename, function(err) { 
                    if (err) {
                        console.log(err);
                    }
                });
            }).on("error", (err) => {
                console.error(err);
            });
        }
    });
};

sailthru.apiGet("blast", {
    status: status,
    limit: limit,
    start_date: "2018-10-22",
    end_date: "2018-11-26"
 }, 
function(err, response) {
    if (err) {
        console.log(err);
    }
    else {
        const all_blasts = response.blasts;
        all_blasts.forEach(blast => {
            const blast_id = blast.blast_id;
            sailthru.apiPost("job", {
                "job": job,
                "blast_id": blast_id
                }, 
            function(err, response) {
                if (err || response.error) {
                    console.log(`No stats for ${blast_id}.`);
                }
                else {
                    const job_id = response.job_id;
                    setTimeout(() => {
                        downloader(job_id);
                    }, 10000)
                }
            });
        });
    }   
});