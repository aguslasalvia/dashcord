import "./Sidebar.css"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { logout } from "@/lib/auth"
import { getAllPlaylist } from "@/lib/playlist"
import { usePlayer } from "@/components/Player/Player"
import { IPlaylist } from "@/types"

export default function Sidebar() {
	const navigate = useNavigate()
	const location = useLocation()
	const pathname = location.pathname
	const { current } = usePlayer()
	const [playlists, setPlaylists] = useState<IPlaylist[]>([])

	const links = [
		{ href: "/dashboard/playlists", icon: "bi-collection", label: "Library" },
		{ href: "/dashboard/songs", icon: "bi-search", label: "Discover" },
		{ href: "/dashboard/profile", icon: "bi-person", label: "Profile" },
	]

	const isActive = (href: string) => pathname?.startsWith(href)
	const activePlaylistId = new URLSearchParams(location.search).get("id")

	useEffect(() => {
		getAllPlaylist().then(setPlaylists)
	}, [pathname])

	return (
		<aside className={`sidebar${current ? " with-player" : ""}`}>
			<div className="sidebar-inner">
				<div className="sidebar-brand" title="dashcord">
					d<em>c</em>
				</div>

				<nav className="sidebar-nav">
					{links.map(link => (
						<Link
							key={link.href}
							to={link.href}
							className={`sidebar-link ${isActive(link.href) ? "active" : ""}`}
						>
							<i className={`bi ${link.icon}`}></i>
							<span>{link.label}</span>
						</Link>
					))}
				</nav>

				<div className="sidebar-playlists">
					<span className="sidebar-section-label">Playlists</span>
					<div className="sidebar-playlists-list">
						{playlists.length === 0 ? (
							<span className="sidebar-playlists-empty">No playlists yet</span>
						) : (
							playlists.map(playlist => {
								let cover = playlist.cover
								if (!cover && playlist.songs?.[0]?.youtube_id) {
									cover = `https://img.youtube.com/vi/${playlist.songs[0].youtube_id}/mqdefault.jpg`
								}
								if (!cover) cover = "/default.png"

								return (
									<Link
										key={playlist._id}
										to={`/dashboard/playlists/playlist?id=${playlist._id}`}
										className={`sidebar-playlist-link${activePlaylistId === playlist._id ? " active" : ""}`}
										title={playlist.name}
									>
										<img src={cover} alt="" className="sidebar-playlist-cover" />
										<span className="sidebar-playlist-name">{playlist.name}</span>
									</Link>
								)
							})
						)}
					</div>
				</div>

				<button className="sidebar-logout" onClick={() => logout(navigate)}>
					<i className="bi bi-box-arrow-right"></i>
					<span>Sign out</span>
				</button>
			</div>
		</aside>
	)
}
