import { Outlet } from "react-router-dom";
import Footer from "../Share/Footer";
import Navbar from "../Share/Navbar";

const Main = () => {
	return (
		<div>
			<Navbar />
			<Outlet />
			<Footer />
		</div>
	);
};

export default Main;
