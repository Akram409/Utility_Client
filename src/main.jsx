import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AllProvider } from "./Component/Context/AllContext";
import { router } from "./Component/Router/Router";
import AuthProvider from "./Provider/Authprovider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<AllProvider>
			<AuthProvider>
				<RouterProvider router={router} />
			</AuthProvider>
		</AllProvider>
	</React.StrictMode>
);
