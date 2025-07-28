import axios from 'axios';
import {generateText} from "ai"
import {google} from "@ai-sdk/google"
import Interview from '../modals/interview.modal.js';
import User from '../modals/user.modal.js';
import { ServicePrincipalCredentials, PDFServices, MimeType, ExtractPDFParams, ExtractElementType, ExtractPDFJob, ExtractPDFResult } from "@adobe/pdfservices-node-sdk";
import fs from "fs";
import AdmZip from "adm-zip";
import path from "path";
import { analyze } from '../lib/gitingest.js';

export const readPdf = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ message: 'No PDF URL provided' });

  try {
    // Call the gitingest_backend PDF extraction API
    const response = await axios.post('http://localhost:5001/extract-pdf-text', {
      pdf_url: url
    });
    const text = response.data.text;
    res.json({ text });
  } catch (err) {
    console.log("Exception encountered while extracting PDF text", err);
    res.status(500).json({ message: 'Failed to process PDF' });
  }
};

export const getLeetCodeAnalysis = async (req, res) => {
  const { username } = req.body;
  try {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
    const response = await axios.get(url);
    const stats = response.data;
    if (!stats || stats.status === 'error') {
      return res.status(404).json({ text: 'No LeetCode stats found for this user.' });
    }
    // Create a text summary
    const text = `LeetCode Profile Analysis for ${username}:

Total Solved: ${stats.totalSolved} / ${stats.totalQuestions}
Easy: ${stats.easySolved} / ${stats.totalEasy}
Medium: ${stats.mediumSolved} / ${stats.totalMedium}
Hard: ${stats.hardSolved} / ${stats.totalHard}
Ranking: ${stats.ranking}
Contribution Points: ${stats.contributionPoints}
Reputation: ${stats.reputation}
Acceptance Rate: ${stats.acceptanceRate}%

Recent Submission Stats:
${stats.recentSubmissionStats?.map(s => `- ${s.title} (${s.status})`).join('\n') || 'No recent submissions.'}`;
    res.json({ text });
  } catch (error) {
    console.log("Exception encountered while fetching LeetCode stats", error);
    res.status(500).json({ message: 'Failed to fetch LeetCode stats' });
  }
};

export const getRandomTopic = async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) return res.status(400).json({ message: 'No resume text provided' });

    const prompt = `Given the following resume text, generate 5 random, relevant, and diverse interview topics. For each topic, also generate a relevant subtopic. Return only a valid JSON array of 5 objects, each with the following structure: { "topic": "<topic>", "subtopic": "<subtopic>" }. Do not include any explanations, introductions, or extra text—only the JSON array.\n\nExample output:\n[\n  { "topic": "Machine Learning", "subtopic": "Supervised Learning" },\n  { "topic": "Web Development", "subtopic": "React.js" },\n  { "topic": "Cloud Computing", "subtopic": "AWS Services" },\n  { "topic": "Data Structures", "subtopic": "Trees" },\n  { "topic": "Cybersecurity", "subtopic": "Network Security" }\n]\n\nResume:\n${resumeText}`;

    // Use the same model initialization as generateQuestio
    const { text } = await generateText({
       model:google('gemini-2.0-flash-001'), 
       prompt 
      });

    // Clean the response text
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const topics = JSON.parse(cleanText);
    res.status(200).json({ topics });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const generateQuestion = async (req,res)=>{
  const {topic,subTopic,level,amount,resume,leetcode,github} = req.body;
  const userId = req.user._id;
  try{
    if(!topic || !subTopic || !level || !amount) {
      return res.status(400).json({message:"Please enter all the inputs"})
    }
    const user = await User.findById(userId);
    if(user.interviewLeft <= 0 && user.subscription!=='pro'){
      return res.status(400).json({message:"You have no interviews left"})
    }
    if(user.subscription==='pro' || user.subscription==='starter'){
      if(user.interviewLeftExpire < Date.now()){
        user.interviewLeft = 0;
        user.subscription = 'none';
        await user.save();
        return res.status(400).json({message:"Your subscription has expired"})
      }
    }

    // --- Enhanced Prompt with GitHub Integration ---
    const prompt = `Given the following context, generate ${amount} personalized interview questions.\n\nContext:\n- Topic: ${topic}\n- Subtopic: ${subTopic}\n- Difficulty: ${level}\n- Resume: ${resume || 'N/A'}\n- LeetCode Stats: ${leetcode || 'N/A'}\n- Github Projects: ${github || 'N/A'}\n\nRequirements:\n- At least one question should be a behavioral or soft skills question.\n- Include questions specifically about the candidate's GitHub projects if available.\n- Ask technical questions that match the candidate's experience level and technologies used in their projects.\n- Questions should be personalized based on the resume content, LeetCode performance, and GitHub project analysis.\n- Each question should be clear, concise, and suitable for an AI voice agent to read aloud.\n- Do not use any special characters in the questions, only letters, numbers, and spaces.\n- Questions should progress from basic to advanced based on the difficulty level.\n- For GitHub projects, ask about specific technologies, architecture decisions, and challenges faced.\n- Return only a valid JSON array of strings with no explanations or extra text.\n\nExample output:\n[\n  "What is a data structure",\n  "Explain the concept of a linked list",\n  "How do you implement a stack in code",\n  "Describe a time you overcame a challenge at work",\n  "What technologies did you use in your GitHub project",\n  "How did you structure your React components in your portfolio"\n]\nNow generate the questions.`;

    const {text} = await generateText({
      model : google('gemini-2.0-flash-001'),
      prompt
    })

    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const questions = JSON.parse(cleanText);

    const interview = await Interview.create({
      userId,
      topic,
      subTopic,
      level,
      questions,
    })

    // Increment user's totalInterviews
    if (user) {
        user.interviewLeft = user.interviewLeft - 1;
      user.stats.totalInterviews = (user.stats.totalInterviews || 0) + 1;
      await user.save();
    }

    res.status(200).json({interview});
  }catch(error){
    console.log("error in getQuestion controller",error);
    return res.status(500).json({message:"Internal server Error"})
  }
};

