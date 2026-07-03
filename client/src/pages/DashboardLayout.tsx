import { Outlet } from "react-router-dom";
import BottomNav from "@/components/BottomNav/BottomNav";
import { PlayerProvider } from "@/components/Player/Player";
import "./DashboardLayout.css"

export default function DashboardLayout() {
	return (
		<PlayerProvider>
			<div className="dashboard-layout">
				<main className="dashboard-main">
					<Outlet />
				</main>
				<BottomNav />
			</div>
		</PlayerProvider>
	);
}
