export const RESIZE_CHANNEL = "image:resize"
export const OUTPUT_DIR_CHANNEL = "image:output-dir"

export const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".tif", ".tiff"] as const

export const MAX_DIMENSION = 16_383

export const MAX_FILE_SIZE = 256 * 1024 * 1024

export interface IImageResizeEventData {
	path: string
	width: number
	height: number
}

export interface IImageResizerApi {
	resize: (data: IImageResizeEventData) => Promise<void>
	getFilePath: (file: File) => string
	getOutputDir: () => Promise<string>
}
