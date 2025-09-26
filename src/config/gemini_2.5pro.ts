import { GoogleGenAI } from "@google/genai";
import { ResponseStore } from "../store/response";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({
  apiKey: apiKey,
});

export function useGeminiAPI() {
  // 移除对 promptStore 的依赖，只在调用时接受最新 prompt
  const { setThoughtResponse, setAnswerResponse } = ResponseStore();

  const callAPI = async (prompt: string, signal?: AbortSignal) => {
    const apiCall = ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 1024,
          includeThoughts: true,
          // Turn off thinking:
          // thinkingBudget: 0
          // Turn on dynamic thinking:
          // thinkingBudget: -1
        },
      },
    });

    const response = signal
      ? await Promise.race([
          apiCall,
          new Promise((_, reject) => {
            signal.addEventListener("abort", () => {
              reject(new Error("Request aborted"));
            });
          }),
        ])
      : await apiCall;

    if (signal?.aborted) {
      throw new Error("Request aborted");
    }

    for (const part of response.candidates![0].content!.parts!) {
      if (signal?.aborted) {
        throw new Error("Request aborted");
      }
      if (!part.text) {
        continue;
      } else if (part.thought) {
        setThoughtResponse(part.text);
      } else {
        setAnswerResponse(part.text);
      }
    }
  };

  return { callAPI };
}
