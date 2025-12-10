## AWS Amplify React+Vite 

// edit resource.ts
// Amplify's per-developer cloud sandbox. This feature provides a separate backend 
// environment for every developer on a team, ideal for local development and testing
npx ampx sandbox

//generate swift classes
npx ampx generate graphql-client-code --format modelgen --model-target swift

// I believe this runs local web projects (React)
npm run dev

// to clean sandbox resources and start over
npx ampx sandbox delete

## Overview

This is a foundational React application integrated with AWS Amplify, streamlined for scalability and performance. It is ideal for developers looking to jumpstart their project with pre-configured AWS services like Cognito, AppSync, and DynamoDB.

## Features

- **Authentication**: Setup with Amazon Cognito for secure user authentication.
- **API**: Ready-to-use GraphQL endpoint with AWS AppSync.
- **Database**: Real-time database powered by Amazon DynamoDB.

## Deploying to AWS

Automated git deployment set up, so commit and push to deploy.

For detailed instructions on deploying this application, refer to the [deployment section](https://docs.amplify.aws/react/start/quickstart/#deploy-a-fullstack-app-to-aws) of our documentation.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.