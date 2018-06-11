const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');

const SecretsRetriever = require('../dist');

chai.use(sinonChai);
const { expect } = chai;

const SECRET_ID = 'some-secret-id';
const EXPECTED_SECRET = 'super-secret';
const getSecretValuePromiseStub = sinon.stub();
const getSecretValue = sinon.stub();
getSecretValue.withArgs({ SecretId: SECRET_ID }).returns({
  promise: getSecretValuePromiseStub,
});

/**
 * Returns a mocked secretsmanager response for a secret of a String type.
 * More: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html#getSecretValue-property
 * @function getSecretStringResponse
 * @return {{ARN: string, Name: string, VersionId: string, SecretString: string, VersionStages: string[], CreatedDate: string}}
 */
const getSecretStringResponse = () => ({
  ARN: 'arn:aws:secretsmanager:eu-central-1:829820348459:secret:test/MilesAndMore/authToken-gEHiq5',
  Name: SECRET_ID,
  VersionId: '814ee594-f6fe-4d04-8272-56db35c6b3c2',
  SecretString: EXPECTED_SECRET,
  VersionStages: ['AWSCURRENT'],
  CreatedDate: '1994-05-16T15:00:08.672Z',
});

/**
 * Returns a mocked secretsmanager response for a secret of a Binary type.
 * More: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html#getSecretValue-property
 * @function getSecretBinaryResponse
 * @return {{ARN: string, Name: string, VersionId: string, SecretBinary: string, VersionStages: string[], CreatedDate: string}}
 */
const getSecretBinaryResponse = () => ({
  ARN: 'arn:aws:secretsmanager:eu-central-1:829820348459:secret:test/MilesAndMore/authToken-gEHiq5',
  Name: SECRET_ID,
  VersionId: '814ee594-f6fe-4d04-8272-56db35c6b3c2',
  SecretBinary: EXPECTED_SECRET,
  VersionStages: ['AWSCURRENT'],
  CreatedDate: '1994-05-16T15:00:08.672Z',
});

const dependencies = {
  awsSecretsManager: {
    getSecretValue,
  },
};

describe('SecretsRetriever', () => {
  let secretsRetriever;
  let result;

  beforeEach(() => {
    getSecretValue.resetHistory();
    getSecretValue.throws(new Error('getSecretValue fall through'));

    getSecretValuePromiseStub.reset();

    secretsRetriever = new SecretsRetriever(dependencies);
  });

  describe('retrieveSecret()', () => {
    describe('when aws retrieving fails on first call', () => {
      const expectedError = new Error('Fails');

      beforeEach(async () => {
        getSecretValuePromiseStub.rejects(expectedError);

        try {
          await secretsRetriever.retrieveSecret(SECRET_ID);
        } catch (e) {
          result = e;
        }
      });

      it('should return expected auth token', () => {
        expect(result).to.equal(expectedError);
      });

      describe('and second call is successful', () => {
        beforeEach(async () => {
          getSecretValuePromiseStub.resolves(getSecretStringResponse());

          result = await secretsRetriever.retrieveSecret(SECRET_ID);
        });

        it('should return expected auth token', () => {
          expect(result).to.equal(EXPECTED_SECRET);
        });
      });
    });

    [
      {
        description: 'when "SecretString" is returned',
        awsResponse: getSecretStringResponse,
      },
      {
        description: 'when "SecretBinary" is returned',
        awsResponse: getSecretBinaryResponse,
      },
    ].forEach(({ description, awsResponse }) => {
      describe(description, () => {
        beforeEach(async () => {
          getSecretValuePromiseStub.resolves(awsResponse());

          result = await secretsRetriever.retrieveSecret(SECRET_ID);
        });

        it('should return expected auth token', () => {
          expect(result).to.equal(EXPECTED_SECRET);
        });

        it('should cache the previous response', async () => {
          getSecretValuePromiseStub.rejects(new Error('If not cached I will fail 😼'));
          result = await secretsRetriever.retrieveSecret(SECRET_ID);

          expect(result).to.equal(EXPECTED_SECRET);
        });
      });
    });
  });
});
