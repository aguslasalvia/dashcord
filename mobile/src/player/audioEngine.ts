import { createAudioPlayer, setAudioModeAsync, type AudioPlayer, type AudioStatus } from "expo-audio";
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

export type { PlayerTrack };

// There's only ever one audio player for the whole app (you can't play two
// songs at once), so instead of creating it inside a component we keep it
// in a plain module variable. It's created the first time getPlayer() is
// called and reused after that.
let audioPlayer: AudioPlayer | null = null;

// Bumped every time we start loading a new track. If the user taps two
// songs quickly, the first fetch might still be in flight when the second
// one starts — this lets loadTrack() check "is this still the load that's
// supposed to be playing?" before it touches the player, so a slow old
// request can't overwrite a newer one.
let loadToken = 0;

setAudioModeAsync({
  playsInSilentMode: true,
  shouldPlayInBackground: true,
  // Required by expo-audio for lock screen / notification media controls to work.
  interruptionMode: "doNotMix",
}).catch(() => {});

// Creates the audio player the first time it's needed, and wires it up to
// keep the Redux store in sync with what's actually happening on the
// device (playing/paused, current position, song finished, etc).
function getPlayer(): AudioPlayer {
  if (!audioPlayer) {
    audioPlayer = createAudioPlayer(null, { updateInterval: 500 });
    audioPlayer.addListener("playbackStatusUpdate", (status: AudioStatus) => {
      store.dispatch(setIsPlaying(status.playing));
      store.dispatch(
        setProgress({
          progress: status.currentTime,
          duration: isFinite(status.duration) ? status.duration : 0,
        }),
      );
      if (status.didJustFinish) {
        next();
      }
    });
  }
  return audioPlayer;
}

// Fetches a playable stream URL for a track and starts playing it.
async function loadTrack(track: PlayerTrack) {
  const token = ++loadToken;
  const player = getPlayer();
  player.pause();

  store.dispatch(setCurrent(track));
  store.dispatch(setLoading(true));

  let url: string | null = null;
  try {
    url = await getSongStream(track.youtube_id);
  } catch {
    url = null;
  }
  // Another loadTrack() call started while we were waiting — let that one
  // finish instead, don't play a song the user already moved past.
  if (token !== loadToken) return;

  store.dispatch(setLoading(false));

  if (!url) {
    store.dispatch(setError("This song can't be played."));
    next();
    return;
  }

  try {
    player.replace({ uri: url });
    player.play();
    // Shows the track on the lock screen / notification shade with
    // play/pause and skip controls.
    player.setActiveForLockScreen(
      true,
      { title: track.title, artist: track.artist, artworkUrl: track.cover },
      { showSeekForward: true, showSeekBackward: true },
    );
  } catch {
    store.dispatch(setError("Playback was blocked."));
  }
}

// Sets the whole play queue and starts playing the track at `index`.
// Used both for "play this single song" (a one-item queue) and for
// "play this playlist starting from song 3".
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
  // Like Spotify: if we're more than 3 seconds into the song, "previous"
  // restarts the current song instead of jumping to the one before it.
  if (progress > 3) {
    seek(0);
  } else if (queueIndex > 0) {
    playQueue(queue, queueIndex - 1);
  } else {
    seek(0);
  }
}

function toggle() {
  const { current, isPlaying } = store.getState().player;
  if (!current) return;
  const player = getPlayer();
  if (isPlaying) {
    player.pause();
  } else {
    player.play();
  }
}

function seek(sec: number) {
  const { current } = store.getState().player;
  if (!current) return;
  getPlayer().seekTo(sec).catch(() => {});
}

// Fully stops playback and clears the "now playing" state. Called when the
// user taps the close button on the player, or when they sign out.
export function stop() {
  loadToken++;
  if (audioPlayer) {
    audioPlayer.pause();
    audioPlayer.clearLockScreenControls();
  }
  store.dispatch(reset());
}

// The hook every screen uses to read player state and control playback.
// It reads from the Redux store, so any component using this hook
// automatically re-renders when the current song, progress, etc. changes.
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
