# Sailthru Stats Aggregator

Tool for hitting the Sailthru /stats API endpoint, aggregating data from the last 30 days for blasts, triggers, or lists. Example of file output in the "file_examples" folder.

# Blast Stats (Summary)

Tool for retrieving both aggregated stats via /blast API is used to retrieve all sent blasts from the past 30 days. The /stats API is then called to retrieve standard response data, such as opens and clicks, while also calculating open rate, click rate, etc.

# Blast Stats (Detail)

Tool for retrieving campaign detail reports for all blasts in the past day, using the /blast API to retrieve the blast IDs and the /job API to run the job. The CSV is then parsed for the SID, making a user GET call to retrieve and append the user's raw email address.

# List Stats

/list API finds all primary lists, returning the vars associated with the list. If "status = active", loop through an array of dates (the last 30 days), returning the engagement data for that day from the /stats endpoint. The data is then aggregated and converted to a CSV, creating one CSV per list.

# Trigger Stats

/template API is used to find all templates labeled "active" from the past 30 days. If template is active, the /stats API is called to retrieve standard response data, such as opens and clicks, while also calculating open rate, click rate, etc.

# Modules

dates.js used to generate ISO-friendly date stamps in YYYY-MM-DD format and for the months and years for the directory names and for the start and end dates for retrieving stats.

folder_gen.js pipes the file information in, checks if the top-level directory (TLD) exists (i.e. the year directory). If not, it creates that directory plus the subdirectory (SD) (i.e. the current month). If the TLD does exist but the SD doesn't, the SD is created. Otherwise, no new directories are created. Finally, the generated files are placed in the appropriate directory based on the year and month (note that it's based on the year/month the script was run, not the year/month the data is from).

# Stack

NodeJS

# Packages

sailthru-client to make API calls to Sailthru for blast, send, and list data

json2csv for converting response data to CSV

csv-parse to isolate user ID field in the CSV for retrieving the raw email

node-cron for automated scheduling