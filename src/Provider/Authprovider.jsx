import { message } from "antd";
import axios from "axios";
import {
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	getAuth,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	updatePassword,
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
		return signInWithPopup(auth, googleProvider).finally(() => setLoading(false));
	};

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
			setLoading(true);
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			// Send login request to backend
			await axios.post("http://localhost:5000/login", {
				email,
				password,
			});
			setUser(userCredential.user);
			message.success("Login successful");
		} catch (error) {
			console.error("Login error:", error);
			message.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	const signup = async userData => {
		const { password, email } = userData;
		try {
			setLoading(true);
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			setUser(userCredential.user);
		} catch (error) {
			console.error("Signup error:", error);
			// Handle error
		} finally {
			setLoading(false);
		}
	};

	const updateUserPassword = async password => {
		try {
			setLoading(true);
			await updatePassword(auth.currentUser, password);
			setLoading(false);
		} catch (error) {
			console.error("Error updating password:", error);
			// Handle error, such as displaying a message to the user
		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, currentUser => {
			setUser(currentUser);
			setLoading(false);
		});
		return unsubscribe;
	}, []);

	const authInfo = {
		login,
		user,
		setUser,
		loading,
		logOut,
		googleSignIn,
		signup,
		updateUserPassword,
	};

	return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
