import { HashRouter, Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import AboutPage from "./pages/About"
import Homepage from "./pages/Homepage"
import "./main.css"

export default function App(){
	return (
		<>
			<HashRouter>
				<Routes>
					<Route path="/home" Component={Homepage} />
					<Route path="/about" Component={AboutPage} />
				</Routes>
			</HashRouter>

			<ToastContainer theme="dark" autoClose={3000} pauseOnHover={false} />
		</>
	)
}
