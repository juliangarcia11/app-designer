export type RequirementQuestion = {
  id: string;
  question: string;
  category: "functional" | "technical" | "design" | "user" | "business";
  dependsOn?: string[]; // IDs of questions that this depends on
  followUpQuestions?: string[]; // IDs of potential follow-up questions
};

export type UserResponse = {
  questionId: string;
  response: string;
  timestamp: number;
};

export type RequirementGathering = {
  responses: UserResponse[];
  pendingQuestions: RequirementQuestion[];
  completedQuestions: RequirementQuestion[];
};

export type DesignSection = {
  id: string;
  title: string;
  content: string;
  dependsOnRequirements: string[]; // Question IDs this section depends on
  status: "pending" | "in_progress" | "completed" | "needs_clarification";
  clarificationQuestions?: RequirementQuestion[];
};

export type DesignDocument = {
  title: string;
  sections: DesignSection[];
  status: "draft" | "in_progress" | "review" | "completed";
  version: number;
  lastUpdated: number;
};

export type WorkflowState = {
  requirementGathering: RequirementGathering;
  designDocument: DesignDocument;
};
