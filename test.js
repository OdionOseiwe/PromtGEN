
import { promptAgent } from "./promptAgent.js"

const history = [];

async function chat(userInput) {
  const answer = await promptAgent(userInput, history);

  history.push(
    { role: "user", content: userInput },
    { role: "assistant", content: answer }
  );

  console.log("\nYou:", userInput);
  console.log("\nAgent:", answer);
}

await chat("Help me create a prompt for a research agent.");
await chat("It should research SaaS competitors in Europe.");
await chat("Compare their pricing, features, and marketing.");
await chat("Make the prompt shorter.");
