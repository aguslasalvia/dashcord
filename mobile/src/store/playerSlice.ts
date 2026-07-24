import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// This is the Redux slice that holds everything about what's currently
// playing: the track, whether it's playing/loading, how far through it we
// are, and the queue of upcoming tracks. src/player/audioEngine.ts is the
// only file that dispatches these actions — every screen just reads this
// state through the usePlayer() hook.

export type PlayerTrack = {
  youtube_id: string;
  title: string;
  artist?: string;
  cover?: string;
};

interface PlayerState {
  current: PlayerTrack | null;
  isPlaying: boolean;
  isLoading: boolean;
  progress: number; // seconds
  duration: number; // seconds
  queue: PlayerTrack[];
  queueIndex: number;
  error: string | null;
}

const initialState: PlayerState = {
  current: null,
  isPlaying: false,
  isLoading: false,
  progress: 0,
  duration: 0,
  queue: [],
  queueIndex: -1,
  error: null,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setCurrent(state, action: PayloadAction<PlayerTrack | null>) {
      state.current = action.payload;
      state.progress = 0;
      state.duration = 0;
      state.error = null;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setQueue(state, action: PayloadAction<{ queue: PlayerTrack[]; index: number }>) {
      state.queue = action.payload.queue;
      state.queueIndex = action.payload.index;
    },
    setIsPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setProgress(state, action: PayloadAction<{ progress: number; duration: number }>) {
      state.progress = action.payload.progress;
      state.duration = action.payload.duration;
    },
    // Puts everything back to the "nothing playing" state, used when the
    // user stops playback or signs out.
    reset() {
      return initialState;
    },
  },
});

export const { setCurrent, setQueue, setIsPlaying, setLoading, setProgress, setError, reset } =
  playerSlice.actions;
export default playerSlice.reducer;
