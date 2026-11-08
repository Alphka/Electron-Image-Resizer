import type { ConfigEnv, Plugin, UserConfig } from "vite"
import { builtinModules } from "node:module"
import packageData from "./package.json" with { type: "json" }

export const builtins = [
	"electron",
	...builtinModules.flatMap((e) => [e, `node:${e}`])
]

export const external = [
	...builtins,
	...Object.keys("dependencies" in packageData ? (packageData.dependencies) : {})
]

export function getBuildConfig(env: ConfigEnv<"build">): UserConfig{
	const { root, mode, command } = env

	return {
		root,
		mode,
		build: {
			emptyOutDir: false,
			outDir: ".vite/build",
			watch: command === "serve" ? {} : null,
			minify: command === "build"
		},
		clearScreen: false
	}
}

export function getDefineKeys(names: string[]){
	const define: { [name: string]: VitePluginRuntimeKeys } = {}

	return names.reduce((acc, name) => {
		const NAME = name.toUpperCase()
		const keys: VitePluginRuntimeKeys = {
			VITE_DEV_SERVER_URL: `${NAME}_VITE_DEV_SERVER_URL`,
			VITE_NAME: `${NAME}_VITE_NAME`
		}

		return { ...acc, [name]: keys }
	}, define)
}

export function getBuildDefine(env: ConfigEnv<"build">){
	const { command, forgeConfig } = env

	const names = forgeConfig.renderer.filter(({ name }) => name).map(({ name }) => name)
	const defineKeys = getDefineKeys(names)

	return Object.entries(defineKeys).reduce<Record<string, any>>((accumulator, [name, keys]) => {
		const { VITE_DEV_SERVER_URL, VITE_NAME } = keys

		return {
			...accumulator,
			[VITE_DEV_SERVER_URL]: command === "serve" ? JSON.stringify(process.env[VITE_DEV_SERVER_URL]) : undefined,
			[VITE_NAME]: JSON.stringify(name)
		}
	}, {})
}

export function pluginExposeRenderer(name: string): Plugin{
	const { VITE_DEV_SERVER_URL } = getDefineKeys([name])[name]

	return {
		name: "@electron-forge/plugin-vite:expose-renderer",
		configureServer(server){
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			process.viteDevServers ??= {}
			process.viteDevServers[name] = server

			server.httpServer?.once("listening", () => {
				const addressInfo = server.httpServer!.address()

				if(addressInfo){
					process.env[VITE_DEV_SERVER_URL] = typeof addressInfo === "string" ? addressInfo : `http://localhost:${addressInfo.port}`
				}
			})
		}
	}
}

export function pluginHotRestart(command: "reload" | "restart"): Plugin{
	return {
		name: "@electron-forge/plugin-vite:hot-restart",
		closeBundle(){
			if(command === "reload"){
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				if(process.viteDevServers){
					for(const server of Object.values(process.viteDevServers)){
						server.ws.send({ type: "full-reload" })
					}
				}
			}else{
				process.stdin.emit("data", "rs")
			}
		}
	}
}
