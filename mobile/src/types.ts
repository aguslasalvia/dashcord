// Shapes of the data the backend sends back for songs and playlists.

export interface ISong {
  title: string;
  youtube_id: string;
  artist: string;
}

export interface IPlaylist {
  _id?: string;
  name: string;
  created_by: string;
  songs: ISong[];
  cover?: string;
}
