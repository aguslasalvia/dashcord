import axios from "axios";
import { API_URL } from "./config";

// Calls the login/register endpoints. Both return the response body
// (which includes the auth token) on success, or null if the server
// rejected the request (wrong password, username taken, etc.) — axios
// throws for error responses, so we catch that and turn it into null
// instead of letting the error bubble up to the caller.

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    if (response.status !== 200) return null;
    return response.data;
  } catch {
    return null;
  }
};

export const register = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { username, password });
    if (response.status !== 200) return null;
    return response.data;
  } catch {
    return null;
  }
};
