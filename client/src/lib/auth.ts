
import axios from "axios"
import { API_URL } from "./config"

export const login = async (username: string, password: string) => {
	try {
		const response = await axios.post(
			`${API_URL}/auth/login`,
			{ username, password }
		)
		if (response.status !== 200) return null
		return response.data
	} catch (error: any) {
		return null
	}
}


export const register = async (username: string, password: string) => {
	try {
		const response = await axios.post(
			`${API_URL}/auth/register`,
			{ username, password }
		)
		if (response.status !== 200) return null
		return response.data
	} catch (error: any) {
		return null
	}
}


export const logout = async (navigate: (path: string) => void) => {
	localStorage.clear()
	navigate("/")
}


export const getUserFromStorage = () => {
	const user = localStorage.getItem("user") as string
	return user
}

