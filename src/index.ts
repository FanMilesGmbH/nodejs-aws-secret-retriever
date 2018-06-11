import * as SecretsManager from 'aws-sdk/clients/secretsmanager';

function extractSecret(awsResponse: SecretsManager.GetSecretValueResponse):
  SecretsManager.SecretStringType | SecretsManager.SecretBinaryType {
  if (awsResponse.SecretString) {
    return awsResponse.SecretString as SecretsManager.SecretStringType;
  }

  return awsResponse.SecretBinary as SecretsManager.SecretBinaryType;
}

export interface SecretsRetrieverDependenciesType {
  awsSecretsManager: SecretsManager;
}

export interface SecretsRetrieverCacheValueType {
  [key: string]: SecretsManager.SecretStringType | SecretsManager.SecretBinaryType;
}

class SecretsRetriever {
  private dependencies: SecretsRetrieverDependenciesType;
  private readonly cachedValues: SecretsRetrieverCacheValueType;

  constructor(dependencies: SecretsRetrieverDependenciesType) {
    this.dependencies = dependencies;
    this.cachedValues = {};
  }

  /**
   * Retrieves a secret from aws secrets manager and caches it upon successful retrieval.
   * @param {String} secretId The id of the secret to retrieve
   * @return {Promise<SecretsManager.SecretStringType|SecretsManager.SecretBinaryType>}
   */
  async retrieveSecret(secretId: string): Promise<SecretsManager.SecretStringType | SecretsManager.SecretBinaryType> {
    const cachedValue = this.cachedValues[secretId];

    if (cachedValue) {
      return cachedValue;
    }

    const awsResponse = await this.dependencies.awsSecretsManager.getSecretValue({ SecretId: secretId }).promise();
    const value = extractSecret(awsResponse as SecretsManager.GetSecretValueResponse);

    this.cachedValues[secretId] = value;

    return value;
  }
}

export default SecretsRetriever;
