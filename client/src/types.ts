
export interface ISong {
	title: string
	youtube_id: string
	artist: string
}

export interface IPlaylist {
	_id?: string,
	name: string,
	created_by: string
	songs: Array<ISong>
	cover?: string
}

export const Playlist: IPlaylist = {
	name: "",
	created_by: "",
	songs: [],
}