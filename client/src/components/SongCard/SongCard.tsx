import "./SongCard.css"
import { useState } from "react"
import { usePlayer } from "@/components/Player/Player"
import { PlayerTrack } from "@/store/playerSlice"
import { openExternal } from "@/lib/shell"

interface SongCardProps {
	title: string,
	artist: string
	youtube_id: string
	queue: PlayerTrack[]
	index: number
	onAddToPlaylist: (song: { title: string, artist: string, youtube_id: string }) => void
}

export default function SongCard(props: SongCardProps) {
	const [isCopied, setIsCopied] = useState(false)
	const youtubeLink = `https://www.youtube.com/watch?v=${props.youtube_id}`;
	const { current, isPlaying, playQueue, toggle } = usePlayer()
	const isCurrent = current?.youtube_id === props.youtube_id

	const handlePlay = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (isCurrent) {
			toggle()
		} else {
			playQueue(props.queue, props.index)
		}
	}

	const handleCopy = async (e: React.MouseEvent) => {
		e.stopPropagation()
		await navigator.clipboard.writeText(youtubeLink);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 1500);
	}

	const handleYouTube = (e: React.MouseEvent) => {
		e.stopPropagation();
		openExternal(youtubeLink);
	}

	const handleAddPlaylist = (e: React.MouseEvent) => {
		e.stopPropagation();
		props.onAddToPlaylist({ title: props.title, artist: props.artist, youtube_id: props.youtube_id })
	}

	return (
		<div className={`song-card${isCopied ? ' copied' : ''}${isCurrent ? ' is-playing' : ''}`}>
			<div className="cover" onClick={handlePlay} title="Play">
				<img
					className="img"
					src={`https://img.youtube.com/vi/${props.youtube_id}/mqdefault.jpg`}
					alt={props.title}
				/>
				<button className="song-card-play" onClick={handlePlay} aria-label={isCurrent && isPlaying ? "Pause" : "Play"}>
					{isCurrent && isPlaying ? (
						<span className="now-playing-bars" aria-label="Playing">
							<span /><span /><span />
						</span>
					) : (
						<i className="bi bi-play-fill"></i>
					)}
				</button>
				<div className="actions">
					<button className="btn copy" title="Copy link" onClick={handleCopy}>
						<i className="bi bi-link-45deg"></i>
					</button>
					<button className="btn youtube" title="Open in YouTube" onClick={handleYouTube}>
						<i className="bi bi-youtube"></i>
					</button>
					<button className="btn add" title="Add to playlist" onClick={handleAddPlaylist}>
						<i className="bi bi-plus-lg"></i>
					</button>
				</div>
				<span className="copy-feedback">
					<i className="bi bi-clipboard-check"></i> Copied
				</span>
			</div>
			<div className="song-card-meta">
				<span className="title">{props.title}</span>
				{props.artist && <span className="artist">{props.artist}</span>}
			</div>
		</div>
	)
}
