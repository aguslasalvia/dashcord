import axios from "axios";
import { getToken } from "./token";
import { IPlaylist, ISong } from "@/types";
import { API_URL } from "./config";

// All the requests here need the saved login token, so every function
// reads it with getToken() first and sends it as a Bearer header.

export const getAllPlaylist = async (): Promise<IPlaylist[]> => {
  try {
    const token = await getToken();
    const response = await axios.get(API_URL + "/playlists/all", {
      headers: { Authorization: "Bearer " + token },
    });
    const data = response.data;
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export const getPlaylistByID = async (id: string): Promise<IPlaylist> => {
  const token = await getToken();
  const response = await axios.get(API_URL + "/playlists/playlist", {
    headers: { Authorization: "Bearer " + token },
    params: { id },
  });
  return response.data;
};

export const createPlaylist = async (playlist: Partial<IPlaylist>) => {
  const token = await getToken();
  const response = await axios.post(API_URL + "/playlists/create", playlist, {
    headers: { Authorization: "Bearer " + token },
  });
  // The server responds 201 with an empty body, so there's no payload to return.
  return response.status === 201;
};

export const addSongToPlaylist = async (song: ISong, playlistID: string) => {
  const token = await getToken();
  return axios.patch(
    API_URL + "/playlists/add",
    { id: playlistID, song },
    { headers: { Authorization: "Bearer " + token } },
  );
};

export const deleteSongsFromPlaylistByID = async (playlist_id: string, song_id: string) => {
  const token = await getToken();
  const response = await axios.delete(API_URL + "/playlists/song", {
    headers: { Authorization: "Bearer " + token },
    data: { playlist_id, song_id },
  });
  return response.status === 204;
};
