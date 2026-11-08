import { IMAGE_EXTENSIONS } from "../shared"
import { useRef, useState } from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { toast } from "react-toastify"
import isValidDimension from "../helpers/isValidDimension"
import logo from "./images/logo.svg"

export default function MainPage(){
	const [isFormHidden, setIsFormHidden] = useState(true)
	const [inputHeight, setInputHeight] = useState<number | undefined>(undefined)
	const [inputWidth, setInputWidth] = useState<number | undefined>(undefined)
	const [outputPath, setOutputPath] = useState<string | null>(null)
	const [file, setFile] = useState<File | null>(null)
	const imageHeight = useRef(0)
	const imageWidth = useRef(0)

	return (
		<main className="bg-emerald-800">
			<div className="min-h-screen max-w-xl flex flex-col justify-center gap-6 mx-auto">
				<div className="w-full flex flex-col items-center justify-center">
					<input
						className="hidden"
						id="input-file"
						type="file"
						accept={IMAGE_EXTENSIONS.join(",")}
						onChange={(event) => {
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

							image.addEventListener("load", () => {
								URL.revokeObjectURL(image.src)

								const { width, height } = image

								imageWidth.current = width
								imageHeight.current = height

								setInputWidth(width || undefined)
								setInputHeight(height || undefined)
							})

							setFile(file)
							window.imageResizer.getOutputPath().then((path) => setOutputPath(path.replaceAll("\\", "/")))
							setIsFormHidden(false)
						}}
						required
					/>

					<label
						className={twJoin(
							"bg-white w-64 flex flex-col items-center text-gray-500 px-4 py-7 rounded-lg shadow-lg tracking-wide uppercase cursor-pointer gap-2",
							"border border-gray-200",
							"hover:text-teal-800"
						)}
						htmlFor="input-file"
					>
						<img className="w-8" src={logo} alt="" />
						<span className="leading-normal">Select an image to resize</span>
					</label>
				</div>

				<form
					className={twMerge(
						"flex flex-col gap-4",
						isFormHidden && "hidden"
					)}
					onSubmit={async (event) => {
						event.preventDefault()

						if(!file) return toast.error("Please upload an image")

						let errored = false
						const width = imageWidth.current
						const height = imageHeight.current

						if(!isValidDimension(width)){
							errored = true
							toast.error("Invalid image width")
						}

						if(!isValidDimension(height)){
							errored = true
							toast.error("Invalid image height")
						}

						if(errored) return

						const path = window.imageResizer.getFilePath(file)

						if(!path) return toast.error("Could not read the image path")

						try{
							await window.imageResizer.resize({
								path,
								width,
								height
							})

							toast.success("Image resized successfully", { autoClose: 5e3 })
						}catch(error){
							console.error(error)
							toast.error("Something went wrong")
						}
					}}
				>
					<div className="flex flex-col gap-1">
						<label
							className="block text-white text-center w-80 py-3 mx-auto rounded-md shadow-xs"
							htmlFor="width"
						>
							Width
						</label>
						<input
							className="w-80 block bg-white p-3 mx-auto border-gray-300 rounded-md shadow-xs"
							type="number"
							name="width"
							onChange={(event) => {
								const { value } = event.currentTarget
								const width = Number(value)

								imageWidth.current = Number.isFinite(width) && !Number.isNaN(width) ? width : 0
							}}
							defaultValue={inputWidth}
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label
							className="w-80 block text-white text-center py-3 mx-auto rounded-md shadow-xs"
							htmlFor="height"
						>
							Height
						</label>
						<input
							className="w-80 block bg-white p-3 mx-auto border-gray-300 rounded-md shadow-xs"
							type="number"
							name="height"
							onChange={(event) => {
								const { value } = event.currentTarget
								const height = Number(value)

								imageHeight.current = Number.isFinite(height) && !Number.isNaN(height) ? height : 0
							}}
							defaultValue={inputHeight}
						/>
					</div>

					<button
						className={twJoin(
							"w-80 bg-teal-500 flex justify-center text-white text-sm font-medium px-4 py-2 mx-auto rounded-md shadow-xs cursor-pointer",
							"border border-transparent",
							"hover:bg-teal-900",
							"focus:outline-none focus:ring-2 focus:ring-blue-500"
						)}
						type="submit"
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
