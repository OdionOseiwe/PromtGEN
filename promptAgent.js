
import "dotenv/config";

import { ChatGoogle } from "@langchain/google";
import {
  HumanMessage,
  SystemMessage,AIMessage
} from "@langchain/core/messages";

import { PROMPT_ENGINEER_INSTRUCTIONS } from "./src/lib/prompt.js";

const llm = new ChatGoogle({
  model: "gemini-3.7-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.3,
});

export const promptAgent = async (userInput,  history = []) => {
  if (typeof userInput !== "string" || !userInput.trim()) {
    throw new Error("Please provide a valid message.");
  }
  try{
  const messages = [
    new SystemMessage(PROMPT_ENGINEER_INSTRUCTIONS),

    ...history.map((message) => {
      if (message.role === "user") {
        return new HumanMessage(message.content);
      }

      if (message.role === "assistant") {
        return new AIMessage(message.content);
      }

      throw new Error(`Unsupported message role: ${message.role}`);
    }),

    new HumanMessage(userInput.trim()),
  ];


    const response = await llm.invoke(messages);

    if (typeof response.content !== "string") {
      throw new Error("The model returned a non-text response.");
    }

    return response.content;
  } catch (error) {
    console.error("Prompt agent failed:", error);
    throw error;
  }
};
