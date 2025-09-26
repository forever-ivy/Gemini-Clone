import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// 加载 .env 文件
dotenv.config();

// 从环境变量获取 API Key
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY not found in environment variables");
  console.error("Please add GEMINI_API_KEY=your-api-key to .env file");
  process.exit(1);
}

console.log("✅ API Key loaded successfully");

const ai = new GoogleGenAI({
  apiKey: apiKey,
});

async function main() {
  try {
    console.log("🤖 Calling Gemini API...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "where is Managua?",
    });
    console.log("📝 Response:", response.text);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

main();
