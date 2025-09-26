import { create } from "zustand";

interface PromptState {
  contextprompt: string;
  setPrompt: (prompt: string) => void;
}

// 导出 store 实例，而不是 Hook
export const promptStore = create<PromptState>((set) => ({
  contextprompt: "",
  setPrompt: (prompt) => set({ contextprompt: prompt }),
}));
