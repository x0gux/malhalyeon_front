import axios from "axios";

export const uploadCsv = async (file: File, targetName: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_name', targetName);
    const response = await axios.post('https://malhalyeon-back.vercel.app/api/analyze', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}