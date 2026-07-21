import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type PlayerTrack = {
	youtube_id: string
	title: string
	artist?: string
	cover?: string
}

interface PlayerState {
	current: PlayerTrack | null
	isPlaying: boolean
	progress: number // seconds
	duration: number // seconds
	queue: PlayerTrack[]
	queueIndex: number
	error: string | null
}

const initialState: PlayerState = {
	current: null,
	isPlaying: false,
	progress: 0,
	duration: 0,
	queue: [],
	queueIndex: -1,
	error: null,
}

const playerSlice = createSlice({
	name: "player",
	initialState,
	reducers: {
		setCurrent(state, action: PayloadAction<PlayerTrack | null>) {
			state.current = action.payload
			state.progress = 0
			state.duration = 0
			state.error = null
		},
		setError(state, action: PayloadAction<string | null>) {
			state.error = action.payload
		},
		setQueue(state, action: PayloadAction<{ queue: PlayerTrack[]; index: number }>) {
			state.queue = action.payload.queue
			state.queueIndex = action.payload.index
		},
		setIsPlaying(state, action: PayloadAction<boolean>) {
			state.isPlaying = action.payload
		},
		setProgress(state, action: PayloadAction<{ progress: number; duration: number }>) {
			state.progress = action.payload.progress
			state.duration = action.payload.duration
		},
		reset() {
			return initialState
		},
	},
})

export const { setCurrent, setQueue, setIsPlaying, setProgress, setError, reset } = playerSlice.actions
export default playerSlice.reducer
