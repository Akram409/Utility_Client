import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../Provider/Authprovider";
import "../Login/Login.css";

const UpdateProfile = () => {
	const { email } = useParams();
	const [currentUser, setCurrentUser] = useState(null);
	const { updateUserPassword } = useContext(AuthContext);

	useEffect(() => {
		const fetchAllUsers = async () => {
			try {
				const response = await axios.get("http://localhost:5000/user");
				const Data = response.data;
				const foundUser = Data.find(u => u.email === email);
				setCurrentUser(foundUser);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};
		// Call the fetchAllUsers function when the component mounts
		fetchAllUsers();
	}, []);

	const onFinish = async values => {
		try {
			const { confirmPassword } = values;

			// Make a PUT request to update the password
			await axios.put(`http://localhost:5000/user/update/${currentUser._id}`, {
				newPassword: confirmPassword,
			});
			updateUserPassword(confirmPassword);

			// Display success message using Ant Design message component
			message.success("Password updated successfully");
		} catch (error) {
			console.error("Error updating password:", error);
			// Display error message using Ant Design message component
			message.error("Failed to update password. Please try again later.");
		}
	};

	const onFinishFailed = errorInfo => {
		console.log("Failed:", errorInfo);
		message.error("Something went wrong!");
	};

	return (
		<div className='h-[calc(100vh-120px)] flex justify-center items-center overflow-auto'>
			<Form
				name='basic'
				labelCol={{
					span: 6,
					className: "form-label text-xl font-medium flex justify-start items-center",
				}}
				style={{
					maxWidth: 600,
				}}
				initialValues={{
					remember: true,
				}}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete='off'
				className='w-full'
			>
				<div className='bg-black w-full py-5 px-14'>
					<h2 className='uppercase text-white text-center mb-4 font-medium text-xl'>
						Update Profile
					</h2>
					<Form.Item label='Username' name='username' className='mb-4 opacity-50'>
						<Input
							className='py-2 text-center username-input placeholder:text-white bg-[#a5a5a5] border-2 rounded-none border-[#434343] text-white font-medium disabled:bg-[#a5a5a5]'
							placeholder={currentUser?.username}
							disabled
						/>
					</Form.Item>
					<Form.Item label='Email' name='email' className='mb-4 opacity-50'>
						<Input
							className='py-2 text-center username-input placeholder:text-white bg-[#a5a5a5] border-2 rounded-none border-[#434343] text-white font-medium disabled:bg-[#a5a5a5]'
							placeholder={currentUser?.email}
							disabled
						/>
					</Form.Item>
					<Form.Item
						label='Password'
						name='password'
						className='mb-4'
						rules={[
							{
								required: true,
								message: "Please input your password!",
							},
						]}
					>
						<Input.Password
							className='py-2 text-center password-input bg-[#a5a5a5] border-2 rounded-none border-[#434343] text-white font-medium signup-password'
							placeholder='Enter your password'
						/>
					</Form.Item>
					<Form.Item
						label='Confirm'
						name='confirmPassword'
						className='mb-3'
						rules={[
							{
								required: true,
								message: "Re-input your password!",
							},
							({ getFieldValue }) => ({
								validator(rule, value) {
									if (!value || getFieldValue("password") === value) {
										return Promise.resolve();
									}
									return Promise.reject("The two passwords that you entered do not match!");
								},
							}),
						]}
					>
						<Input.Password
							className='py-2 text-center password-input bg-[#a5a5a5] border-2 rounded-none border-[#434343] text-white font-medium signup-password'
							placeholder='Confirm your password'
						/>
					</Form.Item>
				</div>
				<div className='flex justify-center items-center mt-6 flex-col'>
					<Button
						className='rounded-none bg-black px-10 submit-btn'
						type='primary'
						htmlType='submit'
					>
						Submit
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default UpdateProfile;
