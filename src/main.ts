import { app, BrowserWindow, Menu } from "electron"
import { join } from "path"

const isDevelopment = process.env.NODE_ENV !== "production"
const isMac = process.platform === "darwin"

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if(require("electron-squirrel-startup")){
	app.quit()
}

function createMainWindow(){
	const mainWindow = new BrowserWindow({
		title: "Image Resizer",
		width: isDevelopment ? 1000 : 500,
		height: 600,
		webPreferences: {
			preload: join(__dirname, "preload.js")
		}
	})

	if(isDevelopment){
		mainWindow.webContents.openDevTools()
	}

	// mainWindow.loadFile(join(__dirname, "renderer/index.html"))

	if(MAIN_WINDOW_VITE_DEV_SERVER_URL){
		mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
	}else{
		mainWindow.loadFile(join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
	}
}

app.whenReady().then(() => {
	createMainWindow()

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
		}
	]))

	app.on("activate", () => {
		if(!BrowserWindow.getAllWindows().length){
			createMainWindow()
		}
	})
})

app.on("window-all-closed", () => {
	if(!isMac){
		app.quit()
	}
})
