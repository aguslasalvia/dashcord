"use client"
import Link from "next/link"
import "./PlaylistCard.css"
import { usePlayer } from "@/components/Player/Player"
import { ISong } from "@/types"

interface PlaylistCardProp {
	_id: string
	title: string,
	created: string,
	cover: string,
	firstSong?: ISong
}

export default function PlaylistCard(props: PlaylistCardProp) {
	const palylist_href = "/dashboard/playlists/playlist?id=" + props._id
	const { play } = usePlayer()

	const handlePlay = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		if (!props.firstSong) return
		play({
			youtube_id: props.firstSong.youtube_id,
			title: props.firstSong.title,
			artist: props.firstSong.artist,
			cover: props.cover,
		})
	}

	return (
		<Link className="playlist-card" href={palylist_href}>
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
