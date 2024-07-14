import logo from "./images/logo.svg"

export default function AboutPage(){
	return (
		<main className="bg-emerald-800">
			<div className="flex flex-col align-center justify-center gap-5 max-w-xl m-auto min-h-screen">
				<img src={logo} alt="ImageResizer" className="w-8 mx-auto" />

				<div className="flex flex-col align-center justify-center text-xl text-center gap-2">
					<h2 className="text-teal-100 text-center">ImageResizer App</h2>
					<p className="text-teal-300">Version 1.0.0</p>
					<p className="text-teal-300">MIT License</p>
				</div>
			</div>
		</main>
	)
}
