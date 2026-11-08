import type { ConfigEnv } from "vite"
import { pluginExposeRenderer } from "./vite.base.config.mts"
import { defineConfig } from "vite"

export default defineConfig((env) => {
	const forgeEnv = env as ConfigEnv<"renderer">
	const { root, mode, forgeConfigSelf } = forgeEnv

	return {
		root,
		mode,
		base: "./",
		build: {
			outDir: `.vite/renderer/${forgeConfigSelf.name}`
		},
		plugins: [
			pluginExposeRenderer(forgeConfigSelf.name)
		],
		resolve: {
			preserveSymlinks: true
		},
		clearScreen: false
	}
})
