import type { FormEventHandler } from "react"
import { useCallback, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import { toast } from "react-toastify"
import logo from "./images/logo.svg"

declare var ipcRenderer: typeof import("electron").ipcRenderer
declare var path: typeof import("path")
declare var os: typeof import("os")

export interface ImageResizeEventData {
	path: string
	width: number
	height: number
}

export default function MainPage(){
	const [file, setFile] = useState<File | null>(null)
	const [outputPath, setOutputPath] = useState<string | null>(null)
	const [inputWidth, setInputWidth] = useState<number | undefined>(undefined)
	const [inputHeight, setInputHeight] = useState<number | undefined>(undefined)
	const [isFormHidden, setIsFormHidden] = useState(true)
	const imageWidth = useRef(0)
	const imageHeight = useRef(0)

	const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(event => {
		event.preventDefault()

		if(!file) return toast.error("Please upload an image")

		let errored = false
		const width = imageWidth.current
		const height = imageHeight.current

		if(!width) errored = true, toast.error("Invalid image width")
		if(!height) errored = true, toast.error("Invalid image height")

		if(errored) return

		const { path } = file

		ipcRenderer.send("image:resize", {
			path,
			width,
			height
		})

		function handleSuccess(){
			toast.success("Image resized successfully", { autoClose: 5e3 })
			ipcRenderer.removeListener("image:error", handleError)
		}

		function handleError(error: any){
			console.error(error)
			toast.error("Something went wrong")
			ipcRenderer.removeListener("image:done", handleSuccess)
		}

		ipcRenderer.once("image:done", handleSuccess)
		ipcRenderer.once("image:error", handleError)
	}, [file])

	return (
		<main className="bg-emerald-800">
			<div className="flex flex-col align-center justify-center gap-6 max-w-xl mx-auto min-h-screen">
				<div className="flex flex-col w-full items-center justify-center bg-grey-lighter">
					<input
						id="input-file"
						type="file"
						accept="image/*"
						className="hidden"
						onChange={event => {
							const file = event.currentTarget.files!.item(0)

							if(!file){
								toast.error("Please select an image")
								setFile(null)
								setOutputPath(null)
								setIsFormHidden(true)
								return
							}

							const image = new Image()

							image.src = URL.createObjectURL(file)

							image.onload = () => {
								const { width, height } = image
								imageWidth.current = width
								imageHeight.current = height
								setInputWidth(width || undefined)
								setInputHeight(height || undefined)
							}

							setFile(file)
							setOutputPath(path.join(os.tmpdir(), "image-resizer").replaceAll("\\", "/"))
							setIsFormHidden(false)
						}}
						required
					/>

					<label
						htmlFor="input-file"
						className="bg-white flex flex-col items-center px-4 py-7 gap-2 w-64 text-gray-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:text-teal-800"
					>
						<img className="w-8" src={logo} />
						<span className="leading-normal">Select an image to resize</span>
					</label>
				</div>

				<form
					className={twMerge(
						"flex flex-col gap-4",
						isFormHidden && "hidden"
					)}
					onSubmit={handleSubmit}
				>
					<div className="flex flex-col gap-1">
						<label className="block text-white text-center w-80 m-auto py-3 shadow-sm border-gray-300 rounded-md" htmlFor="width">Width</label>
						<input
							type="number"
							name="width"
							className="block w-80 m-auto p-3 shadow-sm border-gray-300 rounded-md"
							onChange={event => {
								const { value } = event.currentTarget
								const width = Number(value)
								imageWidth.current = Number.isFinite(width) && !Number.isNaN(width) ? width : 0
							}}
							defaultValue={inputWidth}
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="block text-white text-center w-80 m-auto py-3 shadow-sm border-gray-300 rounded-md" htmlFor="height">Height</label>
						<input
							type="number"
							name="height"
							className="block w-80 m-auto p-3 shadow-sm border-gray-300 rounded-md"
							onChange={event => {
								const { value } = event.currentTarget
								const height = Number(value)
								imageHeight.current = Number.isFinite(height) && !Number.isNaN(height) ? height : 0
							}}
							defaultValue={inputHeight}
						/>
					</div>

					<button
						type="submit"
						className="w-80 m-auto flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-500 hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Resize
					</button>
				</form>

				<div className="flex flex-col gap-2 text-white text-lg text-center font-mono">
					<p>
						<strong>File: </strong>
						<span>{file?.name}</span>
					</p>
					<p>
						<strong>Output: </strong>
						<span>{outputPath}</span>
					</p>
				</div>
			</div>
		</main>
	)
}
