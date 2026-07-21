import { Link } from "react-router-dom"
import "./PlaylistCard.css"
import { usePlayer } from "@/components/Player/Player"
import { ISong } from "@/types"

interface PlaylistCardProp {
	_id: string
	title: string,
	created: string,
	cover: string,
	songs?: ISong[]
}

export default function PlaylistCard(props: PlaylistCardProp) {
	const palylist_href = "/dashboard/playlists/playlist?id=" + props._id
	const { playQueue } = usePlayer()

	const handlePlay = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		if (!props.songs || props.songs.length === 0) return
		const queue = props.songs.map((song) => ({
			youtube_id: song.youtube_id,
			title: song.title,
			artist: song.artist,
			cover: `https://img.youtube.com/vi/${song.youtube_id}/mqdefault.jpg`,
		}))
		playQueue(queue, 0)
	}

	return (
		<Link className="playlist-card" to={palylist_href}>
			<div className="playlist-card-cover">
				<img className="playlist-card-img" src={props.cover} alt={props.title} />
				<button className="playlist-card-play" onClick={handlePlay} aria-label="Play">
					<i className="bi bi-play-fill"></i>
				</button>
			</div>
			<div className="playlist-card-meta">
				<span className="playlist-card-title">{props.title}</span>
				<span className="playlist-card-creator">by {props.created}</span>
			</div>
		</Link>
	)
}
