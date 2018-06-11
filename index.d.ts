import * as SecretsManager from 'aws-sdk/clients/secretsmanager';

export as namespace SecretsRetriever;

declare interface dependencies {
  awsSecretsManager: SecretsManager
}

class SecretsRetriever {
  constructor(dependencies: dependencies);

  /**
   * Retrieves a secret from aws secrets manager and caches it upon successful retrieval.
   */
  retrieveSecret(secretId: string): Promise<string>;
}

export = SecretsRetriever
