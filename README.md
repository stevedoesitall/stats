# Sailthru Stats Aggregator

Tool for hitting the Sailthru /stats API endpoint, aggregating data from the last 30 days for blasts, triggers, or lists:

# Blast Stats

/blast API is used to retrive all sent blasts from the past 30 days. The /stats API is then called to retrive standard response data, such as opens and clicks, while also calculating open rate, click rate, etc.

# List Stats

Not yet finished. Will aggregate list for all primary lists where var "status" equals "active". May change this to time series for a specific list.

# Trigger Stats

/template API is used to find all templates labeled "active" from the past 30 days. If template is active, the /stats API is called to retrive standard response data, such as opens and clicks, while also calculating open rate, click rate, etc.
