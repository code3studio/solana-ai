import { NextResponse } from 'next/server';
// import { Challenge } from '@/types/challenge';
import { genAI } from '@/lib/gemini-server';

export async function POST(req: Request) {
  try {
    const challengeData = await req.json();
    
    // Validate challenge data using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Review this Web3 challenge for quality and appropriateness:
                   ${JSON.stringify(challengeData)}
                   Provide a JSON response with:
                   {
                     "isAppropriate": boolean,
                     "suggestedRewards": recommended USDC reward range,
                     "difficulty": suggested difficulty level,
                     "tags": array of relevant tags,
                     "improvements": suggested improvements
                   }`;

    const result = await model.generateContent(prompt);
    const aiReview = JSON.parse(result.response.text());

    if (!aiReview.isAppropriate) {
      return NextResponse.json(
        { error: 'Challenge content is not appropriate' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Store challenge metadata on Solana blockchain
    // 2. Store additional data in your database
    // 3. Initialize reward pool with USDC-SPL tokens
    // 4. Notify creator of successful challenge creation
    
    
    return NextResponse.json({
      success: true,
      challenge: {
        ...challengeData,
        aiReview,
      },
    });
  } catch (error) {
    console.error('Challenge Creation Error:', error);
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    );
  }
}
