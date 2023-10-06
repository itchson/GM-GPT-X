# GM-GPT-X Tutorial: Building an Automated GM X(Twitter) Bot with AWS Lambda and OpenAI GPT-4

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
    - [Node.js Packages](#nodejs-packages)
    - [Environment Variables](#environment-variables)
4. [Building the Lambda Function](#building-the-lambda-function)
    - [Importing Modules](#importing-modules)
    - [Validating Environment Variables](#validating-environment-variables)
    - [Utility Functions](#utility-functions)
    - [Initialization](#initialization)
    - [Main Function](#main-function)
5. [AWS Deployment](#aws-deployment)
    - [Uploading to AWS Lambda](#uploading-to-aws-lambda)
    - [Setting Up CloudWatch](#setting-up-cloudwatch)
6. [Conclusion](#conclusion)
7. [Further Reading](#further-reading)

## Introduction

This tutorial guides you through setting up a X(Twitter) bot named GM-GPT-X, which uses AWS Lambda, OpenAI's GPT-4, and the Twitter API to automatically post 'Good Morning' tweets that are SEO-optimized, inspiring, and witty.

## Prerequisites

Ensure you have:

- Node.js and npm installed
- An AWS account
- OpenAI API key
- Twitter Developer Account and API keys

## Environment Setup

### Node.js Packages

First, install the necessary Node.js packages:

```bash
npm install twitter-api-v2 openai
```

### Environment Variables

Configure your AWS Lambda function with these required environment variables:

- OPENAI_API_KEY
- TWITTER_CONSUMER_KEY
- TWITTER_CONSUMER_SECRET
- TWITTER_ACCESS_TOKEN_KEY
- TWITTER_ACCESS_TOKEN_SECRET

## Building the Lambda Function

### Importing Modules

Start by importing the required Node.js modules:

```javascript
const { TwitterApi } = require('twitter-api-v2');
const OpenAI = require('openai');
```

### Validating Environment Variables

Ensure all environment variables are set:

```javascript
if (!process.env.OPENAI_API_KEY || !process.env.TWITTER_CONSUMER_KEY || !process.env.TWITTER_CONSUMER_SECRET || !process.env.TWITTER_ACCESS_TOKEN_KEY || !process.env.TWITTER_ACCESS_TOKEN_SECRET) {
  throw new Error('Essential environment variables are missing. Please check your configuration.');
}
```

### Utility Functions

Create a utility function to remove extraneous quotes:

```javascript
function removeQuotes(str) {
  return str.startsWith('"') && str.endsWith('"') ? str.slice(1, -1) : str;
}
```

### Initialization

Initialize the OpenAI and Twitter API clients:

```javascript
const openai = new OpenAI({ api_key: process.env.OPENAI_API_KEY });
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY,
  appSecret: process.env.TWITTER_CONSUMER_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
```

### Main Function

This is the main AWS Lambda function:

```javascript
exports.handler = async (event) => {
  try {
    // Generate tweet text using OpenAI's GPT-4 model
    const gpt4Response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { "role": "system", "content": "You are a specialized assistant. Generate an inspiring, SEO-optimized, and witty 'Good Morning' tweet." },
        { "role": "user", "content": "Generate a GM tweet." }
      ],
      max_tokens: 240 // Limit the response to 240 tokens to ensure it fits within a tweet
    });

    // Extract and clean the generated tweet text
    let tweetText = removeQuotes(gpt4Response.choices[0].message.content.trim());

    // Add a prefix to the tweet text
    tweetText = `GM-GPT-X: ${tweetText}`;

    // Validate the generated tweet text
    if (!tweetText || tweetText.length > 280) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'The generated tweet text is invalid.' })
      };
    }

    // Post the tweet using the Twitter API
    const tweetResponse = await twitterClient.v2.tweet(tweetText);

    // Validate the Twitter API response
    if (!tweetResponse || !tweetResponse.data) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to post the tweet.' })
      };
    }

    // Return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Tweet posted successfully!', tweetId: tweetResponse.data.id })
    };

  } catch (error) {
    // Log any errors that occur and return a 500 status code
    console.error(`An error occurred: ${error.message}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'An error occurred.', error: error.message })
    };
  }
};
```

## AWS Deployment

### Uploading to AWS Lambda

1. **Zip Your Project**: Compress your project folder into a `.zip` file. Make sure that the `index.js` and `node_modules` folder are at the root level of the `.zip` file.

2. **Sign in to AWS Management Console**: Open your browser, navigate to the AWS Management Console, and sign in.

3. **Navigate to Lambda Service**: In the AWS Management Console, click on "Services" and then select "Lambda" under the "Compute" section.

4. **Create a New Function**: Click on the "Create function" button.

    - **Author from scratch**: Select "Author from scratch."
    - **Function name**: Give your function a name, like `GM-GPT-X`.
    - **Runtime**: Choose "Node.js" as the runtime.
  
5. **Function Code Section**: Scroll down to the "Function code" section.

    - **Code entry type**: Choose "Upload a .zip file."
    - **Upload your .zip file**: Click on "Upload" and select the `.zip` file you created earlier.

6. **Environment Variables**: Set the necessary environment variables like `OPENAI_API_KEY`, `TWITTER_CONSUMER_KEY`, `TWITTER_CONSUMER_SECRET`, `TWITTER_ACCESS_TOKEN_KEY`, and `TWITTER_ACCESS_TOKEN_SECRET`.

7. **Save and Deploy**: Click on the "Save" button at the top-right corner and then click "Deploy."

8. **Test the Function**: Click on the "Test" button, configure a new test event (you can leave the event body empty), and click "Save changes." Then click "Test" again to execute the function.

Congratulations, your Lambda function should now be uploaded and operational. You can see the logs and the returned output for debugging and verification.


### Setting Up CloudWatch

1. Open AWS CloudWatch.
2. Go to "Rules" under "Events".
3. Create a new rule with "Schedule" as the event source.
4. Use the expression `cron(0 6 * * ? *)` to run the function at 6 AM daily.
5. Select your Lambda function (`GM-GPT-X`) as the target.

## Conclusion

Congratulations, you've successfully built and deployed the GM-GPT-X bot. It's now set to tweet every morning.

## Further Reading

- [OpenAI API Documentation](https://beta.openai.com/docs/)
- [Twitter API v2 Documentation](https://developer.twitter.com/en/docs/twitter-api)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- [AWS CloudWatch Documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html)
