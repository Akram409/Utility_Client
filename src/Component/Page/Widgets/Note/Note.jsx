import { message } from "antd";
import axios from "axios"; // Import Axios
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Note = () => {
	const [allNotes, setAllNotes] = useState([]);

	useEffect(() => {
		const fetchNotes = async () => {
			try {
				const response = await axios.get("http://localhost:5000/notes");
				setAllNotes(response.data);
			} catch (error) {
				console.error("Error fetching notes:", error);
			}
		};

		fetchNotes();
	}, [allNotes]);

	const handleDeleteBtn = async id => {
		try {
			// Send a DELETE request to the server route with the note ID
			const response = await axios.delete(`http://localhost:5000/notes/${id}`);
			if (response.status === 200) {
				// If the deletion is successful, you can perform additional actions if needed
				message.success("Note deleted successfully!");

				// Optionally, you can navigate to another page or update the UI
			}
		} catch (error) {
			message.error("Error deleting note");
			console.error(error);
			// Handle errors if the deletion fails
		}
	};

	return (
		<div className='mx-10 mt-10 mb-60 min-h-[50vh]'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold'>LOGO</h1>
				<Link to='/Notes/addNote'>
					<button className='btn btn-primary text-white font-semibold'>Add Notes +</button>
				</Link>
			</div>
			<div className='flex flex-wrap items-center mt-10 gap-3'>
				{allNotes.map((note, index) => (
					<div key={index} className='card w-80 bg-slate-800 text-primary-content'>
						<div className='card-body text-center'>
							<h2 className='text-xl font-semibold text-white'>{note.Title}</h2>
							<p className='text-white font-medium'>{note.Date}</p>
							<div className='card-actions justify-center mt-5'>
								<Link to={`/Notes/viewNote/${note._id}`}>
									<button className='btn btn-primary text-white'>View</button>
								</Link>
								<Link
									to={{
										pathname: `/Notes/updateNote/${note._id}`,
										state: { from: "/Notes" },
									}}
								>
									<button className='btn btn-warning text-white'>Edit</button>
								</Link>

								<button
									className='btn btn-error text-white'
									onClick={() => handleDeleteBtn(note._id)}
								>
									Delete
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Note;
