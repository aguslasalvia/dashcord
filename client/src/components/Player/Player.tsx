import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { store, RootState } from "@/store/store";
import {
  setCurrent,
  setQueue,
  setIsPlaying,
  setLoading,
  setProgress,
  setError,
  reset,
  PlayerTrack,
} from "@/store/playerSlice";
import { getSongStream } from "@/lib/songs";
import "./Player.css";

export type { PlayerTrack };

let audio: HTMLAudioElement | null = null;
let loadToken = 0;

function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio();
    audio.preload = "auto";
    audio.addEventListener("play", () => store.dispatch(setIsPlaying(true)));
    audio.addEventListener("pause", () => store.dispatch(setIsPlaying(false)));
    audio.addEventListener("timeupdate", () => {
      store.dispatch(
        setProgress({
          progress: audio!.currentTime,
          duration: isFinite(audio!.duration) ? audio!.duration : 0,
        }),
      );
    });
    audio.addEventListener("ended", () => {
      store.dispatch(setIsPlaying(false));
      next();
    });
    audio.addEventListener("error", () => {
      store.dispatch(setLoading(false));
      store.dispatch(setIsPlaying(false));
      store.dispatch(setError("This song can't be played."));
      next();
    });
  }
  return audio;
}

async function loadTrack(track: PlayerTrack) {
  const token = ++loadToken;
  const a = getAudio();
  a.pause();

  store.dispatch(setCurrent(track));
  store.dispatch(setLoading(true));

  const url = await getSongStream(track.youtube_id);
  if (token !== loadToken) return;

  store.dispatch(setLoading(false));

  if (!url) {
    store.dispatch(setError("This song can't be played."));
    next();
    return;
  }

  a.src = url;
  a.currentTime = 0;
  a.play().catch(() => {
    store.dispatch(setError("Playback was blocked by the browser."));
  });
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
  const a = getAudio();
  if (!a.src) return;
  if (a.paused) {
    a.play().catch(() => store.dispatch(setError("Playback was blocked by the browser.")));
  } else {
    a.pause();
  }
}

function seek(sec: number) {
  const a = getAudio();
  if (!a.src) return;
  a.currentTime = sec;
}

export function stop() {
  loadToken++;
  if (audio) {
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }
  store.dispatch(reset());
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <PlayerBar />
    </>
  );
}

export function usePlayer() {
  const { current, isPlaying, isLoading, progress, duration, queue, queueIndex, error } =
    useSelector((state: RootState) => state.player);
  const hasNext = queueIndex + 1 < queue.length;
  const hasPrevious = queueIndex > 0;
  return {
    current,
    isPlaying,
    isLoading,
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
    isLoading,
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
            ) : isLoading ? (
              <span className="player-track-artist">Loading…</span>
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
            disabled={isLoading}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            <i
              className={`bi bi-${isLoading ? "arrow-repeat player-spinner" : isPlaying ? "pause-fill" : "play-fill"}`}
            />
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
