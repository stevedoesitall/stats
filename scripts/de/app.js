// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-west-2'});

// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});
const params = {Bucket: 'stevegiordanotest', Key: 'blast/4788_blast.20200325.json.gz'};

s3.getObject(params, function(err, data) {
  if (err) {
    console.log(err, err.stack);
  } else {
    console.log(data);
  } 
});