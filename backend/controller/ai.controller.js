import axios from 'axios';
import {generateText} from "ai"
import {google} from "@ai-sdk/google"
import Interview from '../modals/interview.modal.js';
import User from '../modals/user.modal.js';
import { ServicePrincipalCredentials, PDFServices, MimeType, ExtractPDFParams, ExtractElementType, ExtractPDFJob, ExtractPDFResult } from "@adobe/pdfservices-node-sdk";
import fs from "fs";
import AdmZip from "adm-zip";
import path from "path";

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
  const {topic,subTopic,level,amount} = req.body;
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



    const prompt = `Given the topic ${topic} and subtopic ${subTopic} and the difficulty level ${level}, generate ${amount} interview questions. Each question should be clear concise and suitable for an AI voice agent to read aloud Do not use any special characters in the questions only letters numbers and spaces Return only a valid JSON array of strings with no explanations or extra text Example output:\n[\n  "What is a data structure",\n  "Explain the concept of a linked list",\n  "How do you implement a stack in code"\n]\nNow generate the questions.`;    

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

    res.status(200).json({ interview: updatedInterview });
  }catch(error){
    console.log("Error in createFeedback",error);
    return res.status(500).json({message:"Internal Server Error"})
  }
};