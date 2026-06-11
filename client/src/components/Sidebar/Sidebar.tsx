import "./Sidebar.css"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { logout } from "@/lib/auth"

export default function Sidebar() {
	const navigate = useNavigate()
	const pathname = useLocation().pathname

	const links = [
		{ href: "/dashboard/playlists", icon: "bi-collection", label: "Library" },
		{ href: "/dashboard/songs", icon: "bi-search", label: "Discover" },
		{ href: "/dashboard/profile", icon: "bi-person", label: "Profile" },
	]

	const isActive = (href: string) => pathname?.startsWith(href)

	return (
		<aside className="sidebar">
			<div className="sidebar-inner">
				<div className="sidebar-brand">
					dash<em>cord</em>
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

				<button className="sidebar-logout" onClick={() => logout(navigate)}>
					<i className="bi bi-box-arrow-right"></i>
					<span>Sign out</span>
				</button>
			</div>
		</aside>
	)
}
