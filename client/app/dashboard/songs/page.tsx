"use client";
import { Suspense } from "react";
import { searchSong } from "@/lib/songs";
import SongCard from "@/components/SongCard/SongCard";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { addSongToPlaylist, getAllPlaylist } from "@/lib/playlist";
import { IPlaylist } from "@/types";
import "./page.css";

function Page() {
	return (
		<>
			<header className="songs-page-header">
				<h1 className="songs-page-title">Discover <em>music</em></h1>
				<p className="songs-page-subtitle">Search any song or artist to add to your playlists.</p>
			</header>
			<Suspense fallback={<div className="songs-empty">Loading…</div>}>
				<SongsClient />
			</Suspense>
		</>
	);
}

export default Page;


function SongsClient() {
	const [search, setSearch] = useState("");
	const [songs, setSongs] = useState<any[]>([]);
	const searchParams = useSearchParams();
	const router = useRouter();
	const [showModal, setShowModal] = useState(false);
	const [selectedSong, setSelectedSong] = useState<any | null>(null);
	const [playlists, setPlaylists] = useState<IPlaylist[]>([]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (search.trim()) {
			router.push(`?q=${encodeURIComponent(search)}`);
		}
	};

	useEffect(() => {
		const query = searchParams.get("q");
		if (query) {
			const fetchSongs = async () => {
				try {
					const data = await searchSong(query);
					setSongs(data);
				} catch (err) {
					console.error("Error searching songs", err);
				}
			};
			fetchSongs();
		}
	}, [searchParams]);

	const handleOpenModal = (song: any) => {
		setSelectedSong(song);
		setShowModal(true);
		getAllPlaylist().then(setPlaylists);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setSelectedSong(null);
	};

	const handleAddSongToPlaylist = async (playlistId: string) => {
		const response = await addSongToPlaylist(selectedSong, playlistId);
		handleCloseModal();
	};

	return (
		<section>
			<form className="songs-search-form" onSubmit={handleSearch}>
				<div className="songs-search-wrap">
					<i className="bi bi-search"></i>
					<input
						id="search"
						type="text"
						name="q"
						className="songs-search-bar"
						placeholder="Search song or artist…"
						required
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<button type="submit" className="songs-search-btn">
					Search
				</button>
			</form>
			<div className="songs-music-grid" id="grid">
				{songs.map((song, index) => (
					<SongCard
						key={index}
						title={song.title}
						youtube_id={song.id}
						artist={song["cannel"]}
						onAddToPlaylist={handleOpenModal}
					/>
				))}
			</div>
			{showModal && selectedSong && (
				<div className="playlists-modal-overlay" onClick={handleCloseModal}>
					<div className="playlists-modal-content" onClick={e => e.stopPropagation()}>
						<div className="playlists-modal-header">
							<h3>Add to playlist</h3>
							<button className="playlists-modal-close" onClick={handleCloseModal}>
								<i className="bi bi-x-lg"></i>
							</button>
						</div>
						{playlists.length === 0 ? (
							<div className="playlists-modal-form">
								<p>You have no playlists.</p>
							</div>
						) : (
							<form className="playlists-modal-form" onSubmit={e => {
								e.preventDefault(); const select = document.getElementById('playlist-select') as HTMLSelectElement;
								if (select && select.value) handleAddSongToPlaylist(select.value);
							}}>
								<div className="playlists-form-group">
									<label htmlFor="playlist-select">Select a playlist</label>
									<select
										className="songcard-modal-select"
										defaultValue={playlists[0]?._id}
										id="playlist-select"
									>
										{playlists.map(pl => (
											<option key={pl._id} value={pl._id}>{pl.name}</option>
										))}
									</select>
								</div>
								<div className="playlists-modal-actions">
									<button type="button" className="playlists-btn-secondary" onClick={handleCloseModal}>
										Cancel
									</button>
									<button type="submit" className="playlists-btn-primary" title="Add to playlist">
										<i className="bi bi-plus-lg"></i> Add
									</button>
								</div>
							</form>
						)}
					</div>
				</div>
			)}
		</section>
	);
}
