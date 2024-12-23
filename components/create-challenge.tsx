"use client";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIChallengeReview } from "@/types/ai";

const challengeSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.enum(["meme", "educational", "development"]),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  rewards: z.object({
    usdcAmount: z.number().min(1, "Reward must be at least 1 USDC"),
  }),
  deadline: z.string().transform((str) => new Date(str)),
  requirements: z
    .array(z.string())
    .min(1, "At least one requirement is needed"),
});

type ChallengeFormValues = z.infer<typeof challengeSchema>;

const defaultValues: Partial<ChallengeFormValues> = {
  category: "development",
  difficulty: "beginner",
  rewards: { usdcAmount: 0 },
  requirements: [""],
};

export default function CreateChallenge() {
  const { connected, publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [aiReview, setAiReview] = useState<AIChallengeReview | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ChallengeFormValues>({
    resolver: zodResolver(challengeSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: ChallengeFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!connected || !publicKey) {
        throw new Error("Please connect your wallet first");
      }

      // Submit to AI review endpoint
      const aiResponse = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: data,
          type: "validate_submission",
        }),
      });

      const aiResult = await aiResponse.json();
      setAiReview(aiResult);

      if (aiResult.isAppropriate) {
        const response = await fetch("/api/challenges", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            creator: publicKey.toString(),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create challenge");
        }

        form.reset(defaultValues);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Web3 Challenge</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Challenge Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Challenge Description"
                      className="h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="meme">Meme</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rewards.usdcAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>USDC Reward Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="USDC Amount"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={
                        field.value
                          ? field.value.toISOString().slice(0, 16)
                          : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {aiReview && (
              <Alert>
                <AlertDescription>
                  <div className="space-y-2">
                    <p>AI Review Suggestions:</p>
                    <ul className="list-disc pl-4">
                      {aiReview.improvements.map((improvement, idx) => (
                        <li key={idx}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isLoading || !connected}
              className="w-full"
            >
              {isLoading ? "Creating..." : "Create Challenge"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
