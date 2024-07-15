import { contextBridge, ipcRenderer } from "electron"
import path from "path"
import os from "os"

contextBridge.exposeInMainWorld("os", {
	tmpdir: os.tmpdir
})

contextBridge.exposeInMainWorld("path", {
	join: path.join
})

contextBridge.exposeInMainWorld("ipcRenderer", {
	removeListener: ipcRenderer.removeListener,
	send: ipcRenderer.send,
	once: ipcRenderer.once,
	on: ipcRenderer.on
})
