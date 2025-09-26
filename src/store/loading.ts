import { create } from "zustand";

interface LoadingProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const LoadingStore = create<LoadingProps>((set) => ({
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
