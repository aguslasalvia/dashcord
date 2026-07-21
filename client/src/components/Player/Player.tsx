import { useEffect, ReactNode } from "react";
import { useSelector } from "react-redux";
import { store, RootState } from "@/store/store";
import {
  setCurrent,
  setQueue,
  setIsPlaying,
  setProgress,
  setError,
  reset,
  PlayerTrack,
} from "@/store/playerSlice";
import { useToast } from "@/hooks/useToast";
import "./Player.css";

export type { PlayerTrack };

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytPlayer: any = null;
let apiLoaded = false;
let ready = false;
let intervalId: any = null;
let pendingTrack: PlayerTrack | null = null;

function initPlayer(initialTrack?: PlayerTrack) {
  if (ytPlayer) return;
  ytPlayer = new window.YT.Player("yt-iframe-target", {
    height: "1",
    width: "1",
    videoId: initialTrack?.youtube_id,
    playerVars: { playsinline: 1, controls: 0, autoplay: initialTrack ? 1 : 0 },
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
          next();
        }
      },
      onError: (e: any) => {
        const reasons: Record<number, string> = {
          2: "Invalid video.",
          5: "This video can't be played here.",
          100: "This video was not found, is private, or was removed.",
          101: "This video can't be played outside YouTube.",
          150: "This video can't be played outside YouTube.",
        };
        store.dispatch(setIsPlaying(false));
        store.dispatch(setError(reasons[e.data] ?? "This video can't be played."));
        stopProgressLoop();
        next();
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

function loadTrack(track: PlayerTrack) {
  store.dispatch(setCurrent(track));
  if (!ytPlayer) {
    if (apiLoaded) {
      initPlayer(track);
    } else {
      pendingTrack = track;
    }
    return;
  }
  if (!ready || !ytPlayer.loadVideoById) {
    pendingTrack = track;
    return;
  }
  ytPlayer.loadVideoById(track.youtube_id);
}

function playQueue(tracks: PlayerTrack[], index: number) {
  const track = tracks[index];
  if (!track) return;
  store.dispatch(setQueue({ queue: tracks, index }));
  loadTrack(track);
}

function play(track: PlayerTrack) {
  playQueue([track], 0);
}

function next() {
  const { queue, queueIndex } = store.getState().player;
  if (queueIndex + 1 < queue.length) playQueue(queue, queueIndex + 1);
}

function previous() {
  const { queue, queueIndex, progress } = store.getState().player;
  if (progress > 3) {
    seek(0);
  } else if (queueIndex > 0) {
    playQueue(queue, queueIndex - 1);
  } else {
    seek(0);
  }
}

function toggle() {
  if (!ytPlayer?.playVideo || !ytPlayer?.pauseVideo) return;
  if (store.getState().player.isPlaying) ytPlayer.pauseVideo();
  else ytPlayer.playVideo();
}

function seek(sec: number) {
  if (!ytPlayer?.seekTo) return;
  ytPlayer.seekTo(sec, true);
}

export function stop() {
  if (ytPlayer?.stopVideo) ytPlayer.stopVideo();
  store.dispatch(reset());
  stopProgressLoop();
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      apiLoaded = true;
      // A track may already have been requested while the API was still loading.
      if (pendingTrack) {
        const track = pendingTrack;
        pendingTrack = null;
        initPlayer(track);
      }
      return;
    }

    if (!document.getElementById("yt-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "yt-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      apiLoaded = true;
      if (pendingTrack) {
        const track = pendingTrack;
        pendingTrack = null;
        initPlayer(track);
      }
    };
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
  const { current, isPlaying, progress, duration, queue, queueIndex, error } =
    useSelector((state: RootState) => state.player);
  const hasNext = queueIndex + 1 < queue.length;
  const hasPrevious = queueIndex > 0;
  return {
    current,
    isPlaying,
    progress,
    duration,
    hasNext,
    hasPrevious,
    error,
    play,
    playQueue,
    toggle,
    seek,
    stop,
    next,
    previous,
  };
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
  const {
    current,
    isPlaying,
    progress,
    duration,
    hasNext,
    hasPrevious,
    error,
    toggle,
    seek,
    stop,
    next,
    previous,
  } = usePlayer();
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
            {error ? (
              <span className="player-track-error">{error}</span>
            ) : current.artist && (
              <span className="player-track-artist">{current.artist}</span>
            )}
          </div>
        </div>

        <div className="player-controls">
          <button
            className="player-skip"
            onClick={previous}
            disabled={!hasPrevious && progress <= 3}
            aria-label="Previous"
          >
            <i className="bi bi-skip-start-fill" />
          </button>
          <button
            className="player-play"
            onClick={toggle}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            <i className={`bi bi-${isPlaying ? "pause-fill" : "play-fill"}`} />
          </button>
          <button
            className="player-skip"
            onClick={next}
            disabled={!hasNext}
            aria-label="Next"
          >
            <i className="bi bi-skip-end-fill" />
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
