import { useState } from "react"
import { twMerge } from "tailwind-merge"
import { toast } from "react-toastify"
import logo from "./images/logo.svg"

declare var os: typeof import("os")
declare var path: typeof import("path")

export default function MainPage(){
	const [filename, setFilename] = useState<string | null>(null)
	const [outputPath, setOutputPath] = useState<string | null>(null)
	const [inputWidth, setInputWidth] = useState<number | undefined>(undefined)
	const [inputHeight, setInputHeight] = useState<number | undefined>(undefined)
	const [isFormHidden, setIsFormHidden] = useState(true)

	return (
		<main className="bg-emerald-800">
			<div className="flex flex-col align-center justify-center gap-6 max-w-xl mx-auto min-h-screen">
				<div className="flex flex-col w-full items-center justify-center bg-grey-lighter">
					<input
						id="input-file"
						type="file"
						accept=".gif,.png,.jpg,.jpeg,.jfif,.jfi"
						className="hidden"
						onChange={event => {
							const file = event.currentTarget.files!.item(0)

							if(!file){
								toast.error("Please select an image")
								setFilename(null)
								setOutputPath(null)
								setIsFormHidden(true)
								return
							}

							const image = new Image()

							image.src = URL.createObjectURL(file)

							image.onload = () => {
								setInputWidth(image.width || undefined)
								setInputHeight(image.height || undefined)
							}

							setFilename(file.name)
							setOutputPath(path.join(os.tmpdir(), "image-resizer").replaceAll("\\", "/"))
							setIsFormHidden(false)
						}}
					/>

					<label
						htmlFor="input-file"
						className="bg-white flex flex-col items-center px-4 py-7 gap-2 w-64 text-gray-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:text-teal-800"
					>
						<img className="w-8" src={logo} />
						<span className="leading-normal">Select an image to resize</span>
					</label>
				</div>

				<form className={twMerge(
					"flex flex-col gap-4",
					isFormHidden && "hidden"
				)}>
					<div className="flex flex-col gap-1">
						<label className="block text-white text-center w-80 m-auto py-3 shadow-sm border-gray-300 rounded-md" htmlFor="width">Width</label>
						<input
							type="number"
							name="width"
							className="block w-80 m-auto p-3 shadow-sm border-gray-300 rounded-md"
							defaultValue={inputWidth}
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="block text-white text-center w-80 m-auto py-3 shadow-sm border-gray-300 rounded-md" htmlFor="height">Height</label>
						<input
							type="number"
							name="height"
							className="block w-80 m-auto p-3 shadow-sm border-gray-300 rounded-md"
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
						<span>{filename}</span>
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
