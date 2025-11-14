import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import * as iam from 'aws-cdk-lib/aws-iam';

const backend = defineBackend({
  auth,
  data,
});

// Create a policy statement for Bedrock access
const bedrockPolicyStatement = new PolicyStatement({
  effect: Effect.ALLOW,
  actions: [
    'bedrock:InvokeModel',
    'bedrock:InvokeModelWithResponseStream',
  ],
  resources: ['*'],
});

// Find all IAM roles in the data construct and add the policy
backend.data.node.findAll().forEach((construct) => {
  if (construct instanceof iam.Role) {
    construct.addToPrincipalPolicy(bedrockPolicyStatement);
    console.log(`Added Bedrock policy to role: ${construct.node.path}`);
  }
});