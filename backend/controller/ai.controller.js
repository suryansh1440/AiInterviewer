import axios from 'axios';
import pdfParse from 'pdf-parse';
import {generateText} from "ai"
import {google} from "@ai-sdk/google"
import Interview from '../modals/interview.modal.js';

export const readPdf = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ message: 'No PDF URL provided' });

  try {
    // Download PDF as buffer
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const pdfBuffer = Buffer.from(response.data, 'binary');

    // Extract text using pdf-parse
    const data = await pdfParse(pdfBuffer);
    res.json({ text: data.text });
  } catch (err) {
    console.error("error in readpdf controller", err);
    res.status(500).json({ message: 'Failed to process PDF' });
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
    res.status(200).json({interview});
  }catch(error){
    console.log("error in getQuestion controller",error);
    return res.status(500).json({message:"Internal server Error"})
  }
};