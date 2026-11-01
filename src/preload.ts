import type { ImageResizerApi } from "./shared"
import { contextBridge, ipcRenderer, webUtils } from "electron"
import { OUTPUT_DIR_CHANNEL, RESIZE_CHANNEL } from "./shared"

const api: ImageResizerApi = {
	getFilePath: file => webUtils.getPathForFile(file),
	getOutputDir: () => ipcRenderer.invoke(OUTPUT_DIR_CHANNEL),
	resize: ({ path, width, height }) => ipcRenderer.invoke(RESIZE_CHANNEL, { path, width, height })
}

contextBridge.exposeInMainWorld("imageResizer", api)
