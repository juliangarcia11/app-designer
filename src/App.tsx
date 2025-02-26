import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuestionPrompt } from "@/components/question-prompt";
import { DesignDocumentView } from "@/components/design-document-view";
import { OllamaStatusAlert } from "@/components/ollama-status-alert";
import {
  createInitialState,
  getNextQuestion,
  processUserResponse,
  isDesignDocumentReady,
} from "@/lib/workflow-manager";
import { WorkflowState } from "@/lib/types";
import "./App.css";

function App() {
  const [state, setState] = React.useState<WorkflowState>(createInitialState());
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("requirements");

  const nextQuestion = getNextQuestion(state);
  const designDocumentReady = isDesignDocumentReady(state);

  // Calculate progress percentage
  const totalQuestions =
    state.requirementGathering.completedQuestions.length +
    state.requirementGathering.pendingQuestions.length;
  const completedQuestionsCount =
    state.requirementGathering.completedQuestions.length;
  const progressPercentage =
    totalQuestions > 0 ? (completedQuestionsCount / totalQuestions) * 100 : 0;

  const handleResponseSubmit = async (response: string) => {
    if (!nextQuestion) return;

    setIsProcessing(true);
    try {
      // Process the response and update the state
      const updatedState = await processUserResponse(
        state,
        nextQuestion.id,
        response
      );

      setState(updatedState);

      // If a section of the design document has been completed, switch to the document tab
      if (
        updatedState.designDocument.sections.some(
          (section) =>
            section.status === "completed" &&
            !state.designDocument.sections.find((s) => s.id === section.id)
              ?.content
        )
      ) {
        setActiveTab("document");
      }
    } catch (error) {
      console.error("Error processing response:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <OllamaStatusAlert />

      <h1 className="text-2xl font-bold mb-6 text-center">
        Intelligent Application Design Assistant
      </h1>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Requirements gathering progress
          </span>
          <span className="text-sm">
            {completedQuestionsCount} / {totalQuestions} questions
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger
            value="document"
            disabled={state.designDocument.status === "draft"}
          >
            Design Document
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requirements" className="mt-6">
          {nextQuestion ? (
            <QuestionPrompt
              question={nextQuestion}
              onSubmit={handleResponseSubmit}
              isLoading={isProcessing}
            />
          ) : (
            <div className="text-center p-8">
              <h3 className="text-xl font-semibold mb-4">
                All questions have been answered!
              </h3>
              <p className="mb-6">
                We have gathered all the information needed to complete your
                design document.
              </p>
              <Button onClick={() => setActiveTab("document")}>
                View Design Document
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="document" className="mt-6">
          <DesignDocumentView document={state.designDocument} />

          {designDocumentReady && (
            <div className="mt-6 flex justify-center">
              <Button>Export Design Document</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
