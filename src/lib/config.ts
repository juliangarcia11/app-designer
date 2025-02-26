import { DesignDocument, RequirementQuestion } from "./types";

export const INITIAL_QUESTIONS: RequirementQuestion[] = [
  {
    id: "purpose",
    question:
      "What is the primary purpose of the application you want to build?",
    category: "business",
  },
  {
    id: "target_users",
    question: "Who are the target users of this application?",
    category: "user",
  },
  {
    id: "key_features",
    question:
      "What are the 3-5 most important features the application should have?",
    category: "functional",
    followUpQuestions: ["feature_priority", "feature_details"],
  },
  {
    id: "tech_constraints",
    question:
      "Are there any specific technical constraints or requirements for this project?",
    category: "technical",
  },
  {
    id: "design_preferences",
    question:
      "Do you have any design preferences or existing brand guidelines to follow?",
    category: "design",
  },
];

export const DESIGN_DOCUMENT_TEMPLATE: DesignDocument = {
  title: "Application Design Document",
  sections: [
    {
      id: "executive_summary",
      title: "Executive Summary",
      content: "",
      dependsOnRequirements: ["purpose", "target_users"],
      status: "pending",
    },
    {
      id: "user_requirements",
      title: "User Requirements",
      content: "",
      dependsOnRequirements: ["target_users", "key_features"],
      status: "pending",
    },
    {
      id: "technical_architecture",
      title: "Technical Architecture",
      content: "",
      dependsOnRequirements: ["tech_constraints", "key_features"],
      status: "pending",
    },
    {
      id: "ui_ux_design",
      title: "UI/UX Design",
      content: "",
      dependsOnRequirements: ["design_preferences", "target_users"],
      status: "pending",
    },
    {
      id: "implementation_plan",
      title: "Implementation Plan",
      content: "",
      dependsOnRequirements: ["key_features", "tech_constraints"],
      status: "pending",
    },
  ],
  status: "draft",
  version: 1,
  lastUpdated: Date.now(),
};
