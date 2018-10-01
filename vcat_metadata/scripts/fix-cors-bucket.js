require('dotenv').config()

const AWS = require('aws-sdk');
const S3 = require('aws-sdk/clients/s3');

const configurre = {
  credentials: {
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
  },
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
}
console.log(configurre)
myConfig = new AWS.Config();
myConfig.update(configurre);

const s3 = new S3(myConfig)

  const thisConfig = {
    AllowedMethods: ['GET', 'POST', 'PUT', 'HEAD'],
    AllowedOrigins: ['*'],
    ExposeHeaders: [],
    MaxAgeSeconds: 3000,
  };

  const corsRules = new Array(thisConfig);
  const corsParams = {
    Bucket: process.env.S3_BUCKET,
    CORSConfiguration: { CORSRules: corsRules },
  };
  // set the new CORS configuration on the selected bucket
  s3.putBucketCors(corsParams, (err, data) => {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('Success', data);
    }
  });

