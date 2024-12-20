'use server'

import { z } from 'zod'

const challengeResponseSchema = z.object({
  title: z.string(),
  description: z.string(),
  reward: z.number(),
  template: z.string().optional(),
})

export type ChallengeResponse = z.infer<typeof challengeResponseSchema>

export async function generateChallenge(topic: string): Promise<{
  success: boolean
  challenge?: ChallengeResponse
  error?: string
}> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate challenge')
    }

    const data = await response.json()
    const validatedChallenge = challengeResponseSchema.parse(data.challenge)
    
    return {
      success: true,
      challenge: validatedChallenge,
    }
  } catch (error) {
    console.error('Error in generateChallenge:', error)
    return {
      success: false,
      error: 'Failed to generate challenge'
    }
  }
}