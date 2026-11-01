export const RESIZE_CHANNEL = "image:resize"
export const OUTPUT_DIR_CHANNEL = "image:output-dir"

export const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".tif", ".tiff"] as const

export const MAX_DIMENSION = 16383

export const MAX_FILE_SIZE = 256 * 1024 * 1024

export interface ImageResizeEventData {
	path: string
	width: number
	height: number
}

export interface ImageResizerApi {
	getFilePath(file: File): string
	getOutputDir(): Promise<string>
	resize(data: ImageResizeEventData): Promise<void>
}
