"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { generateChallenge } from "@/actions/generate";
import { ChallengeResponse } from "@/actions/generate";
import { challengeFormSchema, ChallengeFormValues } from "@/types/form";

export function CreateChallenge() {
  const { toast } = useToast();
  const [generatedChallenge, setGeneratedChallenge] =
    useState<ChallengeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ChallengeFormValues>({
    resolver: zodResolver(challengeFormSchema),
    defaultValues: {
      topic: "",
    },
  });

  async function onSubmit(data: ChallengeFormValues) {
    setIsLoading(true);
    try {
      const result = await generateChallenge(data.topic);

      if (result.success && result.challenge) {
        setGeneratedChallenge(result.challenge);
        toast({
          title: "Challenge generated!",
          description: "Review the generated challenge below.",
        });
        // Optionally clear the form
        form.reset();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate challenge",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating challenge:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Challenge Topic</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a topic..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Challenge"}
          </Button>
        </form>
      </Form>

      {generatedChallenge && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">{generatedChallenge.title}</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Description:</h4>
              <p>{generatedChallenge.description}</p>
            </div>
            <div>
              <h4 className="font-semibold">Reward:</h4>
              <p>{generatedChallenge.reward} USDC</p>
            </div>
            {generatedChallenge.template && (
              <div>
                <h4 className="font-semibold">Template:</h4>
                <p className="bg-muted p-3 rounded">
                  {generatedChallenge.template}
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={() => setGeneratedChallenge(null)}>Clear</Button>
              <Button variant="secondary">Save Challenge</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
