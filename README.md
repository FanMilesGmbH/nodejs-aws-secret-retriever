# @fanmiles/nodejs-aws-secret-retriever
Used for retrieving a secret from AWS Secrets Manager.
After successful retrieve the manager caches the secret
in memory for faster access.

## Usage

```javascript
const AWS = require('aws-sdk');
const SecretsRetriever = require('@fanmiles/nodejs-aws-secret-retriever');

const awsSecretsManager = new AWS.SecretsManager({
  apiVersion: '2017-10-17',
  region: 'eu-central-1',
});

const secretsRetriever = new SecretsRetriever({ awsSecretsManager });

secretsRetriever.retrieveSecret('your/secret/id')
  .then((secret) => {
    console.log(secret);
  })
  .catch((error) => {
    console.error(error);
  });
```
