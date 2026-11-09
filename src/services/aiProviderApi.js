import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export async function getAIProviderConfig() {
  const response = await axios.get(`${API_URL}/ai/providers`, { timeout: 10000 });
  return response.data;
}

export async function saveAIProviderConfig(flags) {
  const response = await axios.put(`${API_URL}/ai/providers`, { flags }, { timeout: 10000 });
  return response.data;
}
