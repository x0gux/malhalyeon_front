import { create } from 'zustand';

interface TestState {
  targetName: string;
  csvfile : File | null;
  setTargetName: (name: string) => void;
  setCsvfile: (file: File) => void;
  resultData : any;
  setResultData : (data: any) => void;
  answers: { id: number; choice: string }[];
  addAnswer: (answer: { id: number; choice: string }) => void;
  clearAnswers: () => void;
}

export const useTestStore = create<TestState>((set) => ({
  targetName: '',
  csvfile : null,
  setTargetName: (name: string) => set({ targetName: name }),
  setCsvfile: (file: File) => set({ csvfile: file }),
  resultData : null,
  setResultData : (data: any) => set({ resultData: data }),
  answers: [],
  addAnswer: (answer) => set((state) => ({
    answers: [...state.answers.filter(a => a.id !== answer.id), answer]
  })),
  clearAnswers: () => set({ answers: [] }),
}));

