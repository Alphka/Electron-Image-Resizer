import type { ImageResizeEventData } from "./pages/Homepage"
import { app, BrowserWindow, ipcMain, Menu, shell } from "electron"
import { mkdir, readFile, writeFile } from "fs/promises"
import { join, parse } from "path"
import { existsSync } from "fs"
import { tmpdir } from "os"
import sharp from "sharp"

const isMac = process.platform === "darwin"

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
			nodeIntegration: true
		}
	})

	if(MAIN_WINDOW_VITE_DEV_SERVER_URL){
		mainWindow.webContents.openDevTools()
		mainWindow.loadURL(new URL("/#/home", MAIN_WINDOW_VITE_DEV_SERVER_URL).href)
	}else{
		mainWindow.setSize(500, mainWindow.getSize()[1])
		mainWindow.loadFile(join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`), { hash: "home" })
	}

	return mainWindow
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
					accelerator: "CtrlOrCtrl+W"
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

	app.on("activate", () => {
		if(!BrowserWindow.getAllWindows().length){
			createMainWindow()
		}
	})

	ipcMain.on("image:resize", async (event, { path, width, height }: ImageResizeEventData) => {
		try{
			const resizedFilebuffer = await sharp(await readFile(path))
				.keepExif()
				.keepMetadata()
				.resize(width, height)
				.toBuffer()

			const outputFolder = join(tmpdir(), "image-resizer")
			if(!existsSync(outputFolder)) await mkdir(outputFolder, { recursive: true })

			const { name, ext } = parse(path)
			let outputPath = join(outputFolder, name + ext)
			for(let i = 1; existsSync(outputPath); i++) outputPath = join(outputFolder, `${name} (${i})${ext}`)

			await writeFile(outputPath, resizedFilebuffer)

			mainWindow.webContents.send("image:done")

			await shell.openPath(outputPath)
		}catch(error){
			mainWindow.webContents.send("image:error", error)
			console.error(error)
		}
	})
})

app.on("window-all-closed", () => {
	if(!isMac){
		app.quit()
	}
})
