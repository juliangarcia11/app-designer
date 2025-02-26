import { useState } from "react";
import { WorkflowState } from "@/lib/types";
import {
  createInitialState,
  getNextQuestion,
  isDesignDocumentReady,
  processUserResponse,
} from "@/lib/workflow-manager";

// Custom hook to manage workflow state and processing
export function useWorkflow() {
  const [state, setState] = useState<WorkflowState>(createInitialState());
  const [isProcessing, setIsProcessing] = useState(false);

  const nextQuestion = getNextQuestion(state);
  const designDocumentReady = isDesignDocumentReady(state);

  // Calculate progress
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
      const updatedState = await processUserResponse(
        state,
        nextQuestion.id,
        response
      );

      setState(updatedState);

      return checkForNewCompletedSections(updatedState);
    } catch (error) {
      console.error("Error processing response:", error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Check if any new sections were completed that would warrant switching tabs
  const checkForNewCompletedSections = (
    updatedState: WorkflowState
  ): boolean => {
    return updatedState.designDocument.sections.some(
      (section) =>
        section.status === "completed" &&
        !state.designDocument.sections.find((s) => s.id === section.id)?.content
    );
  };

  return {
    state,
    isProcessing,
    nextQuestion,
    designDocumentReady,
    totalQuestions,
    completedQuestionsCount,
    progressPercentage,
    handleResponseSubmit,
  };
}
