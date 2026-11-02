declare module "*.svg" {
	const content: string
	export default content
}

interface Window {
	imageResizer: import("./shared").IImageResizerApi
}

declare module "*.css" {}
