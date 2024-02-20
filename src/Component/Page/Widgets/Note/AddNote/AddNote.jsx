import { Checkbox, DatePicker, Form, Input, message } from "antd";
import axios from "axios";
import Lottie from "lottie-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import addUser from "../../../../../assets/addUser.json";
const AddNote = () => {
	const [selectedDate, setSelectedDate] = useState("");

	const dateChange = (date, dateString) => {
		setSelectedDate(dateString);
	};

	const onFinish = async values => {
		try {
			const { title, user, calender } = values;

			// Create a new note object
			const newNote = {
				Title: title,
				Date: selectedDate,
				Description: user.description,
				Calendar: calender,
				Tasks: [],
			};

			// Send the new note data to the server
			const response = await axios.post("http://localhost:5000/notes/create", newNote);
			// Check if the note creation was successful
			if (response.status === 201) {
				message.success("Note created successfully");
				// Optionally, you can redirect the user to another page
			} else {
				message.error("Failed to create note");
			}
		} catch (error) {
			message.error("Failed to create note. Please try again later.");
			console.error("Error creating note:", error);
		}
	};
	const onFinishFailed = errorInfo => {
		console.log("Failed:", errorInfo);
		message.error("Something went wrong!");
	};

	return (
		<div className='flex my-16 items-center justify-evenly mx-16 p-10'>
			<div>
				<h1 className='text-3xl font-bold text-center mb-6 italic'>ADD NOTES</h1>
				<Form
					name='basic'
					initialValues={{
						calender: true,
					}}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					autoComplete='off'
					size='large'
				>
					<Form.Item
						label='Title'
						name='title'
						rules={[
							{
								required: true,
								message: "Input Title here!",
							},
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label='Date'
						name='DatePicker'
						rules={[
							{
								required: true,
								message: "Please input Date!",
							},
						]}
					>
						<DatePicker onChange={dateChange} size={"large"} placeholder='Search by Date' />
					</Form.Item>

					<Form.Item
						label='Description'
						name={["user", "description"]}
						rules={[
							{
								required: true,
								message: "Please input!",
							},
						]}
					>
						<Input.TextArea />
					</Form.Item>
					<Form.Item name='calender' valuePropName='checked'>
						<Checkbox>Add to Calender</Checkbox>
					</Form.Item>

					<div className='flex gap-2 justify-center'>
						<Link to='/Notes'>
							<button className='btn btn-wide btn-warning text-white' id='customizeBtn'>
								Return
							</button>
						</Link>
						<Form.Item>
							<button type='submit' className='btn btn-wide btn-primary text-white'>
								Create Note
							</button>
						</Form.Item>
					</div>
				</Form>
			</div>
			<Lottie animationData={addUser} loop={true} style={{ width: "400px", height: "auto" }} />
		</div>
	);
};

export default AddNote;
