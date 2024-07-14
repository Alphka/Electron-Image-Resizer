import { twMerge } from "tailwind-merge"
import logo from "./images/logo.svg"

export default function MainPage(){
	return (
		<main className="bg-emerald-800">
			<div className="flex flex-col align-center justify-center gap-6 max-w-xl mx-auto min-h-screen">
				<div className="flex flex-col w-full items-center justify-center bg-grey-lighter">
					<input id="file-input" className="hidden" type="file" />
					<label className="bg-white flex flex-col items-center px-4 py-7 gap-2 w-64 text-gray-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:text-teal-800" htmlFor="file-input">
						<img className="w-8" src={logo} />
						<span className="leading-normal">Select an image to resize</span>
					</label>
				</div>

				<form className={twMerge(
					"flex flex-col gap-4",
					"hidden"
				)}>
					<div className="flex flex-col gap-1">
						<label className="block text-white text-center w-80 m-auto py-3 shadow-sm border-gray-300 rounded-md" htmlFor="width">Width</label>
						<input type="number" name="width" id="width" className="block w-80 m-auto p-3 shadow-sm border-gray-300 rounded-md" placeholder="Image width" />
					</div>

					<div className="flex flex-col gap-1">
						<label className="block text-white text-center w-80 m-auto py-3 shadow-sm border-gray-300 rounded-md" htmlFor="height">Height</label>
						<input type="number" name="height" id="height" className="block w-80 m-auto p-3 shadow-sm border-gray-300 rounded-md" placeholder="Image height" />
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
						<strong>File:</strong>
						<span id="filename" />
					</p>
					<p>
						<strong>Output:</strong>
						<span id="output-path" />
					</p>
				</div>
			</div>
		</main>
	)
}
