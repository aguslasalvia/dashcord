import { getPlaylistByID, deleteSongsFromPlaylistByID } from "@/lib/playlist";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { IPlaylist, ISong } from "@/types";
import { usePlayer } from "@/components/Player/Player";
import "./Playlist.css";

export default function Playlist() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const id = params.get("id");
  const [playlist, setPlaylist] = useState<IPlaylist>();
  const { showToast, ToastContainer } = useToast();
  const { play, current, isPlaying } = usePlayer();

  const playSong = (song: ISong) => {
    play({
      youtube_id: song.youtube_id,
      title: song.title,
      artist: song.artist,
      cover: `https://img.youtube.com/vi/${song.youtube_id}/mqdefault.jpg`,
    });
  };

  const fetchPlaylist = async () => {
    if (!id) return;
    const data = await getPlaylistByID(id);
    setPlaylist(data);
  };

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const handleDeleteSong = async (song_id: string) => {
    if (!id) return;
    const ok = await deleteSongsFromPlaylistByID(id, song_id);
    if (ok) {
      showToast("Song removed from playlist", "success");
      fetchPlaylist();
    } else {
      showToast("Error removing song", "error");
    }
  };

  const handleDeletePlaylist = async () => {
    if (!id) return;
    const ok = await deleteSongsFromPlaylistByID(id, "");
    if (ok) {
      showToast("Playlist deleted", "success");
      navigate("/dashboard/playlists");
    } else {
      showToast("Error deleting playlist", "error");
    }
  };

  const cover = playlist?.songs[0]?.youtube_id
    ? `https://img.youtube.com/vi/${playlist.songs[0].youtube_id}/mqdefault.jpg`
    : "/default.png";

  return (
    <div className="playlist-visor-container">
      <ToastContainer />
      {playlist ? (
        <>
          <div className="playlist-visor-header">
            <img
              className="playlist-visor-cover"
              src={cover}
              alt={playlist.name}
            />
            <div className="playlist-visor-info">
              <span className="playlist-visor-label">Playlist</span>
              <h1 className="playlist-visor-title">{playlist.name}</h1>
              <div className="playlist-visor-meta">
                <strong>{playlist.created_by}</strong>
                <span className="playlist-visor-meta-sep">·</span>
                <span>
                  {playlist.songs.length}{" "}
                  {playlist.songs.length === 1 ? "song" : "songs"}
                </span>
              </div>
            </div>
            <div className="playlist-visor-actions">
              <button
                className="playlist-visor-play-btn"
                title="Play"
                onClick={() => playlist.songs[0] && playSong(playlist.songs[0])}
                disabled={playlist.songs.length === 0}
              >
                <i className="bi bi-play-fill"></i>
              </button>
              <button
                className="playlist-visor-delete-btn"
                title="Delete playlist"
                onClick={handleDeletePlaylist}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </div>
          <div className="playlist-visor-songs-table-container">
            {playlist.songs.length === 0 ? (
              <div className="playlist-visor-empty">
                This playlist is empty.
              </div>
            ) : (
              <table className="playlist-visor-songs-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {playlist.songs.map((song, idx) => {
                    const isCurrent = current?.youtube_id === song.youtube_id;
                    return (
                      <tr
                        key={idx}
                        className={`playlist-visor-song-row${isCurrent ? " playing" : ""}`}
                        onDoubleClick={() => playSong(song)}
                        style={{ animationDelay: `${idx * 40}ms` }}
                      >
                        <td className="playlist-visor-song-index">
                          {isCurrent && isPlaying ? (
                            <span
                              className="now-playing-bars"
                              aria-label="Playing"
                            >
                              <span />
                              <span />
                              <span />
                            </span>
                          ) : (
                            <>
                              <span className="row-number">{idx + 1}</span>
                              <button
                                className="row-play-overlay"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playSong(song);
                                }}
                                aria-label="Play"
                              >
                                <i className="bi bi-play-fill"></i>
                              </button>
                            </>
                          )}
                        </td>
                        <td className="playlist-visor-song-title">
                          {song.title}
                        </td>
                        <td className="playlist-visor-song-artist">
                          {song.artist}
                        </td>
                        <td>
                          <div className="playlist-visor-song-actions">
                            <button
                              className="playlist-visor-song-btn youtube"
                              title="View on YouTube"
                              onClick={() =>
                                window.open(
                                  `https://www.youtube.com/watch?v=${song.youtube_id}`,
                                  "_blank",
                                )
                              }
                            >
                              <i className="bi bi-youtube"></i>
                            </button>
                            <button
                              className="playlist-visor-song-btn copy"
                              title="Copy link"
                              onClick={async () => {
                                await navigator.clipboard.writeText(
                                  `https://www.youtube.com/watch?v=${song.youtube_id}`,
                                );
                                showToast("Link copied", "success", 1500);
                              }}
                            >
                              <i className="bi bi-link-45deg"></i>
                            </button>
                            <button
                              className="playlist-visor-song-btn delete"
                              title="Remove song"
                              onClick={() => handleDeleteSong(song.youtube_id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : (
        <div className="playlist-visor-loading">Loading playlist…</div>
      )}
    </div>
  );
}
