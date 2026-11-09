
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const runWebsiteAudit = async (url) => {
    const response = await axios.post(`${API_URL}/audit`, {
        url: url,
    });

    return response.data;
};
