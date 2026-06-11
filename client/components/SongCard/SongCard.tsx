"use client"
import "./SongCard.css"
import { useState } from "react"
import { useEffect } from "react"
import { getAllPlaylist } from "@/lib/playlist"
import { IPlaylist } from "@/types"
import { usePlayer } from "@/components/Player/Player"

interface SongCardProps {
	title: string,
	artist: string
	youtube_id: string
	onAddToPlaylist?: (song: { title: string, artist: string, youtube_id: string }) => void
}

export default function SongCard(props: SongCardProps) {
	const [isCopied, setIsCopied] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const [playlists, setPlaylists] = useState<IPlaylist[]>([])
	const youtubeLink = `https://www.youtube.com/watch?v=${props.youtube_id}`;
	const { play } = usePlayer()

	useEffect(() => {
		if (showModal) {
			getAllPlaylist().then(setPlaylists)
		}
	}, [showModal])

	const handlePlay = (e: React.MouseEvent) => {
		e.stopPropagation()
		play({
			youtube_id: props.youtube_id,
			title: props.title,
			artist: props.artist,
			cover: `https://img.youtube.com/vi/${props.youtube_id}/mqdefault.jpg`,
		})
	}

	const handleCopy = async (e: React.MouseEvent) => {
		e.stopPropagation()
		await navigator.clipboard.writeText(youtubeLink);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 1500);
	}

	const handleYouTube = (e: React.MouseEvent) => {
		e.stopPropagation();
		window.open(youtubeLink, '_blank');
	}

	const handleAddPlaylist = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (props.onAddToPlaylist) {
			props.onAddToPlaylist({ title: props.title, artist: props.artist, youtube_id: props.youtube_id })
		} else {
			setShowModal(true);
		}
	}

	const handleCloseModal = () => setShowModal(false)

	const handleAddSongToPlaylist = (playlistId: string) => {
		alert(`Add '${props.title}' to playlist ${playlistId}`)
		setShowModal(false)
	}

	return (
		<div className={`song-card${isCopied ? ' copied' : ''}`}>
			<div className="cover" onClick={handlePlay} title="Play">
				<img
					className="img"
					src={`https://img.youtube.com/vi/${props.youtube_id}/mqdefault.jpg`}
					alt={props.title}
				/>
				<button className="song-card-play" onClick={handlePlay} aria-label="Play">
					<i className="bi bi-play-fill"></i>
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

			{showModal && !props.onAddToPlaylist && (
				<div className="songcard-modal-overlay" onClick={handleCloseModal}>
					<div className="songcard-modal" onClick={e => e.stopPropagation()}>
						<h3>Add to playlist</h3>
						{playlists.length === 0 ? (
							<p style={{ color: "var(--text-muted)", margin: 0 }}>You have no playlists.</p>
						) : (
							<ul className="songcard-modal-list">
								{playlists.map(pl => (
									<li key={pl._id} className="songcard-modal-item">
										<span>{pl.name}</span>
										<button onClick={() => handleAddSongToPlaylist(pl._id!)} className="songcard-modal-add-btn">Add</button>
									</li>
								))}
							</ul>
						)}
						<button className="songcard-modal-close" onClick={handleCloseModal}>Close</button>
					</div>
				</div>
			)}
		</div>
	)
}
