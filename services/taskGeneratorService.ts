// services/taskGeneratorService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import clientPromise from '../lib/clientpromise';
import { ObjectId } from 'mongodb';

export interface GeneratedTask {
  description: string;
  category: 'blockchain' | 'memes' | 'nfts';
  requirements: string[];
  evaluationCriteria: string[];
}

export class TaskGeneratorService {
  private static async generateTaskWithAI(): Promise<GeneratedTask> {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      Generate a creative Twitter task related to one of these categories: blockchain, memes, or NFTs.
      The task should be engaging, clear, and encourage creative responses.
      
      Provide the response in this JSON format:
      {
        "title": "task title",
        "description": "clear task description",
        "category": "one of: blockchain, memes, nfts",
        "requirements": ["list of specific requirements"],
        "evaluationCriteria": ["specific criteria for judging"]
        "rewards": {
          "usdcAmount": "number between 100-1000",
          "nftReward": "optional NFT reward"
        }

      }

      Make the task fun and engaging while maintaining relevance to crypto/web3 culture.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  }

  public static async createNewTask(durationHours: number = 4): Promise<string> {
    const task = await this.generateTaskWithAI();
    
    const client = await clientPromise;
    const db = client.db('tweetcontest');

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);

    const result = await db.collection('tasks').insertOne({
      ...task,
      startTime,
      endTime,
      isActive: true,
      winners: [],
      _id: new ObjectId()
    });

    return result.insertedId.toString();
  }

  public static async getActiveTask() {
    const client = await clientPromise;
    const db = client.db('tweetcontest');
    // Return the all active task
    return db.collection('tasks').find({ isActive: true }).toArray();
  }

  public static async getTaskById(taskId: string) {
    const client = await clientPromise;
    const db = client.db('tweetcontest');
    return db.collection('tasks').findOne({ _id: new ObjectId(taskId) });
  }
}