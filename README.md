# GM-GPT-X: Automated GM X(Twitter) Bot with AWS Lambda and OpenAI GPT-4

## Overview

GM-GPT-X is a X(Twitter) bot that uses OpenAI's GPT-4 model to generate a daily 'Good Morning' tweet.
The bot is hosted on AWS Lambda and runs on a schedule set by AWS CloudWatch.

## Features

- Automated daily 'Good Morning' tweets
- Easy to set up and configure
- Hosted on AWS Lambda
- Scheduled using AWS CloudWatch

## Prerequisites

Ensure you have:

- Node.js and npm installed
- An AWS account
- OpenAI API key
- Twitter Developer Account and API keys

## Quick Start

1. Clone this repository.
2. Install the required packages: `npm install twitter-api-v2 openai`.
3. Set up your AWS Lambda function and CloudWatch schedule. Follow the [detailed tutorial](./TUTORIAL.md) for step-by-step instructions.

## Documentation

For detailed setup and customization instructions, please refer to the [tutorial](./TUTORIAL.md).

## License

MIT License. See [LICENSE](./LICENSE) for more details.
