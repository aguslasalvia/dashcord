import './Playlists.css'
import PlaylistCard from '@/components/PlaylistCard/PlaylistCard';
import EqualizerBars from '@/components/EqualizerBars/EqualizerBars';
import { createPlaylist, getAllPlaylist } from '@/lib/playlist';
import { IPlaylist } from '@/types';
import { useEffect, useState } from 'react';
import { getUserFromStorage } from '@/lib/auth';


export default function Playlists() {
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [playlistList, setPlaylistList] = useState<IPlaylist[]>([])
	const [modalMessage, setModalMessage] = useState<string | null>(null);
	const [search, setSearch] = useState('');

	const [formData, setFormData] = useState({
		name: '',
		cover: '',
		created_by: '',
		songs: []
	});

	const fetchData = async () => {
		setLoading(true);
		const data = await getAllPlaylist();
		setPlaylistList(Array.isArray(data) ? data : []);
		setLoading(false);
	};

	useEffect(() => {
		const getUsername = () => {
			setFormData({ ...formData, created_by: getUserFromStorage() as string })
		}

		fetchData()
		getUsername()
	}, [])

	const handleAddPlaylist = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setFormData({
			name: '',
			cover: '',
			created_by: formData.created_by,
			songs: []
		});
		setModalMessage(null);
	};

	const handleNewPlaylist = async (e: React.FormEvent) => {
		e.preventDefault();
		const response = await createPlaylist(formData);
		if (response) {
			setModalMessage('Playlist created successfully!');
			await fetchData();
			setTimeout(handleCloseModal, 900);
		} else {
			setModalMessage('An error occurred while creating the playlist.');
		}
	}

	const filteredPlaylists = playlistList.filter(playlist =>
		playlist.name.toLowerCase().includes(search.trim().toLowerCase())
	);

	const handleInputChange = (e: any) => {
		const { name, value } = e.target;

		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};



	return (<>
		<header className="playlists-page-header">
			<div>
				<h1 className="playlists-page-title">Your <em>library</em></h1>
				<p className="playlists-page-subtitle">{playlistList.length} {playlistList.length === 1 ? "playlist" : "playlists"}</p>
			</div>
		</header>
		<section>
			<div className="playlists-toolbar">
				<div className="playlists-search-wrap">
					<i className="bi bi-search"></i>
					<input
						type="text"
						id="search-bar"
						className="playlists-search-bar"
						placeholder="Search by name…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<button
					className="playlists-add-playlist-btn"
					onClick={handleAddPlaylist}
					title="Create new playlist"
				>
					<i className="bi bi-plus-lg"></i>
					<span>New playlist</span>
				</button>
			</div>
			<div className="playlists-music-grid" id="music-grid">
				{
					loading ? (
						<div className="playlists-empty">
							<EqualizerBars size="md" />
							<p>Loading playlists…</p>
						</div>
					) : filteredPlaylists.length > 0 ? (
						filteredPlaylists.map((playlist: any, index) => {
							let cover = playlist.cover;
							if ((!cover || cover === "") && playlist.songs && playlist.songs.length > 0) {
								const youtube_id = playlist.songs[0].youtube_id;
								if (youtube_id) {
									cover = `https://img.youtube.com/vi/${youtube_id}/mqdefault.jpg`;
								}
							}
							if (!cover) {
								cover = "/default.png";
							}
							return (
								<PlaylistCard
									_id={playlist._id}
									title={playlist.name}
									created={playlist.created_by}
									cover={cover}
									songs={playlist.songs}
									key={index}
								/>
							);
						})
					) : playlistList.length > 0 ? (
						<div className="playlists-empty">
							<i className="bi bi-search"></i>
							<p>No playlists match "{search}".</p>
						</div>
					) : (
						<div className="playlists-empty">
							<i className="bi bi-collection"></i>
							<p>No playlists yet. Create one to get started.</p>
						</div>
					)
				}
			</div>
		</section>

		{/* Modal Popup */}
		{isModalOpen && (
			<div className="playlists-modal-overlay" onClick={handleCloseModal}>
				<div className="playlists-modal-content" onClick={(e) => e.stopPropagation()}>
					<div className="playlists-modal-header">
						<h3>Create New Playlist</h3>
						<button className="playlists-modal-close" onClick={handleCloseModal}>
							<i className="bi bi-x-lg"></i>
						</button>
					</div>
					{modalMessage && (
						<div className="playlists-modal-message">
							{modalMessage}
						</div>
					)}
					<form className="playlists-modal-form" onSubmit={handleNewPlaylist}>
						<div className="playlists-form-group">
							<label htmlFor="name">Playlist Name *</label>
							<input
								type="text"
								id="name"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								placeholder="My new playlist"
								required
							/>
						</div>

						<div className="playlists-modal-actions">
							<button type="button" className="playlists-btn-secondary" onClick={handleCloseModal}>
								Cancel
							</button>
							<button type="submit" className="playlists-btn-primary">
								Create Playlist
							</button>
						</div>
					</form>
				</div>
			</div>
		)}
	</>
	)
}
