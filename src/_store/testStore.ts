import { create } from 'zustand';

interface TestState {
  targetName: string;
  csvfile : File | null;
  setTargetName: (name: string) => void;
  setCsvfile: (file: File) => void;
  resultData : any;
  setResultData : (data: any) => void;
}

export const useTestStore = create<TestState>((set) => ({
  targetName: '',
  csvfile : null,
  setTargetName: (name: string) => set({ targetName: name }),
  setCsvfile: (file: File) => set({ csvfile: file }),
  resultData : null,
  setResultData : (data: any) => set({ resultData: data }),
}));