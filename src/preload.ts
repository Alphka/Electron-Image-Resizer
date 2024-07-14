import { contextBridge } from "electron"
import { tmpdir } from "os"
import { join } from "path"

contextBridge.exposeInMainWorld("os", {
	tmpdir
})

contextBridge.exposeInMainWorld("path", {
	join
})
