
import axios from "axios"

export const login = async (username: string, password: string) => {
	try {
		const response = await axios.post(
			`${import.meta.env.VITE_API_URL}/auth/login`,
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

