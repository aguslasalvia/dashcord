"use client"
import "./Sidebar.css"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { logout } from "@/lib/auth"

export default function Sidebar() {
	const router = useRouter()
	const pathname = usePathname()

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
							href={link.href}
							className={`sidebar-link ${isActive(link.href) ? "active" : ""}`}
						>
							<i className={`bi ${link.icon}`}></i>
							<span>{link.label}</span>
						</Link>
					))}
				</nav>

				<button className="sidebar-logout" onClick={() => logout(router)}>
					<i className="bi bi-box-arrow-right"></i>
					<span>Sign out</span>
				</button>
			</div>
		</aside>
	)
}
