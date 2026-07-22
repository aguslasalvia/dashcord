import axios from "axios";
import { getToken } from "./token";
import { API_URL } from "./config";

export const searchSong = async (query: string) => {
  let token = getToken();
  const response = await axios.get(
    API_URL + "/songs/search",
    {
      headers: {
        Authorization: "Bearer " + token,
      },
      params: { q: query },
    },
  );
  if (response.status == 200) {
    return response.data?.["result"] ?? [];
  }
  return [];
};


export const getSongStream = async (videoId: string) => {
  let token = getToken();
  const response = await axios.get(
    API_URL + "/songs/stream-url", {
    headers: {
      Authorization: "Bearer " + token,
    },
    params: { id: videoId }
  });
  if (response.status == 200) {
    return response.data.url;
  }
  return null;

}