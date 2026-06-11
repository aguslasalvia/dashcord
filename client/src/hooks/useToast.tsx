import Toast, { ToastProps } from "@/components/Toast/Toast"
import { useState } from "react"

export const useToast = () => {
	const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([])

	const showToast = (message: string, type: ToastProps['type'] = 'info', duration?: number) => {
		const id = Math.random().toString(36).substr(2, 9)
		const newToast = { message, type, duration, id }

		setToasts(prev => [...prev, newToast])

		return id
	}

	const removeToast = (id: string) => {
		setToasts(prev => prev.filter(toast => toast.id !== id))
	}

	const ToastContainer = () => (
		<div className="toast-container">
			{toasts.map(toast => (
				<Toast
					key={toast.id}
					message={toast.message}
					type={toast.type}
					duration={toast.duration}
					onClose={() => removeToast(toast.id)}
				/>
			))}
		</div>
	)

	return { showToast, removeToast, ToastContainer }
}

