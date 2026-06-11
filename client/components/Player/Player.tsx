"use client"
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react"
import "./Player.css"

export type PlayerTrack = {
	youtube_id: string
	title: string
	artist?: string
	cover?: string
}

type PlayerCtx = {
	current: PlayerTrack | null
	isPlaying: boolean
	progress: number // seconds
	duration: number // seconds
	play: (track: PlayerTrack) => void
	toggle: () => void
	seek: (sec: number) => void
	stop: () => void
}

const Ctx = createContext<PlayerCtx | null>(null)

declare global {
	interface Window {
		YT: any
		onYouTubeIframeAPIReady?: () => void
	}
}

export function PlayerProvider({ children }: { children: ReactNode }) {
	const [current, setCurrent] = useState<PlayerTrack | null>(null)
	const [isPlaying, setIsPlaying] = useState(false)
	const [progress, setProgress] = useState(0)
	const [duration, setDuration] = useState(0)
	const [ready, setReady] = useState(false)

	const playerRef = useRef<any>(null)
	const intervalRef = useRef<any>(null)
	const pendingTrackRef = useRef<PlayerTrack | null>(null)

	useEffect(() => {
		if (typeof window === "undefined") return

		if (window.YT && window.YT.Player) {
			initPlayer()
			return
		}

		if (!document.getElementById("yt-iframe-api")) {
			const tag = document.createElement("script")
			tag.id = "yt-iframe-api"
			tag.src = "https://www.youtube.com/iframe_api"
			document.body.appendChild(tag)
		}

		window.onYouTubeIframeAPIReady = () => initPlayer()
	}, [])

	function initPlayer() {
		if (playerRef.current) return
		playerRef.current = new window.YT.Player("yt-iframe-target", {
			height: "1",
			width: "1",
			playerVars: { playsinline: 1, controls: 0, autoplay: 0 },
			events: {
				onReady: () => {
					setReady(true)
					if (pendingTrackRef.current) {
						playerRef.current.loadVideoById(pendingTrackRef.current.youtube_id)
						pendingTrackRef.current = null
					}
				},
				onStateChange: (e: any) => {
					const YT = window.YT
					if (e.data === YT.PlayerState.PLAYING) {
						setIsPlaying(true)
						startProgressLoop()
					} else if (e.data === YT.PlayerState.PAUSED) {
						setIsPlaying(false)
						stopProgressLoop()
					} else if (e.data === YT.PlayerState.ENDED) {
						setIsPlaying(false)
						stopProgressLoop()
					}
				},
			},
		})
	}

	function startProgressLoop() {
		stopProgressLoop()
		intervalRef.current = setInterval(() => {
			const p = playerRef.current
			if (!p?.getCurrentTime || !p?.getDuration) return
			setProgress(p.getCurrentTime())
			setDuration(p.getDuration())
		}, 400)
	}

	function stopProgressLoop() {
		if (intervalRef.current) clearInterval(intervalRef.current)
		intervalRef.current = null
	}

	function play(track: PlayerTrack) {
		setCurrent(track)
		setProgress(0)
		setDuration(0)
		if (!ready || !playerRef.current?.loadVideoById) {
			pendingTrackRef.current = track
			return
		}
		playerRef.current.loadVideoById(track.youtube_id)
	}

	function toggle() {
		if (!playerRef.current) return
		if (isPlaying) playerRef.current.pauseVideo()
		else playerRef.current.playVideo()
	}

	function seek(sec: number) {
		if (!playerRef.current) return
		playerRef.current.seekTo(sec, true)
	}

	function stop() {
		if (playerRef.current?.stopVideo) playerRef.current.stopVideo()
		setCurrent(null)
		setIsPlaying(false)
		setProgress(0)
		setDuration(0)
		stopProgressLoop()
	}

	return (
		<Ctx.Provider value={{ current, isPlaying, progress, duration, play, toggle, seek, stop }}>
			{children}
			<div className="yt-iframe-host" aria-hidden="true">
				<div id="yt-iframe-target" />
			</div>
			<PlayerBar />
		</Ctx.Provider>
	)
}

export function usePlayer() {
	const ctx = useContext(Ctx)
	if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider")
	return ctx
}

function formatTime(s: number) {
	if (!isFinite(s) || s <= 0) return "0:00"
	const m = Math.floor(s / 60)
	const r = Math.floor(s % 60).toString().padStart(2, "0")
	return `${m}:${r}`
}

function PlayerBar() {
	const { current, isPlaying, progress, duration, toggle, seek, stop } = usePlayer()
	if (!current) return null

	const pct = duration > 0 ? (progress / duration) * 100 : 0

	const onTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect()
		const ratio = (e.clientX - rect.left) / rect.width
		seek(duration * Math.max(0, Math.min(1, ratio)))
	}

	return (
		<div className="player-bar">
			<div className="player-bar-inner">
				<div className="player-track">
					{current.cover && <img src={current.cover} alt="" className="player-cover" />}
					<div className="player-track-info">
						<span className="player-track-title">{current.title}</span>
						{current.artist && <span className="player-track-artist">{current.artist}</span>}
					</div>
				</div>

				<div className="player-controls">
					<button className="player-play" onClick={toggle} aria-label={isPlaying ? "Pause" : "Play"}>
						<i className={`bi bi-${isPlaying ? "pause-fill" : "play-fill"}`} />
					</button>
					<div className="player-progress">
						<span className="player-time">{formatTime(progress)}</span>
						<div className="player-progress-track" onClick={onTrackClick}>
							<div className="player-progress-fill" style={{ width: `${pct}%` }} />
						</div>
						<span className="player-time">{formatTime(duration)}</span>
					</div>
				</div>

				<button className="player-close" onClick={stop} aria-label="Close player">
					<i className="bi bi-x-lg" />
				</button>
			</div>
		</div>
	)
}
