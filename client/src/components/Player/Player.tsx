import { useEffect, ReactNode } from "react";
import { useSelector } from "react-redux";
import { store, RootState } from "@/store/store";
import {
  setCurrent,
  setIsPlaying,
  setProgress,
  reset,
  PlayerTrack,
} from "@/store/playerSlice";
import "./Player.css";

export type { PlayerTrack };

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytPlayer: any = null;
let ready = false;
let intervalId: any = null;
let pendingTrack: PlayerTrack | null = null;

function initPlayer() {
  if (ytPlayer) return;
  ytPlayer = new window.YT.Player("yt-iframe-target", {
    height: "1",
    width: "1",
    playerVars: { playsinline: 1, controls: 0, autoplay: 0 },
    events: {
      onReady: () => {
        ready = true;
        if (pendingTrack) {
          ytPlayer.loadVideoById(pendingTrack.youtube_id);
          pendingTrack = null;
        }
      },
      onStateChange: (e: any) => {
        const YT = window.YT;
        if (e.data === YT.PlayerState.PLAYING) {
          store.dispatch(setIsPlaying(true));
          startProgressLoop();
        } else if (e.data === YT.PlayerState.PAUSED) {
          store.dispatch(setIsPlaying(false));
          stopProgressLoop();
        } else if (e.data === YT.PlayerState.ENDED) {
          store.dispatch(setIsPlaying(false));
          stopProgressLoop();
        }
      },
    },
  });
}

function startProgressLoop() {
  stopProgressLoop();
  intervalId = setInterval(() => {
    if (!ytPlayer?.getCurrentTime || !ytPlayer?.getDuration) return;
    store.dispatch(
      setProgress({
        progress: ytPlayer.getCurrentTime(),
        duration: ytPlayer.getDuration(),
      }),
    );
  }, 400);
}

function stopProgressLoop() {
  if (intervalId) clearInterval(intervalId);
  intervalId = null;
}

function play(track: PlayerTrack) {
  store.dispatch(setCurrent(track));
  if (!ready || !ytPlayer?.loadVideoById) {
    pendingTrack = track;
    return;
  }
  ytPlayer.loadVideoById(track.youtube_id);
}

function toggle() {
  if (!ytPlayer) return;
  if (store.getState().player.isPlaying) ytPlayer.pauseVideo();
  else ytPlayer.playVideo();
}

function seek(sec: number) {
  if (!ytPlayer) return;
  ytPlayer.seekTo(sec, true);
}

function stop() {
  if (ytPlayer?.stopVideo) ytPlayer.stopVideo();
  store.dispatch(reset());
  stopProgressLoop();
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    if (!document.getElementById("yt-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "yt-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => initPlayer();
  }, []);

  return (
    <>
      {children}
      <div className="yt-iframe-host" aria-hidden="true">
        <div id="yt-iframe-target" />
      </div>
      <PlayerBar />
    </>
  );
}

export function usePlayer() {
  const { current, isPlaying, progress, duration } = useSelector(
    (state: RootState) => state.player,
  );
  return { current, isPlaying, progress, duration, play, toggle, seek, stop };
}

function formatTime(s: number) {
  if (!isFinite(s) || s <= 0) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${r}`;
}

function PlayerBar() {
  const { current, isPlaying, progress, duration, toggle, seek, stop } =
    usePlayer();
  if (!current) return null;

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  const onTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(duration * Math.max(0, Math.min(1, ratio)));
  };

  return (
    <div className="player-bar">
      <div className="player-bar-inner">
        <div className="player-track">
          {current.cover && (
            <img src={current.cover} alt="" className="player-cover" />
          )}
          <div className="player-track-info">
            <span className="player-track-title">{current.title}</span>
            {current.artist && (
              <span className="player-track-artist">{current.artist}</span>
            )}
          </div>
        </div>

        <div className="player-controls">
          <button
            className="player-play"
            onClick={toggle}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            <i className={`bi bi-${isPlaying ? "pause-fill" : "play-fill"}`} />
          </button>
          <div className="player-progress">
            <span className="player-time">{formatTime(progress)}</span>
            <div className="player-progress-track" onClick={onTrackClick}>
              <div
                className="player-progress-fill"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="player-time">{formatTime(duration)}</span>
          </div>
        </div>

        <button
          className="player-close"
          onClick={stop}
          aria-label="Close player"
        >
          <i className="bi bi-x-lg" />
        </button>
      </div>
    </div>
  );
}
