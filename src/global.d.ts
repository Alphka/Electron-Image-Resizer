declare module "*.svg" {
	const content: string
	export default content
}

interface Window {
	imageResizer: import("./shared").ImageResizerApi
}

declare module "*.css" {}
