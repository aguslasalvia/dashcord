import "./Login.css"
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useToast } from "@/hooks/useToast"
import { useAuth } from "@/hooks/useAuth"

import { saveToken } from "@/lib/token"
import { login } from "@/lib/auth"

export default function Login() {

	const { isAuthenticated } = useAuth()
	const navigate = useNavigate()

	const { showToast, ToastContainer } = useToast()
	const [form, setForm] = useState({
		username: "",
		password: ""
	})

	useEffect(() => {
		if (isAuthenticated)
			navigate("/dashboard/playlists")
	}, [isAuthenticated])


	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			const response = await login(form.username, form.password);

			if (response) {
				saveToken(response.token)
				localStorage.setItem("user", form.username)
				showToast("Login successful! Redirecting...", "success", 2000)
				setTimeout(() => {
					navigate('/dashboard/playlists')
				}, 1000)
			} else {
				showToast("User not found. Please check your credentials.", "error")
			}
		} catch (error) {
			showToast("Connection error. Please check if the server is running.", "error")
		}
	}

	return (
		<>
			<ToastContainer />
			<div className="login-container">
				<form className="login-form" onSubmit={handleLogin}>
					<h1 className="login-brand">dash<em>cord</em></h1>
					<p className="login-tagline">Sign in to your library.</p>
					<div className="input-group">
						<label htmlFor="username">Username</label>
						<input type="text" id="username" name="username" required
							onChange={(e) => {
								setForm({ ...form, username: e.target.value })
							}}
						/>
					</div>
					<div className="input-group">
						<label htmlFor="password">Password</label>
						<input type="password" id="password" name="password" required
							onChange={(e) => {
								setForm({ ...form, password: e.target.value })
							}} />
					</div>
					<input type="submit" value="Sign in" id="loginBtn" />
					<p className="login-switch">
						Don't have an account? <Link to="/register">Sign up</Link>
					</p>
				</form>
			</div>
		</>
	)
}
