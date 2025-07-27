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

  let readStream;
  const tempFilePath = path.join("./", `temp_${Date.now()}.pdf`);
  const outputFilePath = path.join("./", `ExtractTextInfoFromPDF_${Date.now()}.zip`);
  try {
    // Download PDF as buffer and save to temp file
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    fs.writeFileSync(tempFilePath, response.data);

    // Initial setup, create credentials instance
    const credentials = new ServicePrincipalCredentials({
      clientId: process.env.PDF_SERVICES_CLIENT_ID,
      clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET
    });

    // Creates a PDF Services instance
    const pdfServices = new PDFServices({ credentials });

    // Creates an asset(s) from source file(s) and upload
    readStream = fs.createReadStream(tempFilePath);
    const inputAsset = await pdfServices.upload({
      readStream,
      mimeType: MimeType.PDF
    });

    // Create parameters for the job
    const params = new ExtractPDFParams({
      elementsToExtract: [ExtractElementType.TEXT]
    });

    // Creates a new job instance
    const job = new ExtractPDFJob({ inputAsset, params });

    // Submit the job and get the job result
    const pollingURL = await pdfServices.submit({ job });
    const pdfServicesResponse = await pdfServices.getJobResult({
      pollingURL,
      resultType: ExtractPDFResult
    });

    // Get content from the resulting asset(s)
    const resultAsset = pdfServicesResponse.result.resource;
    const streamAsset = await pdfServices.getContent({ asset: resultAsset });

    // Creates a write stream and copy stream asset's content to it
    const writeStream = fs.createWriteStream(outputFilePath);
    await new Promise((resolve, reject) => {
      streamAsset.readStream.pipe(writeStream);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    // Unzip and extract text
    const zip = new AdmZip(outputFilePath);
    const jsondata = zip.readAsText('structuredData.json');
    const data = JSON.parse(jsondata);
    const allText = data.elements.map(element => element.Text).filter(Boolean).join('\n');

    res.json({ text: allText });
  } catch (err) {
    console.log("Exception encountered while executing operation", err);
    res.status(500).json({ message: 'Failed to process PDF' });
  } finally {
    readStream?.destroy();
    // Clean up temp files
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    if (fs.existsSync(outputFilePath)) fs.unlinkSync(outputFilePath);
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
    if(!interviewId || !transcript){
      return res.status(400).json({message:"Transcript not found"})
    }

    const formattedTranscript = transcript.map((sentence)=>(
      `-${sentence.role}: ${sentence.content}\n`
    )).join('');

    const prompt = `You are an expert technical interviewer and assessment coach. You will be given the transcript of a candidate's interview. Assess the candidate in the following categories: Communication Skills, Technical Knowledge, Problem Solving, Cultural Fit, and Confidence and Clarity. For each category, provide a score from 0 to 20 and a short comment. Also, provide a totalScore (0-100), a list of strengths, a list of areas for improvement, and a finalAssessment (1-2 sentences). Return only a valid JSON object in the following format:\n\n{
  totalScore: number,\n  categoryScores: [\n    { name: "Communication Skills", score: number, comment: string },\n    { name: "Technical Knowledge", score: number, comment: string },\n    { name: "Problem Solving", score: number, comment: string },\n    { name: "Cultural Fit", score: number, comment: string },\n    { name: "Confidence and Clarity", score: number, comment: string }\n  ],\n  strengths: string[],\n  areasForImprovement: string[],\n  finalAssessment: string\n}\n\nTranscript:\n${formattedTranscript}`;

    const system = `You are an expert technical interviewer and assessment coach. Your job is to analyze the provided interview transcript and return a JSON object with the following structure:\n\n{
  totalScore: number,\n  categoryScores: [\n    { name: "Communication Skills", score: number, comment: string },\n    { name: "Technical Knowledge", score: number, comment: string },\n    { name: "Problem Solving", score: number, comment: string },\n    { name: "Cultural Fit", score: number, comment: string },\n    { name: "Confidence and Clarity", score: number, comment: string }\n  ],\n  strengths: string[],\n  areasForImprovement: string[],\n  finalAssessment: string\n}\n\nDo not include any explanations or extra text. Only return the JSON object. All scores should be integers between 0 and 20. Comments should be concise and actionable.\n`;

    const { text } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt,
      system
    });

    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const feedback = JSON.parse(cleanText);

    // Update the interview document with the feedback and set status to completed
    const updatedInterview = await Interview.findByIdAndUpdate(
      interviewId,
      { feedback, status: 'completed' },
      { new: true }
    );

    // Update user's stats.averageScore based on feedback
    const user = await User.findById(userId);
    if (user && feedback && typeof feedback.totalScore === 'number') {
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
    files = files.slice(0, 900000);

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