import * as SecretsManager from 'aws-sdk/clients/secretsmanager';

export interface SecretsRetrieverDependenciesType {
  awsSecretsManager: SecretsManager;
}

export interface SecretsRetrieverCacheValueType {
  [key: string]: SecretsManager.SecretStringType | SecretsManager.SecretBinaryType;
}

declare class SecretsRetriever {
  private dependencies;
  private readonly cachedValues;

  constructor(dependencies: SecretsRetrieverDependenciesType);

  /**
   * Retrieves a secret from aws secrets manager and caches it upon successful retrieval.
   * @param {String} secretId The id of the secret to retrieve
   * @return {Promise<SecretsManager.SecretStringType|SecretsManager.SecretBinaryType>}
   */
  retrieveSecret(secretId: string): Promise<SecretsManager.SecretStringType | SecretsManager.SecretBinaryType>;
}

export default SecretsRetriever;
