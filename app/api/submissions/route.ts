// app/api/submissions/route.ts
import { NextResponse } from 'next/server';
// import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { genAI } from '@/lib/gemini-server';

const IPFS_API_BASE_URL = 'https://ipfs.infura.io:5001/api/v0';

async function uploadToIPFS(content: Record<string, unknown>) {
  const formData = new FormData();
  formData.append('file', JSON.stringify(content));

  const response = await fetch(`${IPFS_API_BASE_URL}/add`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.IPFS_PROJECT_ID}:${process.env.IPFS_PROJECT_SECRET}`
      ).toString('base64')}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload to IPFS: ${response.statusText}`);
  }

  const result = await response.json();
  return result.Hash; // The IPFS hash
}

export async function POST(req: Request) {
  try {
    const { challengeId, content, walletAddress } = await req.json();

    // Upload content to IPFS
    const ipfsHash = await uploadToIPFS(content);

    // AI Review of submission
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Review this Web3 challenge submission:
                   ${JSON.stringify(content)}
                   
                   Evaluate based on:
                   1. Technical accuracy
                   2. Originality
                   3. Quality
                   4. Adherence to challenge requirements
                   
                   Provide a JSON response with:
                   {
                     "score": number between 0-100,
                     "isOriginal": boolean,
                     "feedback": detailed feedback,
                     "suggestedImprovements": array of suggestions,
                     "recommendedAction": "approve" | "reject"
                   }`;

    const result = await model.generateContent(prompt);
    const aiReview = JSON.parse(result.response.text());

    // Store submission data
    const submission = {
      id: crypto.randomUUID(),
      challengeId,
      creator: walletAddress,
      content: {
        ipfsHash,
      },
      timestamp: new Date(),
      status: aiReview.score >= 70 ? 'approved' : 'pending',
      aiScore: aiReview.score,
      feedback: aiReview.feedback,
    };

    // Here you would typically:
    // 1. Store submission metadata on Solana blockchain
    // 2. If approved automatically (score >= 70), initiate reward distribution
    // 3. Store detailed review data in your database

    return NextResponse.json({
      success: true,
      submission,
      aiReview,
    });
  } catch (error) {
    console.error('Submission Processing Error:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}
