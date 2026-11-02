
import "dotenv/config";
import express from "express";
import { promptAgent } from "./promptAgent.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    // Validate the current message
    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        error: "Please provide a valid message.",
      });
    }

    // Validate conversation history
    if (
      !Array.isArray(history) ||
      history.length > 20 ||
      !history.every(
        (item) =>
          item &&
          ["user", "assistant"].includes(item.role) &&
          typeof item.content === "string" &&
          item.content.length <= 20000
      )
    ) {
      return res.status(400).json({
        error: "Invalid conversation history.",
      });
    }

    const reply = await promptAgent(message, history);

    return res.json({
      reply,
    });
  } catch (error) {
    console.error("Chat endpoint failed:", error);

    return res.status(500).json({
      error: "The assistant could not respond. Please try again.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
