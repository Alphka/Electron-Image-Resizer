import { app, BrowserWindow, Menu } from "electron"
import { join } from "path"

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
})

app.on("window-all-closed", () => {
	if(!isMac){
		app.quit()
	}
})
