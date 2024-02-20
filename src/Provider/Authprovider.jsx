import axios from "axios";
import {
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	getAuth,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { app } from "../firebase/firebase.config";

export const AuthContext = createContext(null);

const auth = getAuth(app);

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const googleProvider = new GoogleAuthProvider();

	const googleSignIn = () => {
		setLoading(true);
		return signInWithPopup(auth, googleProvider);
	};

	// useEffect(() => {
	// 	// Check if user is logged in
	// 	const token = localStorage.getItem("access-token");
	// 	if (token) {
	// 		// Verify token on the server
	// 		axios
	// 			.post("http://localhost:5000/verifyToken", { token })
	// 			.then(() => {
	// 				setUser({ token });
	// 			})
	// 			.catch(() => {
	// 				localStorage.removeItem("token");
	// 			})
	// 			.finally(() => {
	// 				setLoading(false);
	// 			});
	// 	} else {
	// 		setLoading(false);
	// 	}
	// }, []);

	const logOut = () => {
		setLoading(true);
		signOut(auth)
			.then(() => {
				localStorage.removeItem("access-token");
				setUser(null);
			})
			.catch(error => {
				console.error("Sign out error:", error);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const login = async (email, password) => {
		try {
			// Sign in with Firebase
			const userCredential = await signInWithEmailAndPassword(auth, email, password);

			console.log(userCredential);

			// Send login request to backend
			const response = await axios.post("http://localhost:5000/login", {
				email,
				password,
			});

			// Store access token and update user state
			const { token } = response.data;
			localStorage.setItem("access-token", token);
			setUser({ token });
		} catch (error) {
			// Handle Firebase and API errors
			console.error("Login error:", error);
			// Display an appropriate error message to the user
		}
	};

	const signup = async userData => {
		const { password, email } = userData;
		try {
			// Create a new user with email and password in Firebase
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;
			console.log(user);
		} catch (error) {
			// Handle Firebase and API errors
			console.error("Login error:", error);
			// Display an appropriate error message to the user
		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, currentUser => {
			setUser(currentUser);
			// if (currentUser) {
			//   axios
			//     .post("http://localhost:5000/jwt", {
			//       email: currentUser.email,
			//     })
			//     .then((data) => {
			//       localStorage.setItem("access-token", data.data.token);
			//       setLoading(false);
			//     });
			// } else {
			//   localStorage.removeItem("access-token");
			// }
		});
		return () => {
			return unsubscribe();
		};
	}, []);

	const authInfo = {
		login,
		user,
		setUser,
		loading,
		logOut,
		googleSignIn,
		signup,
	};

	return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
