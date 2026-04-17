import axios from "axios";

export const uploadCsv = async (file: File, targetName: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_name', targetName);
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}