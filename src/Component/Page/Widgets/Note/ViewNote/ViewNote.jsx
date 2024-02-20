import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const ViewNote = () => {
	const [noteData, setNoteData] = useState([]);
	const { id } = useParams();
	const navigate = useNavigate();
	const from = "/Notes";

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

	const handleDeleteBtn = async () => {
		try {
			// Send a DELETE request to the server route with the note ID
			const response = await axios.delete(`http://localhost:5000/notes/${id}`);
			if (response.status === 200) {
				// If the deletion is successful, you can perform additional actions if needed
				message.success("Note deleted successfully!");
				navigate(from, { replace: true });

				// Optionally, you can navigate to another page or update the UI
			}
		} catch (error) {
			message.error("Error deleting note");
			console.error(error);
			// Handle errors if the deletion fails
		}
	};

	return (
		<div className='mx-20 mt-10 mb-[28vh]'>
			<div className='flex justify-end'>
				<Link to={`/Notes/addTask/${id}`}>
					<button className='btn btn-primary text-white font-semibold mb-9'>Add Task +</button>
				</Link>
			</div>
			<div className='card  shadow-2xl border-4 border-black'>
				<div className='grid grid-cols-2 '>
					<div className='border-r-4'>
						<div className='card-body'>
							<h2 className='text-4xl font-bold'>{noteData?.Title}</h2>
							<p>{noteData?.Date}</p>
							<p className='font-semibold'>Description:</p>
							<p>{noteData?.Description}</p>
						</div>
						<div className='card-actions justify-start mb-5 ms-5'>
							<Link
								to={{
									pathname: `/Notes/updateNote/${noteData._id}`,
									state: { from: "/Notes/viewNote" },
								}}
							>
								<button className='btn btn-warning text-white'>Update</button>
							</Link>

							<button className='btn btn-error text-white' onClick={handleDeleteBtn}>
								Delete
							</button>
						</div>
					</div>
					<div>
						<div className='card-body'>
							<h2 className='text-xl font-bold'>Tasks:</h2>
							<ul style={{ listStyle: "circle" }} className='ml-5'>
								{noteData?.Tasks?.map((val, index) => (
									<li key={index}>{val.task}</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewNote;
