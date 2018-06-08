function extractSecret(awsResponse) {
  if (awsResponse.SecretString) {
    return awsResponse.SecretString;
  }

  return awsResponse.SecretBinary;
}

class SecretsRetriever {
  constructor(dependencies) {
    this.dependencies = dependencies;
    this.cachedValues = {};
  }

  /**
   * Retrieves a secret from aws secrets manager and caches it upon successful retrieval.
   * @param {String} secretId
   * @return Promise<T>
   */
  async retrieveSecret(secretId) {
    const cachedValue = this.cachedValues[secretId];

    if (cachedValue) {
      return cachedValue;
    }

    const awsResponse = await this.dependencies.awsSecretsManager.getSecretValue({ SecretId: secretId }).promise();
    const value = extractSecret(awsResponse);

    this.cachedValues[secretId] = value;

    return value;
  }
}

export default SecretsRetriever;
