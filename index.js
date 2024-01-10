// Import required modules
const { TwitterApi } = require('twitter-api-v2');
const OpenAI = require('openai');

// Validate essential environment variables
// Throw an error if any required variable is missing
if (!process.env.OPENAI_API_KEY || !process.env.TWITTER_CONSUMER_KEY || !process.env.TWITTER_CONSUMER_SECRET || !process.env.TWITTER_ACCESS_TOKEN_KEY || !process.env.TWITTER_ACCESS_TOKEN_SECRET) {
  throw new Error('Essential environment variables are missing. Please check your configuration.');
}

//Remove quotes from the beginning and end of a string.

function removeQuotes(str) {
  return str.startsWith('"') && str.endsWith('"') ? str.slice(1, -1) : str;
}

// Initialize the OpenAI API client with the API key from environment variables
const openai = new OpenAI({ api_key: process.env.OPENAI_API_KEY });

//AWS Lambda function to automatically generate and post tweets.

exports.handler = async (event) => {
  // Initialize the Twitter API client with keys and tokens from environment variables
  const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  try {
    // Generate tweet text using OpenAI's GPT-4 model
    // The tweet will be SEO-optimized, inspiring, and witty
    const gpt4Response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { "role": "system", "content": "You are a specialized assistant. Generate an inspiring, SEO-optimized, and witty 'Good Morning' tweet." },
        { "role": "user", "content": "Generate a GM tweet inspired in the world of web3 gamedevelopment." }
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
