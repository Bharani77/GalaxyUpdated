import axios from 'axios';

const API_URL = 'https://5000-bharani77-galaxycodewor-ptj4n5r2xpg.ws-us116.gitpod.io';

export const startGalaxy = async (data: any) => {
  const response = await axios.post(`${API_URL}/start`, data);
  return response.data;
};

export const updateGalaxy = async (data: any) => {
  const response = await axios.post(`${API_URL}/update`, data);
  return response.data;
};

export const stopGalaxy = async () => {
  const response = await axios.post(`${API_URL}/stop`);
  return response.data;
};