import axios from "axios";
import { getToken } from "./token";
import { IPlaylist, ISong } from "@/types";
import { API_URL } from "./config";

export const getAllPlaylist = async (): Promise<IPlaylist[]> => {
  try {
    const response = await axios.get(
      API_URL + "/playlists/all",
      {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      },
    );
    const data = response.data;
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export const getPlaylistByID = async (id: string) => {
  const response = await axios.get(
    API_URL + "/playlists/playlist",
    {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      params: { id: id },
    },
  );
  return response.data;
};

export const createPlaylist = async (playlist: IPlaylist) => {
  const response = await axios.post(
    API_URL + "/playlists/create",
    playlist,
    {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    },
  );
  // The server responds 201 with an empty body, so there's no payload to return.
  return response.status === 201;
};

export const addSongToPlaylist = (song: ISong, playlistID: string) => {
  return axios.patch(
    API_URL + "/playlists/add",
    {
      id: playlistID,
      song: song,
    },
    {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    },
  );
};

export const deleteSongsFromPlaylistByID = async (
  playlist_id: string,
  song_id: string,
) => {
  const response = await axios.delete(
    API_URL + "/playlists/song",
    {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      data: {
        playlist_id: playlist_id,
        song_id: song_id,
      },
    },
  );
  if (response.status === 204) {
    return true;
  }
  return false;
};
