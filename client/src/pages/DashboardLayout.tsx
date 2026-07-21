import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar/Sidebar";
import { PlayerProvider } from "@/components/Player/Player";
import "./DashboardLayout.css"

export default function DashboardLayout() {
	return (
		<PlayerProvider>
			<div className="dashboard-layout">
				<Sidebar />
				<main className="dashboard-main">
					<Outlet />
				</main>
			</div>
		</PlayerProvider>
	);
}
