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
  doc
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


export const saveUser = async (user: User) => {
  try {
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
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
    const totalScore = data.analysis_items.reduce((sum: number, item: any) => sum + item.likability_score, 0);
    
    const rankingData = {
      targetName: data.receipt_info.target_name,
      totalScore: totalScore,
      userName: userName || "익명",
      userType: data.user_type || "미검사",
      analysisItems: data.analysis_items,
      compatibilityIssues: data.compatibility_issues || [],
      finalVerdict: data.final_verdict,
      createdAt: serverTimestamp(),
    };

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
