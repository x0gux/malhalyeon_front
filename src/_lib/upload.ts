import axios from "axios";
import { auth } from "./firebase";

export class LoginRequiredError extends Error {
    constructor() {
        super('LOGIN_REQUIRED');
        this.name = 'LoginRequiredError';
    }
}

export const uploadCsv = async (file: File, targetName: string, answers?: any[]) => {
    const user = auth.currentUser;
    if (!user) throw new LoginRequiredError();

    const idToken = await user.getIdToken();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_name', targetName);

    if (answers && answers.length > 0) {
        try {
            const quizResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/quiz/submit`, { answers });
            if (quizResponse.data.user_type) {
                formData.append('user_type', JSON.stringify(quizResponse.data.user_type));
            }
        } catch (error) {
            console.error("Error fetching user type:", error);
        }
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${idToken}`,
        },
    });
    return response.data;
}