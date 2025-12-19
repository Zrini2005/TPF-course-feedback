
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Course, Review } from "../types";

// Always use process.env.API_KEY directly and exclusively.
const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY || '';
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export async function getCourseSummary(course: Course, reviews: Review[]) {
  if (!genAI) {
    return "AI summary unavailable. API key not configured.";
  }

  const reviewsText = reviews.map(r => `
    [Easiness: ${r.rating}/5]
    Teaching Method: ${r.teachingMethod}
    Exam Structure: ${r.examStructure}
    Leniency: ${r.leniency}
    Grading Comments: ${r.gradingComments}
    Extra Classes: ${r.extraClasses}
    General Feedback: ${r.comment}
  `).join("\n---\n");
  
  const prompt = `
    You are an academic analysis tool. Summarize these student reviews for "${course.name}".
    
    IMPORTANT: 
    1. DO NOT use any markdown formatting characters. 
    2. DO NOT use asterisks (*) for bolding or bullet points.
    3. DO NOT use hash symbols (#) for headers.
    4. Use plain text only. Use capital letters for headers and simple dashes (-) for lists.
    
    Data from multiple students:
    ${reviewsText}
    
    Provide a concise synthesis covering:
    1. COMMON TEACHING STYLE: How do instructors usually deliver this course?
    2. EXAM & GRADING INSIGHT: What is the paper pattern and is grading generally fair or harsh?
    3. LOGISTICS: Mention if extra classes are common.
    4. VERDICT: Overall student sentiment.
    
    Be direct and professional.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || "Summary analysis not available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI is currently processing other academic data. Please check back later.";
  }
}

export async function askAboutCourse(question: string, course: Course, reviews: Review[]) {
  if (!genAI) {
    return "AI chat unavailable. API key not configured.";
  }

  const context = reviews.map(r => `Teaching: ${r.teachingMethod}. Exam: ${r.examStructure}. Grading: ${r.gradingComments}. General: ${r.comment}`).join(" | ");
  const prompt = `
    Student Question: "${question}"
    Context for "${course.name}": ${context}
    
    IMPORTANT: Provide a plain text answer. DO NOT use markdown characters like * or #.
    
    Answer the student's question based strictly on the provided feedback. If not mentioned, state that information is unavailable.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || "No specific data found for this query.";
  } catch (error) {
    return "Service temporarily unavailable.";
  }
}
