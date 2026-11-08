import type { IImageResizerApi } from "./shared"
import { contextBridge, ipcRenderer, webUtils } from "electron"
import { OUTPUT_DIR_CHANNEL, RESIZE_CHANNEL } from "./shared"

const api: IImageResizerApi = {
	resize: ({ path, width, height }) => ipcRenderer.invoke(RESIZE_CHANNEL, {
		path,
		width,
		height
	}),
	getFilePath: (file) => webUtils.getPathForFile(file),
	getOutputPath: () => ipcRenderer.invoke(OUTPUT_DIR_CHANNEL)
}

contextBridge.exposeInMainWorld("imageResizer", api)
