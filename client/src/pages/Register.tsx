import "./Login.css"
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useToast } from "@/hooks/useToast"
import { useAuth } from "@/hooks/useAuth"
import EqualizerBars from "@/components/EqualizerBars/EqualizerBars"

import { saveToken } from "@/lib/token"
import { register } from "@/lib/auth"

export default function Register() {

	const { isAuthenticated } = useAuth()
	const navigate = useNavigate()

	const { showToast, ToastContainer } = useToast()
	const [form, setForm] = useState({
		username: "",
		password: "",
		confirmPassword: ""
	})

	useEffect(() => {
		if (isAuthenticated)
			navigate("/dashboard/playlists")
	}, [isAuthenticated])

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault()
		if (form.username === "" || form.password === "") {
			showToast("Please fill in all fields.", "error")
			return
		}

		if (form.password !== form.confirmPassword) {
			showToast("Passwords do not match.", "error")
			return
		}

		try {
			const response = await register(form.username, form.password)

			if (response) {
				saveToken(response.token)
				localStorage.setItem("user", form.username)
				showToast("Account created! Redirecting...", "success", 2000)
				setTimeout(() => {
					navigate('/dashboard/playlists')
				}, 1000)
			} else {
				showToast("That username is already taken.", "error")
			}
		} catch (error) {
			showToast("Connection error. Please check if the server is running.", "error")
		}
	}

	return (
		<>
			<ToastContainer />
			<div className="login-container">
				<form className="login-form" onSubmit={handleRegister}>
					<div className="login-hero">
						<EqualizerBars size="hero" />
						<h1 className="login-brand">dash<em>cord</em></h1>
						<p className="login-tagline">Create your library.</p>
					</div>
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
					<div className="input-group">
						<label htmlFor="confirmPassword">Confirm password</label>
						<input type="password" id="confirmPassword" name="confirmPassword" required
							onChange={(e) => {
								setForm({ ...form, confirmPassword: e.target.value })
							}} />
					</div>
					<input type="submit" value="Create account" id="loginBtn" />
					<p className="login-switch">
						Already have an account? <Link to="/">Sign in</Link>
					</p>
				</form>
			</div>
		</>
	)
}
