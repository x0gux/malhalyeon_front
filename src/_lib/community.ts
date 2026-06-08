import axios from 'axios';
import { auth } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Post {
  id: string;
  uid: string;
  display_name: string;
  photo_url: string;
  title: string;
  content: string;
  analyze_id: string | null;
  danger_level: string | null;
  is_anonymous: boolean;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  uid: string;
  display_name: string;
  photo_url: string;
  content: string;
  created_at: string;
}

export class AnalyzeRequiredError extends Error {
  constructor() {
    super('글을 쓰려면 먼저 \'망할연\' 분석 기능을 1회 이상 이용해야 합니다.');
    this.name = 'AnalyzeRequiredError';
  }
}

export class AuthRequiredError extends Error {
  constructor() {
    super('로그인이 필요합니다.');
    this.name = 'AuthRequiredError';
  }
}

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
};

const getRequiredAuthHeaders = async (): Promise<Record<string, string>> => {
  const user = auth.currentUser;
  if (!user) throw new AuthRequiredError();
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
};

export const getPosts = async (limit = 20, lastId?: string) => {
  const params: Record<string, string | number> = { limit };
  if (lastId) params.last_id = lastId;
  const res = await axios.get(`${API_URL}/posts`, { params });
  return res.data as { posts: Post[]; has_more: boolean; last_id: string | null };
};

export const getPost = async (id: string): Promise<Post> => {
  const res = await axios.get(`${API_URL}/posts/${id}`);
  return res.data;
};

export const createPost = async (data: {
  title: string;
  content: string;
  analyze_id?: string | null;
  danger_level?: string | null;
  is_anonymous: boolean;
}): Promise<Post> => {
  try {
    const headers = await getRequiredAuthHeaders();
    const res = await axios.post(`${API_URL}/posts`, data, { headers });
    return res.data;
  } catch (err: any) {
    if (err instanceof AuthRequiredError) throw err;
    if (err.response?.data?.code === 'ANALYZE_REQUIRED') throw new AnalyzeRequiredError();
    if (err.response?.status === 401) throw new AuthRequiredError();
    throw err;
  }
};

export const deletePost = async (id: string): Promise<void> => {
  const headers = await getRequiredAuthHeaders();
  await axios.delete(`${API_URL}/posts/${id}`, { headers });
};

export const getComments = async (postId: string): Promise<Comment[]> => {
  const res = await axios.get(`${API_URL}/posts/${postId}/comments`);
  return res.data.comments;
};

export const createComment = async (postId: string, content: string): Promise<Comment> => {
  try {
    const headers = await getRequiredAuthHeaders();
    const res = await axios.post(`${API_URL}/posts/${postId}/comments`, { content }, { headers });
    return res.data;
  } catch (err: any) {
    if (err instanceof AuthRequiredError) throw err;
    if (err.response?.status === 401) throw new AuthRequiredError();
    throw err;
  }
};

export const deleteComment = async (postId: string, commentId: string): Promise<void> => {
  const headers = await getRequiredAuthHeaders();
  await axios.delete(`${API_URL}/posts/${postId}/comments/${commentId}`, { headers });
};

export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

export const DANGER_COLORS: Record<string, string> = {
  '위험': '#FF4D4D',
  '경고': '#FF8C00',
  '주의': '#FFD600',
  '안전': '#4CAF50',
};

export const DANGER_BG_COLORS: Record<string, string> = {
  '위험': '#FFF0F0',
  '경고': '#FFF4E5',
  '주의': '#FFFCE5',
  '안전': '#F0FFF4',
};