export const createFeedback = async (req,res)=>{
  const {interviewId,transcript,} = req.body;
  const userId = req.user._id;
  try{
    // console.log('createFeedback called with:', { interviewId, transcriptType: typeof transcript, transcriptLength: Array.isArray(transcript) ? transcript.length : 'N/A' });
    
    if(!interviewId || !transcript){
      return res.status(400).json({message:"Transcript not found"})
    }

    // Handle both array format (from socket) and string format (legacy)
    let formattedTranscript;
    if (Array.isArray(transcript)) {
      // New format from socket - array of objects with role and content
      formattedTranscript = transcript.map((sentence)=>(
        `-${sentence.role}: ${sentence.content}\n`
      )).join('');
    } else if (typeof transcript === 'string') {
      // Legacy format - already a string
      formattedTranscript = transcript;
    } else {
      return res.status(400).json({message:"Invalid transcript format"})
    }

    // Check if user actually provided meaningful responses
    const userResponses = Array.isArray(transcript) 
      ? transcript.filter(msg => msg.role === 'candidate' && msg.content.trim().length > 0 && msg.content.trim() !== '[NO RESPONSE]')
      : [];
    
    const hasUserResponses = userResponses.length > 0;
    
    if (!hasUserResponses) {
      // User didn't provide any responses, return default feedback
      const defaultFeedback = {
        totalScore: 0,
        categoryScores: [
          { name: "Communication Skills", score: 0, comment: "No responses provided to assess communication skills" },
          { name: "Technical Knowledge", score: 0, comment: "No responses provided to assess technical knowledge" },
          { name: "Problem Solving", score: 0, comment: "No responses provided to assess problem solving" },
          { name: "Cultural Fit", score: 0, comment: "No responses provided to assess cultural fit" },
          { name: "Confidence and Clarity", score: 0, comment: "No responses provided to assess confidence and clarity" }
        ],
        strengths: ["No assessment possible - no responses provided"],
        areasForImprovement: ["Please provide responses in future interviews to receive proper feedback"],
        finalAssessment: "No assessment possible as no responses were provided during the interview."
      };

      // Update the interview document with the default feedback
      const updatedInterview = await Interview.findByIdAndUpdate(
        interviewId,
        { feedback: defaultFeedback, status: 'completed' },
        { new: true }
      );

      if (!updatedInterview) {
        console.error('Failed to update interview with ID:', interviewId);
        return res.status(404).json({message:"Interview not found"});
      }

      res.status(200).json({
        interview: updatedInterview,
        user: null // No user stats update since no score
      });
      return;
    }

    const prompt = `You are an expert technical interviewer and assessment coach. You will be given the transcript of a candidate's interview. Assess the candidate in the following categories: Communication Skills, Technical Knowledge, Problem Solving, Cultural Fit, and Confidence and Clarity. For each category, provide a score from 0 to 20 and a short comment. Also, provide a totalScore (0-100), a list of strengths, a list of areas for improvement, and a finalAssessment (1-2 sentences). Return only a valid JSON object in the following format:

{
  totalScore: number,
  categoryScores: [
    { name: "Communication Skills", score: number, comment: string },
    { name: "Technical Knowledge", score: number, comment: string },
    { name: "Problem Solving", score: number, comment: string },
    { name: "Cultural Fit", score: number, comment: string },
    { name: "Confidence and Clarity", score: number, comment: string }
  ],
  strengths: string[],
  areasForImprovement: string[],
  finalAssessment: string
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

Transcript:
${formattedTranscript}`;

    const system = `You are an expert technical interviewer and assessment coach. Your job is to analyze the provided interview transcript and return a JSON object with the following structure:

{
  totalScore: number,
  categoryScores: [
    { name: "Communication Skills", score: number, comment: string },
    { name: "Technical Knowledge", score: number, comment: string },
    { name: "Problem Solving", score: number, comment: string },
    { name: "Cultural Fit", score: number, comment: string },
    { name: "Confidence and Clarity", score: number, comment: string }
  ],
  strengths: string[],
  areasForImprovement: string[],
  finalAssessment: string
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

Do not include any explanations or extra text. Only return the JSON object. All scores should be integers between 0 and 20. Comments should be concise and actionable.
`;

    const { text } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt,
      system
    });

    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    // console.log('AI generated feedback text:', cleanText);
    
    let feedback;
    try {
      feedback = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Failed to parse AI feedback JSON:', parseError);
      console.error('Raw text:', cleanText);
      return res.status(500).json({message:"Failed to parse AI feedback"});
    }

    // Validate feedback structure and ensure scores are reasonable
    if (!feedback.totalScore || feedback.totalScore < 0 || feedback.totalScore > 100) {
      feedback.totalScore = 0;
    }

    // Ensure category scores are valid
    if (feedback.categoryScores && Array.isArray(feedback.categoryScores)) {
      feedback.categoryScores.forEach(category => {
        if (category.score < 0 || category.score > 20) {
          category.score = 0;
        }
      });
    }

    // Update the interview document with the feedback and set status to completed
    const updatedInterview = await Interview.findByIdAndUpdate(
      interviewId,
      { feedback, status: 'completed' },
      { new: true }
    );

    if (!updatedInterview) {
      console.error('Failed to update interview with ID:', interviewId);
      return res.status(404).json({message:"Interview not found"});
    }

    // Update user's stats.averageScore based on feedback only if they provided responses
    const user = await User.findById(userId);
    if (user && feedback && typeof feedback.totalScore === 'number' && feedback.totalScore > 0) {
      // Calculate new averageScore
      const prevTotal = user.stats.averageScore && user.stats.totalInterviews > 1
        ? parseFloat(user.stats.averageScore) * (user.stats.totalInterviews - 1)
        : 0;
      const newTotal = prevTotal + feedback.totalScore;
      const avg = newTotal / user.stats.totalInterviews;
      user.stats.averageScore = avg.toFixed(2);
      // Update level progress
      user.stats.levelProgress = (user.stats.levelProgress || 0) + 20;
      if (user.stats.levelProgress >= 100) {
        if (user.stats.level < 3) {
          user.stats.level += 1;
        }
        user.stats.levelProgress = 0;
      }
      await user.save();
    }

    res.status(200).json({
       interview: updatedInterview,
       user: user
     });
  }catch(error){
    console.log("Error in createFeedback",error);
    return res.status(500).json({message:"Internal Server Error"})
  }
};


