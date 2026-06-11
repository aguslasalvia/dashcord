import { useEffect, useState } from 'react'
import './Toast.css'

export interface ToastProps {
	message: string
	type: 'success' | 'error' | 'warning' | 'info'
	duration?: number
	onClose?: () => void
}

export default function Toast({ message, type, duration = 4000, onClose }: ToastProps) {
	const [isVisible, setIsVisible] = useState(true)

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false)
			setTimeout(() => {
				onClose?.()
			}, 300)
		}, duration)

		return () => clearTimeout(timer)
	}, [duration, onClose])

	return (
		<div className={`toast ${type} ${isVisible ? 'show' : 'hide'}`}>
			<div className="toast-message">{message}</div>
			<button className="toast-close" onClick={() => setIsVisible(false)}>
				×
			</button>
		</div>
	)
}


