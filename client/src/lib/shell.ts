import { isTauri } from "@tauri-apps/api/core"

export const openExternal = async (url: string) => {
	if (isTauri()) {
		const { open } = await import("@tauri-apps/plugin-shell")
		await open(url)
	} else {
		window.open(url, "_blank")
	}
}
