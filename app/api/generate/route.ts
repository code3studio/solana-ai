import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json();
    console.log('Generating challenge for topic:', topic);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Create a fun challenge related to ${topic}. 
Return ONLY a valid JSON object with no additional text or explanation.
The JSON must strictly follow this format:
{
  "title": "string",
  "description": "string",
  "reward": number,
  "template": "string"
}

Requirements:
- Title should be creative and engaging
- Description should be clear and concise
- Reward must be a number between 1 and 5
- Template should be a starting point or example
- Ensure all strings are properly escaped
- Do not include any line breaks in strings`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    try {
      const challenge = JSON.parse(responseText);
      return NextResponse.json({ challenge });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('Raw response:', responseText);
      return NextResponse.json(
        { error: 'Invalid response format from AI' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error generating challenge:', error);
    return NextResponse.json(
      { error: 'Failed to generate challenge' },
      { status: 500 }
    );
  }
}