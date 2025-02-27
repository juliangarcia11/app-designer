import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DesignDocumentView } from "@/components/design-document-view";
import { ExportButton } from "@/components/export-button";
import { OllamaStatusAlert } from "@/components/ollama-status-alert";
import { ProgressIndicator } from "@/components/progress-indicator";
import { QuestionPrompt } from "@/components/question-prompt";
import { RequirementsComplete } from "@/components/requirements-complete";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeProvider } from "@/hooks/use-theme";
import { useWorkflow } from "@/hooks/use-workflow";

import "./App.css";

function App(): React.ReactElement {
  const {
    state,
    isProcessing,
    nextQuestion,
    designDocumentReady,
    totalQuestions,
    completedQuestionsCount,
    progressPercentage,
    handleResponseSubmit,
  } = useWorkflow();

  const [activeTab, setActiveTab] = useState<"requirements" | "document">(
    "requirements"
  );

  const handleQuestionSubmit = async (response: string) => {
    const shouldSwitchTab = await handleResponseSubmit(response);
    if (shouldSwitchTab) {
      setActiveTab("document");
    }
  };

  const handleViewDocument = () => setActiveTab("document");

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="container mx-auto py-8 px-4">
        <OllamaStatusAlert />

        <h1 className="text-2xl font-bold mb-6 text-center">
          Intelligent Application Design Assistant
        </h1>

        <ProgressIndicator
          completed={completedQuestionsCount}
          total={totalQuestions}
          percentage={progressPercentage}
        />

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "requirements" | "document")
          }
          className="w-full"
        >
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
                onSubmit={handleQuestionSubmit}
                isLoading={isProcessing}
              />
            ) : (
              <RequirementsComplete onViewDocument={handleViewDocument} />
            )}
          </TabsContent>

          <TabsContent value="document" className="mt-6">
            <DesignDocumentView document={state.designDocument} />

            {designDocumentReady && (
              <ExportButton document={state.designDocument} />
            )}
          </TabsContent>
        </Tabs>
      </div>
      <div className="absolute bottom-4 left-4">
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}

export default App;
