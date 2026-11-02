# AI Prompt Engineer Agent

An AI-powered conversational agent that helps users create, improve, and refine prompts for AI agents through natural language.

Instead of writing a complete specification upfront, users describe what they want, answer clarifying questions when necessary, and iteratively improve the generated prompt.

## Features

- **Conversational prompt creation:** Build prompts through a natural back-and-forth conversation.
- **Requirement gathering:** Identify the agent's role, objectives, tasks, constraints, and expected output.
- **Context-aware refinement:** Update the current prompt without losing previously established requirements.
- **Prompt shortening:** Produce concise versions while preserving essential instructions.
- **Prompt expansion:** Add details, methodology, constraints, and output specifications.
- **Research-oriented prompting:** Support requirements for source verification, citations, and uncertainty handling.
- **Flexible output:** Adapt the prompt structure to different agent types and use cases.

## Example Use Case

A user wants to create a research agent for competitive analysis.

The conversation might look like this:

1. User: "Help me create a prompt for a research agent."
2. Agent: "What should the agent research?"
3. User: "SaaS competitors in Europe."
4. Agent: "What information should it compare?"
5. User: "Pricing, features, and marketing."
6. Agent: Generates a structured research prompt.
7. User: "Make it shorter."
8. Agent: Revises the generated prompt while preserving the important requirements.

## Technology Stack

- JavaScript
- Node.js
- LangChain
- Google Gemini through `@langchain/google`
- Express.js for an HTTP API, if the agent is exposed as a backend endpoint
- A conversational interface, such as a web chatbot

## Project Structure

An example project structure:

\`\`\`text
prompt-engineer-agent/
├── src/
│   ├── agents/
│   │   └── promptEngineer.js
│   ├── lib/
│   │   └── prompt.js
│   ├── routes/
│   │   └── chat.js
│   └── app.js
├── .env
├── .gitignore
├── package.json
└── README.md
\`\`\`

Adapt the structure to your existing application.

## Installation

### 1. Install dependencies

Install the required packages for your chosen implementation:

\`\`\`bash
npm install express dotenv @langchain/core @langchain/google
\`\`\`

Use an appropriate development dependency, such as `nodemon`, if you want automatic server restarts during development.

### 2. Configure environment variables

Create a `.env` file:

\`\`\`env
GOOGLE_API_KEY=your_google_api_key
PORT=3000
\`\`\`

Replace the placeholder with your Google API key. Never commit real API keys to version control.

### 3. Configure the model

Initialize the model with the `ChatGoogle` integration supported by your installed package version.

For example:

\`\`\`javascript
import "dotenv/config";
import { ChatGoogle } from "@langchain/google";

const llm = new ChatGoogle({
  model: "gemini-3.7-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.3,
});
\`\`\`

Confirm model availability and constructor options against the version of the Google integration installed in your project.

## How It Works

### Step 1: Receive a user message

The chatbot receives a message describing the user's goal or requesting a change to an existing prompt.

### Step 2: Maintain conversation context

The application supplies relevant previous messages and the current prompt to the model. This enables follow-up instructions such as "make it shorter" to refer to the correct prompt.

### Step 3: Gather missing requirements

The agent asks a focused follow-up question when essential details are missing. It should avoid repeatedly asking for information already provided.

### Step 4: Generate or revise the prompt

The model generates a new prompt or updates the existing one according to the user's instructions.

### Step 5: Return the result

The API returns the assistant's response to the frontend, which displays it in the chat interface.

## API Design

A typical chat endpoint can accept a conversation identifier and a user message:

\`POST /api/chat\`

Example request:

\`\`\`json
{
  "conversationId": "conversation-123",
  "message": "Help me create a prompt for a research agent."
}
\`\`\`

Example response:

\`\`\`json
{
  "conversationId": "conversation-123",
  "reply": "What topic should your research agent investigate?"
}
\`\`\`

These JSON objects illustrate the proposed API contract. Your implementation must define how conversation identifiers and messages are validated and stored.

## Conversation State

For a basic implementation, maintain the conversation history for each active conversation.

For production, consider persistent storage so conversations can continue across sessions or server restarts.

Recommended state fields include:

- `conversationId`: Unique conversation identifier.
- `messages`: Relevant conversation history.
- `currentPrompt`: The latest generated or revised prompt.
- `status`: Whether requirements are still being gathered or the prompt is ready.

Do not treat the model's memory as persistent storage. The application should explicitly manage conversation history.

## Prompt Engineering Guidelines

The system prompt should instruct the agent to:

1. Understand the user's intended outcome.
2. Ask concise clarifying questions when necessary.
3. Produce actionable, specific prompts.
4. Preserve established requirements during revisions.
5. Shorten prompts without removing essential constraints.
6. Avoid inventing user requirements or research findings.
7. Return the complete updated prompt when asked to revise it.
8. Keep explanations brief unless more detail is requested.

## Error Handling

The backend should handle:

- Missing or invalid user messages.
- Missing API credentials.
- Model API errors and rate limits.
- Network timeouts.
- Empty or malformed model responses.
- Oversized conversation histories.

Return appropriate HTTP status codes and useful error messages without exposing secrets, stack traces, or sensitive provider details to clients.

## Security Considerations

- Store API keys in environment variables.
- Exclude `.env` from version control.
- Validate incoming request bodies.
- Apply request-size limits and rate limiting.
- Avoid allowing one user's conversation history to be accessed by another.
- Add authentication if the API is not intended for public anonymous use.
- Apply appropriate retention policies to stored conversations.

## Testing Checklist

- [ ] The agent starts a new prompt-building conversation.
- [ ] The agent asks relevant questions when requirements are missing.
- [ ] The agent generates a prompt when enough information is available.
- [ ] The agent can shorten a previously generated prompt.
- [ ] The agent preserves essential requirements during revisions.
- [ ] The agent handles changes to the research scope.
- [ ] The backend handles missing messages and API failures.
- [ ] Separate conversations do not share unintended context.
