import "./Profile.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "@/lib/auth";

export default function Profile() {
	const navigate = useNavigate();
	const [profile, setProfile] = useState({
		username: "Agustin",
		email: "agustin@email.com",
	});

	const initial = profile.username ? profile.username[0].toUpperCase() : "?"

	return (
		<section className="profile-page">
			<div className="profile-hero">
				<div className="profile-avatar">{initial}</div>
				<div className="profile-hero-info">
					<span className="profile-eyebrow">Profile</span>
					<h1 className="profile-name">{profile.username}</h1>
				</div>
			</div>

			<div className="profile-section">
				<div className="profile-section-head">
					<h2>Account</h2>
					<p>Update your username and email address.</p>
				</div>
				<div className="profile-section-body">
					<div className="profile-field">
						<label htmlFor="username-input">Username</label>
						<input
							id="username-input"
							type="text"
							value={profile.username}
							onChange={e => setProfile({ ...profile, username: e.target.value })}
						/>
					</div>
					<div className="profile-field">
						<label htmlFor="email-input">Email</label>
						<input
							id="email-input"
							type="email"
							value={profile.email}
							onChange={e => setProfile({ ...profile, email: e.target.value })}
						/>
					</div>
					<div className="profile-actions">
						<button className="profile-btn-secondary">Cancel</button>
						<button className="profile-btn-primary">Save changes</button>
					</div>
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
					<button className="profile-btn-danger">
						<i className="bi bi-trash"></i>
						Delete account
					</button>
				</div>
			</div>
		</section>
	)
}
