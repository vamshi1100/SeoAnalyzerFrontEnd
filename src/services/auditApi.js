
import axios from "axios";

const API_URL = 'https://seo-analyzer-back-end.vercel.app/api';

export const runWebsiteAudit = async (url) => {
    const response = await axios.post(`${API_URL}/audit`, {
        url: url,
    });

    return response.data;
};
