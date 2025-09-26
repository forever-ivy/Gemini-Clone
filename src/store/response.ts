import { create } from "zustand";

interface ResponseState {
  thoughtResponse: string;
  answerResponse: string;
  setThoughtResponse: (response: string) => void;
  setAnswerResponse: (response: string) => void;
}

export const ResponseStore = create<ResponseState>((set) => ({
  thoughtResponse: "",
  answerResponse: "",
  setThoughtResponse: (response) => set({ thoughtResponse: response }),
  setAnswerResponse: (response) => set({ answerResponse: response }),
}));
