"use client"
import Sidebar from "@/components/Sidebar/Sidebar";
import { PlayerProvider } from "@/components/Player/Player";
import "./layout.css"

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<PlayerProvider>
			<div className="dashboard-layout">
				<Sidebar />
				<main className="dashboard-main">
					{children}
				</main>
			</div>
		</PlayerProvider>
	);
}
