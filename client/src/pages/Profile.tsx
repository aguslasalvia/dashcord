import "./Profile.css"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getUserFromStorage } from "@/lib/auth";
import { getAllPlaylist } from "@/lib/playlist";

export default function Profile() {
	const navigate = useNavigate();
	const username = getUserFromStorage() || "Unknown";
	const [stats, setStats] = useState({ playlists: 0, songs: 0 });

	useEffect(() => {
		getAllPlaylist().then(playlists => {
			const songs = playlists.reduce((sum, p) => sum + (p.songs?.length ?? 0), 0);
			setStats({ playlists: playlists.length, songs });
		});
	}, []);

	const initial = username ? username[0].toUpperCase() : "?"

	return (
		<section className="profile-page">
			<div className="profile-hero">
				<div className="profile-avatar">{initial}</div>
				<div className="profile-hero-info">
					<span className="profile-eyebrow">Profile</span>
					<h1 className="profile-name">{username}</h1>
				</div>
			</div>

			<div className="profile-stats">
				<div className="profile-stat">
					<span className="profile-stat-num">{stats.playlists}</span>
					<span className="profile-stat-label">Playlists</span>
				</div>
				<div className="profile-stat-divider"></div>
				<div className="profile-stat">
					<span className="profile-stat-num">{stats.songs}</span>
					<span className="profile-stat-label">Songs saved</span>
				</div>
			</div>

			<div className="profile-section">
				<div className="profile-section-head">
					<h2>Session</h2>
					<p>Sign out of your account on this device.</p>
				</div>
				<div className="profile-section-body">
					<button className="profile-btn-secondary" onClick={() => logout(navigate)}>
						<i className="bi bi-box-arrow-right"></i>
						Sign out
					</button>
				</div>
			</div>

			<div className="profile-section danger">
				<div className="profile-section-head">
					<h2>Danger zone</h2>
					<p>Permanently delete your account and all your data.</p>
				</div>
				<div className="profile-section-body">
					<button
						className="profile-btn-danger"
						disabled
						title="Account deletion isn't available yet"
					>
						<i className="bi bi-trash"></i>
						Delete account
					</button>
				</div>
			</div>
		</section>
	)
}
