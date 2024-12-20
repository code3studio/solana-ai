export interface Challenge {
    id: string;
    title: string;
    description: string;
    reward: number;
    template?: string;
    submissions: Submission[];
    createdAt: Date;
  }
  
  export interface Submission {
    id: string;
    challengeId: string;
    userId: string;
    content: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
  }
  