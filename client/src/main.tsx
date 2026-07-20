import ReactDOM from "react-dom/client"
import { HashRouter, Routes, Route, Navigate } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "@/store/store"
import "./globals.css"

import Login from "@/pages/Login"
import Register from "@/pages/Register"
import DashboardLayout from "@/pages/DashboardLayout"
import Playlists from "@/pages/Playlists"
import Playlist from "@/pages/Playlist"
import Songs from "@/pages/Songs"
import Profile from "@/pages/Profile"

ReactDOM.createRoot(document.getElementById("root")!).render(
	<Provider store={store}>
		<HashRouter>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/dashboard" element={<DashboardLayout />}>
					<Route index element={<Navigate to="playlists" replace />} />
					<Route path="playlists" element={<Playlists />} />
					<Route path="playlists/playlist" element={<Playlist />} />
					<Route path="songs" element={<Songs />} />
					<Route path="profile" element={<Profile />} />
				</Route>
			</Routes>
		</HashRouter>
	</Provider>
)
