import type { IpcMainInvokeEvent } from "electron"
import { IMAGE_EXTENSIONS, MAX_FILE_SIZE, OUTPUT_DIR_CHANNEL, RESIZE_CHANNEL } from "./shared"
import { app, BrowserWindow, ipcMain, Menu, shell } from "electron"
import { extname, isAbsolute, join, parse } from "node:path"
import { mkdir, readFile, stat, writeFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { tmpdir } from "node:os"
import isValidDimension from "./helpers/isValidDimension"
import sharp from "sharp"

const isMac = process.platform === "darwin"
const outputFolder = join(tmpdir(), "image-resizer")

if(require("electron-squirrel-startup")){
	app.quit()
}

function createMainWindow(){
	const mainWindow = new BrowserWindow({
		title: "Image Resizer",
		width: 1300,
		height: 800,
		webPreferences: {
			preload: join(__dirname, "preload.js"),
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: true
		}
	})

	mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }))

	if(MAIN_WINDOW_VITE_DEV_SERVER_URL){
		mainWindow.webContents.openDevTools()
		mainWindow.loadURL(new URL("/#/home", MAIN_WINDOW_VITE_DEV_SERVER_URL).href)
	}else{
		mainWindow.setSize(500, mainWindow.getSize()[1])
		mainWindow.loadFile(join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`), { hash: "home" })
	}

	return mainWindow
}

async function validateInputPath(path: unknown){
	// "\\" prefix: UNC paths would make Windows contact a remote host
	if(typeof path !== "string" || !isAbsolute(path) || path.startsWith("\\\\")) throw new Error("Invalid image path")
	if(!(IMAGE_EXTENSIONS as readonly string[]).includes(extname(path).toLowerCase())) throw new Error("Unsupported image type")

	const stats = await stat(path)
	if(!stats.isFile()) throw new Error("Invalid image path")
	if(stats.size > MAX_FILE_SIZE) throw new Error("Image file is too large")
}

app.whenReady().then(() => {
	const mainWindow = createMainWindow()

	Menu.setApplicationMenu(Menu.buildFromTemplate([
		{
			label: "File",
			submenu: [
				{
					label: "Quit",
					click: app.quit,
					accelerator: "CmdOrCtrl+W"
				}
			]
		},
		{
			label: "Help",
			submenu: [
				{
					label: "About",
					click: () => {
						const aboutWindow = new BrowserWindow({
							title: "About Image Resizer",
							width: 300,
							height: 300,
							modal: true,
							parent: mainWindow,
							minimizable: false,
							autoHideMenuBar: true
						})

						if(MAIN_WINDOW_VITE_DEV_SERVER_URL){
							aboutWindow.loadURL(new URL("/#/about", MAIN_WINDOW_VITE_DEV_SERVER_URL).href)
						}else{
							aboutWindow.loadFile(join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`), { hash: "about" })
						}
					}
				}
			]
		}
	]))

	function isTrustedSender(event: IpcMainInvokeEvent){
		return event.sender === mainWindow.webContents
	}

	ipcMain.handle(OUTPUT_DIR_CHANNEL, (event) => {
		if(!isTrustedSender(event)) throw new Error("Untrusted sender")
		return outputFolder
	})

	ipcMain.handle(RESIZE_CHANNEL, async (event, data: unknown) => {
		if(!isTrustedSender(event)) throw new Error("Untrusted sender")

		const { path, width, height } = (data ?? {}) as Record<string, unknown>

		if(!isValidDimension(width) || !isValidDimension(height)){
			throw new Error("Invalid image dimensions")
		}

		await validateInputPath(path)

		try{
			const inputPath = path as string
			const resizedFilebuffer = await sharp(await readFile(inputPath))
				.keepExif()
				.keepMetadata()
				.resize(width, height, { fit: "inside" })
				.toBuffer()

			if(!existsSync(outputFolder)){
				await mkdir(outputFolder, { recursive: true })
			}

			const { name, ext } = parse(inputPath)

			let outputPath = join(outputFolder, name + ext)

			for(let i = 1; existsSync(outputPath); i++){
				outputPath = join(outputFolder, `${name} (${i})${ext}`)
			}

			await writeFile(outputPath, resizedFilebuffer)
			await shell.openPath(outputPath)
		}catch(error){
			console.error(error)
			throw new Error("Failed to resize the image")
		}
	})
})

app.on("window-all-closed", () => {
	if(!isMac){
		app.quit()
	}
})
