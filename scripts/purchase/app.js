const path = require("path");
const dir = __dirname;
const stat = "content";

const creds = path.join(dir, "../creds.json");

const api_key = require(creds).api_key;
const api_secret = require(creds).api_secret;
const sailthru = require("sailthru-client").createSailthruClient(api_key, api_secret);

const stat = "purchase";
const job = "export_purchase_log";