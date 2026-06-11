import axios from "axios";
import { getToken } from "./token";

export const searchSong = async (query: string) => {
	let token = getToken()
	console.log(getToken())
	const response = await axios.get(import.meta.env.VITE_API_URL + "/songs/search", {
		headers: {
			Authorization: "Bearer " + token
		},
		params: { q: query }
	})
	if (response.status == 200) {
		return response.data["result"]
	}
	else return []
};