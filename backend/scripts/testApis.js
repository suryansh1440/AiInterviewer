import dotenv from 'dotenv';
import OpenAI from 'openai';
import { getApi } from '../lib/getApi.js';

// Load environment variables
dotenv.config();

/**
 * Test the OpenAI API key by making a demo call
 * @returns {Object} - Test result with status and error message if any
 */
const testApi = async () => {
  try {
    const apiKey = getApi();
    if (!apiKey) {
      return {
        success: false,
        error: 'No API key found in environment variables (OPENAI_API_KEY)'
      };
    }

    console.log(`\nTesting OpenAI API...`);
    console.log(`API Key: ${apiKey.substring(0, 10)}...`);
    
    // Create OpenAI client
    const client = new OpenAI({
      apiKey: apiKey
    });

    // Make a comprehensive test call with a large prompt to thoroughly test the API
    const testPrompt = `You are an expert technical interviewer and assessment coach. You will be given the transcript of a candidate's interview. Assess the candidate in the following categories: Communication Skills, Technical Knowledge, Problem Solving, Cultural Fit, and Confidence and Clarity. For each category, provide a score from 0 to 20 and a short comment. Also, provide a totalScore (0-100), a list of strengths, a list of areas for improvement, and a finalAssessment (1-2 sentences). Return only a valid JSON object in the following format:

{
  "totalScore": number,
  "categoryScores": [
    { "name": "Communication Skills", "score": number, "comment": string },
    { "name": "Technical Knowledge", "score": number, "comment": string },
    { "name": "Problem Solving", "score": number, "comment": string },
    { "name": "Cultural Fit", "score": number, "comment": string },
    { "name": "Confidence and Clarity", "score": number, "comment": string }
  ],
  "strengths": string[],
  "areasForImprovement": string[],
  "finalAssessment": string
}

CRITICAL SCORING RULES:
1. ONLY score categories where the candidate provided meaningful responses to questions.
2. If the candidate did not answer a question or provided no meaningful response, give a score of 0 for that category.
3. Do NOT penalize the candidate for unanswered questions - simply don't score them.
4. The totalScore should be calculated ONLY from the categories where the candidate provided responses.
5. If the candidate provided very few or no meaningful responses, the totalScore should be 0.
6. The finalAssessment should be based only on the responses provided, not on missing answers.
7. If the candidate didn't answer most questions, mention this in the finalAssessment.
8. A meaningful response is one that actually answers the question asked, not just acknowledging the question.
9. If the transcript shows "[NO RESPONSE]" or empty responses, do not score those interactions.
10. Only give positive scores when the candidate demonstrates actual knowledge or skills in their responses.
11. Do not penalize for grammar, spelling, or transcription errors. Focus only on the content, clarity, and intent of the candidate's responses.
12. If a word or phrase is repeated multiple times due to speech recognition errors, ignore the repetition and do not penalize the candidate.

This is a test transcript for API validation purposes. The candidate provided the following responses:

-Interviewer: Can you tell me about your experience with JavaScript?
-Candidate: I have been working with JavaScript for about 5 years. I started with vanilla JavaScript and then moved to modern frameworks like React and Node.js. I've built several full-stack applications using the MERN stack.
-Interviewer: How do you handle asynchronous operations in JavaScript?
-Candidate: I use Promises and async/await extensively. I understand the event loop and how JavaScript handles asynchronous code. I've also worked with Promise.all for parallel operations and error handling with try-catch blocks.
-Interviewer: Can you explain the concept of closures?
-Candidate: Closures are functions that have access to variables in their outer lexical scope even after the outer function has returned. They're useful for data privacy and creating function factories. I've used closures in many projects to create private variables and maintain state.
-Interviewer: What is your approach to debugging?
-Candidate: I start by understanding the problem, then use console.log strategically, browser dev tools, and sometimes debugger statements. I also read error messages carefully and use stack traces to identify the issue.
-Interviewer: How do you ensure code quality?
-Candidate: I write clean, readable code with meaningful variable names. I use ESLint for linting, Prettier for formatting, and I write unit tests using Jest. I also do code reviews and follow best practices and design patterns.

Please analyze this transcript and provide a comprehensive assessment in the JSON format specified above.`;
    
    const response = await client.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        { role: "user", content: testPrompt }
      ]
    });

    const text = response.choices[0]?.message?.content || '';
    console.log(`✅ Success! Response: ${text.substring(0, 50)}...`);
    
    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.log(`❌ Error testing API: ${error.message}`);
    
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Main function to test the OpenAI API
 */
const testAllApis = async () => {
  try {
    console.log('Testing OpenAI API from environment variable...\n');

    // Test the API
    const result = await testApi();
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('TEST SUMMARY');
    console.log('='.repeat(60));
    
    if (result.success) {
      console.log('✅ API test successful!');
      console.log('The OpenAI API key is working correctly.');
    } else {
      console.log('❌ API test failed!');
      console.log(`Error: ${result.error}`);
      console.log('\nPlease check:');
      console.log('1. OPENAI_API_KEY is set in your .env file');
      console.log('2. The API key is valid');
      console.log('3. You have sufficient credits/quota');
    }
    
    console.log('\n' + '='.repeat(60));
    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Fatal error in test script:', error);
    process.exit(1);
  }
};

// Run the test
testAllApis();

