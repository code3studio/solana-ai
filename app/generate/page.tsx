import { Suspense } from "react";
import { CreateChallenge } from "@/components/create-challenge";
import { ChallengeList } from "@/components/challenge-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Challenge Giver</h1>
      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <CreateChallenge />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <ChallengeList />
      </Suspense>
    </main>
  );
}
