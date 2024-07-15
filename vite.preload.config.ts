import type { ConfigEnv, UserConfig } from "vite"
import { getBuildConfig, external, pluginHotRestart } from "./vite.base.config"
import { defineConfig, mergeConfig } from "vite"

export default defineConfig(env => {
	const forgeEnv = env as ConfigEnv<"build">
	const { forgeConfigSelf } = forgeEnv
	const config: UserConfig = {
		build: {
			rollupOptions: {
				external,
				input: forgeConfigSelf.entry!,
				output: {
					format: "cjs",
					inlineDynamicImports: true,
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
