import { Challenge } from "@/types/challenge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ChallengeList() {
  // In a real app, fetch challenges from your database
  const challenges: Challenge[] = [
    {
      id: "2",
      title: "Build a calculator",
      description: "Build a calculator using React",
      reward: 50,
      submissions: [],
      createdAt: new Date(),
    },
    {
      id: "3",
      title: "Build a weather app",
      description: "Build a weather app using Vue.js",
      reward: 75,
      submissions: [],
      createdAt: new Date(),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {challenges.map((challenge) => (
        <Card key={challenge.id}>
          <CardHeader>
            <CardTitle>{challenge.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{challenge.description}</p>
            <p className="font-bold mb-4">Reward: {challenge.reward} USDC</p>
            {challenge.template && (
              <div className="mb-4">
                <p className="font-semibold">Template:</p>
                <p className="bg-muted p-2 rounded">{challenge.template}</p>
              </div>
            )}
            <Button>Submit Solution</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
