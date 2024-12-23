import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Task } from '@/types/challenge';
import clientPromise from '@/lib/clientpromise';
import { ObjectId } from 'mongodb';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function calculateEngagementScore(metrics: { like_count: number, retweet_count: number, reply_count: number, impression_count: number }) {
  const { like_count, retweet_count, reply_count, impression_count } = metrics;
  
  // Normalize engagement metrics
  const engagementRate = (like_count + retweet_count + reply_count) / impression_count;
  return Math.min(Math.round(engagementRate * 1000), 100); // Score out of 100
}

async function evaluateTweetContent(tweetText: string, task: Task) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `
    Task Requirements: ${task.requirements.join(', ')}
    Tweet Content: "${tweetText}"
    
    Evaluate if the tweet content is relevant to the task requirements and provide:
    1. Relevance score (0-100)
    2. Content quality score (0-100)
    3. Brief feedback
    
    Format response as JSON:
    {
      "relevanceScore": number,
      "contentQuality": number,
      "feedback": "string"
    }
  `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return JSON.parse(response.text());
}

export async function POST(request: Request) {
  try {
    const { data: tweetData, taskId, taskData } = await request.json();
    
    // Calculate engagement score
    const engagementScore = calculateEngagementScore(tweetData.public_metrics);
    
    // Evaluate content
    const contentEvaluation = await evaluateTweetContent(tweetData.text, taskData);
    
    // Calculate overall score
    const overallScore = Math.round(
      (engagementScore + contentEvaluation.relevanceScore + contentEvaluation.contentQuality) / 3
    );

    // Store submission in MongoDB
    const client = await clientPromise;
    const db = client.db('tweetcontest');

    const submission = {
      taskId: new ObjectId(taskId),
      tweetId: tweetData.id,
      authorId: tweetData.author_id,
      authorUsername: tweetData.author.username,
      authorName: tweetData.author.name,
      tweetText: tweetData.text,
      scores: {
        relevance: contentEvaluation.relevanceScore,
        engagement: engagementScore,
        contentQuality: contentEvaluation.contentQuality,
        overall: overallScore
      },
      feedback: contentEvaluation.feedback,
      metrics: tweetData.public_metrics,
      createdAt: new Date(),
      status: 'submitted'
    };

    await db.collection('submissions').insertOne(submission);

    return NextResponse.json({
      relevanceScore: contentEvaluation.relevanceScore,
      engagementScore,
      contentQuality: contentEvaluation.contentQuality,
      overallScore,
      feedback: contentEvaluation.feedback
    });

  } catch (error) {
    console.error('Error processing tweet review:', error);
    return NextResponse.json(
      { error: 'Failed to process tweet review' },
      { status: 500 }
    );
  }
}
