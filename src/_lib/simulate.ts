import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Choice {
  id: number;
  text: string;
  strategy: string;
  recommended: boolean;
}

export interface Feedback {
  score: number;
  label: string;
  feedback: string;
  tip: string | null;
}

export interface SimulationStartResponse {
  message: string;
  turn: number;
}

export interface SimulationReplyResponse {
  opponent_message: string;
  choices: Choice[];
  feedback: Feedback | null;
  turn: number;
}

export interface SimulationResultResponse {
  total_score: number;
  grade: string;
  title: string;
  summary: string;
  best_response: string;
  worst_response: string;
  advice: string;
}

export const startSimulation = async (
  analysisItems: any[],
  dangerLevel: string
): Promise<SimulationStartResponse> => {
  const response = await axios.post(`${API_URL}/simulate/start`, {
    analysis_items: analysisItems,
    danger_level: dangerLevel,
  });
  return response.data;
};

export const replySimulation = async (
  analysisItems: any[],
  dangerLevel: string,
  conversationHistory: any[],
  userMessage: string
): Promise<SimulationReplyResponse> => {
  const response = await axios.post(`${API_URL}/simulate/reply`, {
    analysis_items: analysisItems,
    danger_level: dangerLevel,
    conversation_history: conversationHistory,
    user_message: userMessage,
  });
  return response.data;
};

export const getResultSimulation = async (
  analysisItems: any[],
  conversationHistory: any[],
  scoreHistory: number[]
): Promise<SimulationResultResponse> => {
  const response = await axios.post(`${API_URL}/simulate/result`, {
    analysis_items: analysisItems,
    conversation_history: conversationHistory,
    score_history: scoreHistory,
  });
  return response.data;
};
