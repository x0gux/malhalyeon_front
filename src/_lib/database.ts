import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  Timestamp,
  setDoc,
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { User } from "firebase/auth";

export interface RankingItem {
  id?: string;
  targetName: string;
  totalScore: number;
  userName: string;
  userType?: string;
  analysisItems: any[];
  compatibilityIssues: any[];
  finalVerdict: any;
  createdAt: Timestamp;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  createdAt: Timestamp | any;
}

// Firestore는 undefined 값을 허용하지 않으므로 저장 전 재귀적으로 제거
const stripUndefined = (obj: Record<string, any>): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => [
        k,
        v !== null && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Timestamp)
          ? stripUndefined(v)
          : v,
      ])
  );
};

export const saveUser = async (user: User) => {
  try {
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL ?? null,
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, "users", user.uid), userData);
  } catch (error) {
    console.error("Error saving user: ", error);
    throw error;
  }
};

export const saveToRanking = async (data: any, userName: string) => {
  try {
    const totalScore = (data.analysis_items ?? []).reduce(
      (sum: number, item: any) => sum + (item.likability_score ?? 0), 0
    );

    const rankingData = stripUndefined({
      targetName: data.receipt_info?.target_name ?? '알 수 없음',
      totalScore,
      userName: userName || "익명",
      userType: data.user_type ?? "미검사",
      analysisItems: data.analysis_items ?? [],
      compatibilityIssues: data.compatibility_issues ?? [],
      finalVerdict: data.final_verdict ?? null,
      createdAt: serverTimestamp(),
    });

    const docRef = await addDoc(collection(db, "ranking"), rankingData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const getRankingList = async (limitCount = 20) => {
  try {
    const q = query(
      collection(db, "ranking"), 
      orderBy("totalScore", "asc"), 
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as RankingItem[];
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};

export const saveToUserHistory = async (uid: string, data: any) => {
  try {
    const totalScore = (data.analysis_items ?? []).reduce(
      (sum: number, item: any) => sum + (item.likability_score ?? 0), 0
    );

    // requestUid 등 Firestore에 저장하면 안 되는 프론트 전용 필드는 명시적으로 제외
    const historyData = stripUndefined({
      targetName: data.receipt_info?.target_name ?? '알 수 없음',
      totalScore,
      userType: data.user_type ?? "미검사",
      analysisItems: data.analysis_items ?? [],
      compatibilityIssues: data.compatibility_issues ?? [],
      finalVerdict: data.final_verdict ?? null,
      createdAt: serverTimestamp(),
    });

    const docRef = await addDoc(collection(db, "users", uid, "history"), historyData);
    return docRef.id;
  } catch (error) {
    console.error("Error saving to user history: ", error);
    throw error;
  }
};

export const getUserHistory = async (uid: string) => {
  try {
    const q = query(
      collection(db, "users", uid, "history"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting user history: ", error);
    throw error;
  }
};

export const getUserProfile = async (uid: string) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile & { userType?: any };
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile: ", error);
    return null;
  }
};

export const updateUserData = async (uid: string, data: any) => {
  try {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating user data: ", error);
    throw error;
  }
};