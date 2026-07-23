import axios from "axios";
import { getToken } from "./token";
import { API_URL } from "./config";

// searchSong looks up tracks by name/artist. getSongStream asks the
// backend for a direct, playable audio URL for one YouTube video ID —
// that URL is what we hand to expo-audio in src/player/audioEngine.ts.

export const searchSong = async (query: string) => {
  const token = await getToken();
  const response = await axios.get(API_URL + "/songs/search", {
    headers: { Authorization: "Bearer " + token },
    params: { q: query },
  });
  if (response.status === 200) {
    return response.data?.["result"] ?? [];
  }
  return [];
};

export const getSongStream = async (videoId: string): Promise<string | null> => {
  const token = await getToken();
  const response = await axios.get(API_URL + "/songs/stream-url", {
    headers: { Authorization: "Bearer " + token },
    params: { id: videoId },
  });
  if (response.status === 200) {
    return response.data.url;
  }
  return null;
};
