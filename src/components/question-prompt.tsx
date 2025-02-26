import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RequirementQuestion } from "@/lib/types";

interface QuestionPromptProps {
  question: RequirementQuestion;
  onSubmit: (response: string) => void;
  isLoading: boolean;
}

export function QuestionPrompt({
  question,
  onSubmit,
  isLoading,
}: QuestionPromptProps) {
  const [response, setResponse] = useState("");

  const handleSubmit = () => {
    if (response.trim() === "") return;
    onSubmit(response);
    setResponse("");
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "functional":
        return "⚙️";
      case "technical":
        return "🔧";
      case "design":
        return "🎨";
      case "user":
        return "👤";
      case "business":
        return "💼";
      default:
        return "❓";
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{getCategoryIcon(question.category)}</span>
          <span>Question</span>
        </CardTitle>
        <CardDescription>Please provide a detailed response</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-lg font-medium">{question.question}</div>
        <Textarea
          placeholder="Type your answer here..."
          className="min-h-32"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={response.trim() === "" || isLoading}
        >
          {isLoading ? "Processing..." : "Submit Answer"}
        </Button>
      </CardFooter>
    </Card>
  );
}
