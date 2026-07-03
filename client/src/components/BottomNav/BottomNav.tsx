import "./BottomNav.css"
import { Link, useLocation } from "react-router-dom"

export default function BottomNav() {
	const pathname = useLocation().pathname

	const links = [
		{ href: "/dashboard/playlists", icon: "bi-collection-fill", label: "Library" },
		{ href: "/dashboard/songs", icon: "bi-search", label: "Discover" },
		{ href: "/dashboard/profile", icon: "bi-person-fill", label: "Profile" },
	]

	const isActive = (href: string) => pathname?.startsWith(href)

	return (
		<nav className="bottomnav" aria-label="Primary">
			<div className="bottomnav-island">
				{links.map(link => (
					<Link
						key={link.href}
						to={link.href}
						className={`bottomnav-tab ${isActive(link.href) ? "active" : ""}`}
					>
						<i className={`bi ${link.icon}`}></i>
						<span className="bottomnav-tab-label">{link.label}</span>
					</Link>
				))}
			</div>
		</nav>
	)
}
