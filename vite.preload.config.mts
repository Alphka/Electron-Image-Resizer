import type { ConfigEnv, UserConfig } from "vite"
import { external, getBuildConfig, pluginHotRestart } from "./vite.base.config.mts"
import { defineConfig, mergeConfig } from "vite"

export default defineConfig((env) => {
	const forgeEnv = env as ConfigEnv<"build">
	const { forgeConfigSelf } = forgeEnv

	const config: UserConfig = {
		build: {
			rolldownOptions: {
				external,
				input: forgeConfigSelf.entry,
				output: {
					format: "cjs",
					codeSplitting: false,
					entryFileNames: "[name].js",
					chunkFileNames: "[name].js",
					assetFileNames: "[name].[ext]"
				}
			}
		},
		plugins: [pluginHotRestart("reload")]
	}

	return mergeConfig(getBuildConfig(forgeEnv), config)
})
