// src/lib/ollama.ts
import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import {
  RequirementQuestion,
  UserResponse,
  DesignSection,
  WorkflowState,
} from "./types";

// Initialize the LLM with Ollama
const createLLM = () =>
  new ChatOllama({
    baseUrl: "http://localhost:11434", // Default Ollama URL
    model: "llama3.2", // Use an appropriate model
    temperature: 0.7,
  });

// Create a prompt for generating follow-up questions
const createFollowUpQuestionsPrompt = () => {
  return ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      `You are an expert software requirements analyst. Based on the user's response, 
      generate 1-3 follow-up questions that would help clarify or expand on their answer. 
      The questions should be specific and directly related to their response.
      
      Return the questions in the following JSON format:
      - an object with a "questions" key containing an array of question objects
      - each question object should have an "id", "question", and "category" key
      - the "id" should be a unique identifier for the question
      - the "question" should be the text of the question
      - the "category" should be a relevant category for the question`
    ),
    HumanMessagePromptTemplate.fromTemplate(
      `User's question: {question}\n\nUser's response: {response}\n\nGenerate follow-up questions.`
    ),
  ]);
};

// Create a prompt for generating content for a design document section
const createDesignSectionPrompt = () => {
  return ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      `You are an expert software architect. Based on the user's requirements, 
      generate comprehensive content for the {sectionTitle} section of a software design document.
      The content should be detailed, well-structured, and directly address the requirements provided.`
    ),
    HumanMessagePromptTemplate.fromTemplate(
      `User requirements:\n{requirements}\n\nGenerate content for the {sectionTitle} section.`
    ),
  ]);
};

// Create a prompt for generating clarification questions for a design section
const createClarificationQuestionsPrompt = () => {
  return ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      `You are an expert software architect. You're working on the {sectionTitle} section of a design document,
      but you need more information from the user. Generate 1-3 specific questions that would help you
      complete this section more effectively.
      
      Return the questions in the following JSON format:
      - an object with a "questions" key containing an array of question objects
      - each question object should have an "id", "question", and "category" key
      - the "id" should be a unique identifier for the question
      - the "question" should be the text of the question
      - the "category" should be a relevant category for the question`
    ),
    HumanMessagePromptTemplate.fromTemplate(
      `Current section content: {sectionContent}\n\nUser requirements so far: {requirements}\n\nGenerate clarification questions.`
    ),
  ]);
};

// Function to generate follow-up questions based on a user response
export const generateFollowUpQuestions = async (
  question: RequirementQuestion,
  response: string
): Promise<RequirementQuestion[]> => {
  const llm = createLLM();
  const prompt = createFollowUpQuestionsPrompt();
  const outputParser = new StringOutputParser();

  const chain = RunnableSequence.from([prompt, llm, outputParser]);

  try {
    const result = await chain.invoke({
      question: question.question,
      response: response,
    });

    const parsedResult = JSON.parse(result);
    return parsedResult.questions;
  } catch (error) {
    console.error("Error generating follow-up questions:", error);
    return [];
  }
};

// Function to generate content for a design document section based on gathered requirements
export const generateDesignSectionContent = async (
  section: DesignSection,
  responses: UserResponse[]
): Promise<string> => {
  const llm = createLLM();
  const prompt = createDesignSectionPrompt();
  const outputParser = new StringOutputParser();

  // Filter and format relevant user responses
  const relevantResponses = responses.filter((r) =>
    section.dependsOnRequirements.includes(r.questionId)
  );

  const formattedRequirements = relevantResponses
    .map((r) => `Q: ${r.questionId}\nA: ${r.response}`)
    .join("\n\n");

  const chain = RunnableSequence.from([prompt, llm, outputParser]);

  try {
    const result = await chain.invoke({
      sectionTitle: section.title,
      requirements: formattedRequirements,
    });

    return result;
  } catch (error) {
    console.error(`Error generating content for ${section.title}:`, error);
    return "";
  }
};

// Function to generate clarification questions for a design section
export const generateClarificationQuestions = async (
  section: DesignSection,
  responses: UserResponse[]
): Promise<RequirementQuestion[]> => {
  const llm = createLLM();
  const prompt = createClarificationQuestionsPrompt();
  const outputParser = new StringOutputParser();

  // Format relevant user responses
  const relevantResponses = responses.filter((r) =>
    section.dependsOnRequirements.includes(r.questionId)
  );

  const formattedRequirements = relevantResponses
    .map((r) => `Q: ${r.questionId}\nA: ${r.response}`)
    .join("\n\n");

  const chain = RunnableSequence.from([prompt, llm, outputParser]);

  try {
    const result = await chain.invoke({
      sectionTitle: section.title,
      sectionContent: section.content,
      requirements: formattedRequirements,
    });

    const parsedResult = JSON.parse(result);
    return parsedResult.questions.map((q: any) => ({
      ...q,
      id: `clarification_${section.id}_${q.id}`,
    }));
  } catch (error) {
    console.error(
      `Error generating clarification questions for ${section.title}:`,
      error
    );
    return [];
  }
};
