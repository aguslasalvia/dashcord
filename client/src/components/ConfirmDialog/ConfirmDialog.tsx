import "./ConfirmDialog.css"

interface ConfirmDialogProps {
	open: boolean
	title: string
	message: string
	confirmLabel?: string
	danger?: boolean
	onConfirm: () => void
	onCancel: () => void
}

export default function ConfirmDialog({
	open,
	title,
	message,
	confirmLabel = "Confirm",
	danger = true,
	onConfirm,
	onCancel,
}: ConfirmDialogProps) {
	if (!open) return null

	return (
		<div className="confirm-dialog-overlay" onClick={onCancel}>
			<div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
				<h3>{title}</h3>
				<p>{message}</p>
				<div className="confirm-dialog-actions">
					<button className="confirm-dialog-btn-secondary" onClick={onCancel}>
						Cancel
					</button>
					<button
						className={danger ? "confirm-dialog-btn-danger" : "confirm-dialog-btn-primary"}
						onClick={onConfirm}
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	)
}
