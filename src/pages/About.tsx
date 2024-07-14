import logo from "./images/logo.svg"

export default function AboutPage(){
	return (
		<main className="bg-teal-800">
			<div className="flex flex-col align-center justify-center gap-2 text-xl text-center max-w-xl m-auto min-h-screen">
				<img src={logo} alt="ImageResizer" className="pb-5 w-8" />
				<h2 className="text-teal-100 text-center">ImageResizer App</h2>
				<p className="text-teal-300">Version 1.0.0</p>
				<p className="text-teal-300">MIT License</p>
			</div>
		</main>
	)
}
