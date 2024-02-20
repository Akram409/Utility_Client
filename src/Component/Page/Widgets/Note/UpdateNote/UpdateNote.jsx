import { DatePicker, Form, Input, message } from "antd";
import axios from "axios";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import update from "../../../../../assets/update.json";

const UpdateNote = () => {
	const [selectedDate, setSelectedDate] = useState("");
	const [noteData, setNoteData] = useState([]);
	const { id } = useParams();

	useEffect(() => {
		const fetchNote = async () => {
			try {
				const response = await axios.get(`http://localhost:5000/notes/${id}`);
				const fetchedNoteData = response.data;
				setNoteData(fetchedNoteData);
			} catch (error) {
				console.error("Error fetching note:", error);
			}
		};

		fetchNote();
	}, [id]);

	const dateChange = (date, dateString) => {
		setSelectedDate(dateString);
	};

	const onFinish = async values => {
		try {
			const response = await axios.put(`http://localhost:5000/notes/update/${id}`, {
				Title: values?.title || noteData.Title,
				Date: (selectedDate && selectedDate) || noteData.Date,
				Description: values.user?.description || noteData.Description,
				Calendar: noteData.Calendar,
				Tasks: noteData.Tasks,
			});

			if (response.status === 200) {
				message.success("Note updated successfully!");
				// Optionally, you can navigate to another page or update the UI
			}
		} catch (error) {
			message.error("Error updating note");
			console.error(error);
			// Handle errors if the update fails
		}
	};
	const onFinishFailed = errorInfo => {
		console.log("Failed:", errorInfo);
		message.error("Something went wrong!");
	};

	return (
		<div className='flex my-16 items-center justify-evenly mx-16 p-10'>
			<div>
				<h1 className='text-3xl font-bold text-center mb-6 italic'>UPDATE NOTE</h1>
				<Form name='basic' onFinish={onFinish} onFinishFailed={onFinishFailed} size='large'>
					<Form.Item label='Title' name='title'>
						<Input placeholder={noteData.Title} />
					</Form.Item>

					<Form.Item label='Date' name='DatePicker'>
						<DatePicker onChange={dateChange} size={"large"} placeholder={noteData.Date} />
					</Form.Item>

					<Form.Item label='Description' name={["user", "description"]}>
						<Input.TextArea placeholder={noteData.Description} />
					</Form.Item>

					<div className='flex gap-2 justify-center'>
						<Link to='/Notes'>
							<button className='btn btn-wide btn-warning text-white' id='customizeBtn'>
								View Note
							</button>
						</Link>
						<Form.Item>
							<button type='submit' className='btn btn-wide btn-primary text-white'>
								Update Note
							</button>
						</Form.Item>
					</div>
				</Form>
			</div>
			<Lottie animationData={update} loop={true} style={{ width: "400px", height: "auto" }} />
		</div>
	);
};

export default UpdateNote;