export const analyzeGitHubRepo = async (req, res) => {
  const { repoUrl, githubToken } = req.body;

  if (!repoUrl) {
    return res.status(400).json({ message: 'No repository URL provided' });
  }

  try {
    const analysisResult = await analyze(repoUrl, githubToken );

    if (!analysisResult) {
      return res.status(500).json({ message: 'Failed to analyze repository with Gitingest' });
    }

    let { summary, tree, files } = analysisResult;
    files = files.slice(0, 800000);

    // Extract repo name from URL for the prompt
    const repoUrlParts = repoUrl.split('/');
    const repoName = repoUrlParts[repoUrlParts.length - 1];

    // Generate AI analysis of the repository using the summary from Gitingest
    let prompt = `You are an expert software engineer and technical interviewer. Analyze this GitHub repository information and create a concise summary that highlights the key aspects of the project. Focus on the technologies used, architecture, and main features.

Repository Information:
Name: ${repoName}
Summary from Gitingest:
${summary}

File Tree:
${JSON.stringify(tree, null, 2)}

Files Content:
${JSON.stringify(files, null, 2)}

Provide a concise analysis (maximum 2000 words) that covers:
1. Project purpose and main features
2. Technology stack and architecture
3. Code organization and structure
4. Potential technical challenges or interesting aspects

Return only the analysis text without any introductory phrases like "Here's my analysis" or "Based on the repository".`;
    
   

    const { text: aiAnalysis } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt
    });

    res.status(200).json({
      analysis: aiAnalysis,
      tree
    });

  } catch (error) {
    console.error('Error analyzing GitHub repository with Gitingest:', error);
    res.status(500).json({ message: 'Failed to analyze GitHub repository' });
  }
};