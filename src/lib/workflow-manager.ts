import {
  WorkflowState,
  RequirementQuestion,
  UserResponse,
  DesignSection,
} from "./types";
import { INITIAL_QUESTIONS, DESIGN_DOCUMENT_TEMPLATE } from "./config";
import {
  generateFollowUpQuestions,
  generateDesignSectionContent,
  generateClarificationQuestions,
} from "./ollama";

// Pure function to create the initial workflow state
export const createInitialState = (): WorkflowState => ({
  requirementGathering: {
    responses: [],
    pendingQuestions: [...INITIAL_QUESTIONS],
    completedQuestions: [],
  },
  designDocument: { ...DESIGN_DOCUMENT_TEMPLATE },
});

// Pure function to record a user response
export const recordResponse = (
  state: WorkflowState,
  questionId: string,
  responseText: string
): WorkflowState => {
  const response: UserResponse = {
    questionId,
    response: responseText,
    timestamp: Date.now(),
  };

  // Find the question that was answered
  const answeredQuestion = state.requirementGathering.pendingQuestions.find(
    (q) => q.id === questionId
  );

  if (!answeredQuestion) {
    return state; // Question not found, return unchanged state
  }

  // Move the question from pending to completed
  const updatedPendingQuestions =
    state.requirementGathering.pendingQuestions.filter(
      (q) => q.id !== questionId
    );
  const updatedCompletedQuestions = [
    ...state.requirementGathering.completedQuestions,
    answeredQuestion,
  ];

  // Add response
  const updatedResponses = [...state.requirementGathering.responses, response];

  return {
    ...state,
    requirementGathering: {
      responses: updatedResponses,
      pendingQuestions: updatedPendingQuestions,
      completedQuestions: updatedCompletedQuestions,
    },
  };
};

// Pure function to update a design section's content
export const updateDesignSection = (
  state: WorkflowState,
  sectionId: string,
  content: string,
  status: DesignSection["status"] = "completed"
): WorkflowState => {
  const updatedSections = state.designDocument.sections.map((section) =>
    section.id === sectionId ? { ...section, content, status } : section
  );

  return {
    ...state,
    designDocument: {
      ...state.designDocument,
      sections: updatedSections,
      lastUpdated: Date.now(),
    },
  };
};

// Add clarification questions to a section
export const addClarificationQuestions = (
  state: WorkflowState,
  sectionId: string,
  questions: RequirementQuestion[]
): WorkflowState => {
  const updatedSections = state.designDocument.sections.map((section) =>
    section.id === sectionId
      ? {
          ...section,
          status: "needs_clarification" as const,
          clarificationQuestions: questions,
        }
      : section
  );

  return {
    ...state,
    designDocument: {
      ...state.designDocument,
      sections: updatedSections,
    },
  };
};

// Add follow-up questions to the pending questions
export const addFollowUpQuestions = (
  state: WorkflowState,
  questions: RequirementQuestion[]
): WorkflowState => {
  return {
    ...state,
    requirementGathering: {
      ...state.requirementGathering,
      pendingQuestions: [
        ...state.requirementGathering.pendingQuestions,
        ...questions,
      ],
    },
  };
};

// Effect function that processes a user response and generates follow-up questions
export const processUserResponse = async (
  state: WorkflowState,
  questionId: string,
  responseText: string
): Promise<WorkflowState> => {
  // Record the response
  let updatedState = recordResponse(state, questionId, responseText);

  // Find the question that was answered
  const answeredQuestion =
    state.requirementGathering.pendingQuestions.find(
      (q) => q.id === questionId
    ) ||
    state.requirementGathering.completedQuestions.find(
      (q) => q.id === questionId
    );

  if (!answeredQuestion) {
    return updatedState;
  }

  // Generate follow-up questions if needed
  if (answeredQuestion.followUpQuestions?.length) {
    const followUpQuestions = await generateFollowUpQuestions(
      answeredQuestion,
      responseText
    );

    if (followUpQuestions.length > 0) {
      updatedState = addFollowUpQuestions(updatedState, followUpQuestions);
    }
  }

  // Check if we can update any design document sections
  for (const section of updatedState.designDocument.sections) {
    if (section.status === "pending") {
      // Check if all required questions for this section have been answered
      const allRequirementsMet = section.dependsOnRequirements.every((reqId) =>
        updatedState.requirementGathering.responses.some(
          (resp) => resp.questionId === reqId
        )
      );

      if (allRequirementsMet) {
        // Generate content for this section
        const content = await generateDesignSectionContent(
          section,
          updatedState.requirementGathering.responses
        );

        updatedState = updateDesignSection(
          updatedState,
          section.id,
          content,
          "in_progress"
        );

        // Generate clarification questions
        const clarificationQuestions = await generateClarificationQuestions(
          section,
          updatedState.requirementGathering.responses
        );

        if (clarificationQuestions.length > 0) {
          updatedState = addClarificationQuestions(
            updatedState,
            section.id,
            clarificationQuestions
          );

          // Add clarification questions to pending questions
          updatedState = addFollowUpQuestions(
            updatedState,
            clarificationQuestions
          );
        } else {
          // No clarification needed, mark as completed
          updatedState = updateDesignSection(
            updatedState,
            section.id,
            content,
            "completed"
          );
        }
      }
    }
  }

  // Update design document status
  const allSectionsCompleted = updatedState.designDocument.sections.every(
    (section) => section.status === "completed"
  );

  if (allSectionsCompleted) {
    updatedState = {
      ...updatedState,
      designDocument: {
        ...updatedState.designDocument,
        status: "completed",
        version: updatedState.designDocument.version + 1,
        lastUpdated: Date.now(),
      },
    };
  } else {
    const anySectionInProgress = updatedState.designDocument.sections.some(
      (section) =>
        section.status === "in_progress" ||
        section.status === "needs_clarification"
    );

    if (anySectionInProgress) {
      updatedState = {
        ...updatedState,
        designDocument: {
          ...updatedState.designDocument,
          status: "in_progress",
          lastUpdated: Date.now(),
        },
      };
    }
  }

  return updatedState;
};

// Function to get the next question to ask the user
export const getNextQuestion = (
  state: WorkflowState
): RequirementQuestion | null => {
  if (state.requirementGathering.pendingQuestions.length === 0) {
    return null;
  }

  // Prioritize questions related to sections that need clarification
  const sectionsNeedingClarification = state.designDocument.sections.filter(
    (section) => section.status === "needs_clarification"
  );

  for (const section of sectionsNeedingClarification) {
    if (section.clarificationQuestions?.length) {
      const clarificationQuestionId = section.clarificationQuestions[0].id;
      const question = state.requirementGathering.pendingQuestions.find(
        (q) => q.id === clarificationQuestionId
      );

      if (question) {
        return question;
      }
    }
  }

  // Otherwise, return the first pending question
  return state.requirementGathering.pendingQuestions[0];
};

// Function to check if the design document is ready for review
export const isDesignDocumentReady = (state: WorkflowState): boolean => {
  return state.designDocument.status === "completed";
};

// Function to get a formatted design document for display
export const getFormattedDesignDocument = (state: WorkflowState): string => {
  const { title, sections, version, lastUpdated } = state.designDocument;

  const formattedDate = new Date(lastUpdated).toLocaleString();

  let document = `# ${title}\n\n`;
  document += `Version: ${version} | Last Updated: ${formattedDate}\n\n`;

  for (const section of sections) {
    document += `## ${section.title}\n\n`;
    document += `${section.content}\n\n`;
  }

  return document;
};
