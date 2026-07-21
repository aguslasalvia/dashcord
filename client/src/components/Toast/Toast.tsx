import { useEffect, useRef, useState } from 'react'
import './Toast.css'

export interface ToastProps {
	message: string
	type: 'success' | 'error' | 'warning' | 'info'
	duration?: number
	onClose?: () => void
}

export default function Toast({ message, type, duration = 4000, onClose }: ToastProps) {
	const [isVisible, setIsVisible] = useState(true)
	const onCloseRef = useRef(onClose)
	onCloseRef.current = onClose

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false)
			setTimeout(() => {
				onCloseRef.current?.()
			}, 300)
		}, duration)

		return () => clearTimeout(timer)
		// Only (re)start the dismiss timer when `duration` actually changes —
		// `onClose` is a fresh closure on every parent render and would otherwise
		// keep resetting the timer forever, so the toast never disappears.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [duration])

	return (
		<div className={`toast ${type} ${isVisible ? 'show' : 'hide'}`}>
			<div className="toast-message">{message}</div>
			<button className="toast-close" onClick={() => setIsVisible(false)}>
				×
			</button>
		</div>
	)
}


