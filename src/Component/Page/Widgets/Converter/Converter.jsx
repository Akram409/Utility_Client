import { message } from "antd"; // Import message component from Ant Design
import axios from "axios";
import Lottie from "lottie-react";
import { useState } from "react";
import convert from "../../../../assets/convert.json";

const Converter = () => {
	const [convertType, setConvertType] = useState("DOCX");
	const [file, setFile] = useState();
	const [file1, setFile1] = useState(null);
	const [file2, setFile2] = useState(null);

	const handleFile1Change = e => {
		setFile1(e.target.files[0]);
	};

	const handleFile2Change = e => {
		setFile2(e.target.files[0]);
	};

	const upload1 = () => {
		const formData = new FormData();
		formData.append("file", file);
		axios
			.post("http://localhost:5000/converter/upload", formData)
			.then(res => {
				message.success("File Converted successfully");
			})
			.catch(er => message.error(er));
	};

	const upload2 = () => {
		const formData = new FormData();
		formData.append("file1", file1);
		formData.append("file2", file2);

		axios
			.post("http://localhost:5000/converter/upload/combine", formData)
			.then(res => {
				message.success("Files Converted successfully");
			})
			.catch(err => message.error(err));
	};

	const downloadFile1 = () => {
		axios({
			url: "http://localhost:5000/converter/upload/download/DocxORImage",
			method: "GET",
			responseType: "blob", // important
		})
			.then(response => {
				if (response.data.size > 0) {
					const url = window.URL.createObjectURL(new Blob([response.data]));
					const link = document.createElement("a");
					link.href = url;
					link.setAttribute("download", "converted_file.pdf");
					document.body.appendChild(link);
					link.click();
				} else {
					message.warning("File not converted yet");
				}
			})
			.catch(error => {
				console.error("Error downloading file:", error);
				message.error("Failed to download file");
			});
	};

	const downloadFile2 = () => {
		axios({
			url: "http://localhost:5000/converter/upload/download/Combine",
			method: "GET",
			responseType: "blob", // important
		})
			.then(response => {
				if (response.data.size > 0) {
					const url = window.URL.createObjectURL(new Blob([response.data]));
					const link = document.createElement("a");
					link.href = url;
					link.setAttribute("download", "converted_file.pdf");
					document.body.appendChild(link);
					link.click();
				} else {
					message.warning("File not converted yet");
				}
			})
			.catch(error => {
				console.error("Error downloading file:", error);
				message.error("Failed to download file");
			});
	};

	const convertFile = () => {
		if (convertType === "DOCX") {
			upload1();
		} else if (convertType === "IMAGE") {
			upload1();
		} else if (convertType === "COMBINE") {
			if (file1 && file2) {
				upload2();
			} else {
				console.log("Please select two PDF files to combine");
			}
		} else {
			message.error("Invalid conversion type");
			console.log("Invalid conversion type");
		}
	};

	return (
		<div className='md:flex sm:fle-col my-28 justify-center justify-items-center mx-16 gap-10'>
			<div>
				<h1 className='text-4xl font-bold text-center mb-10'>{convertType} TO PDF</h1>
				<div className='flex items-center gap-3 mb-10'>
					<button className='btn btn-outline btn-primary' onClick={() => setConvertType("DOCX")}>
						DOCX TO PDF
					</button>
					<button className='btn btn-outline btn-primary' onClick={() => setConvertType("IMAGE")}>
						IMAGE TO PDF
					</button>
					<button className='btn btn-outline btn-primary' onClick={() => setConvertType("COMBINE")}>
						COMBINE PDF
					</button>
				</div>
				{convertType !== "COMBINE" && (
					<div className='flex flex-col items-center justify-center space-y-5'>
						<input
							type='file'
							className='file-input file-input-bordered file-input-primary '
							onChange={e => setFile(e.target.files[0])}
						/>
						<div className='flex gap-3'>
							<button
								type='button'
								className='btn btn-primary btn-outline font-bold'
								onClick={convertFile}
							>
								Convert
							</button>
							<button
								type='button'
								className='btn btn-primary btn-outline font-bold'
								onClick={downloadFile1}
							>
								Download
							</button>
						</div>
					</div>
				)}

				{convertType === "COMBINE" && (
					<div className='flex flex-col items-center justify-center space-y-5'>
						<input
							type='file'
							name='file1'
							className='file-input file-input-bordered file-input-primary w-full max-w-xs'
							onChange={handleFile1Change}
						/>
						<input
							type='file'
							name='file2'
							className='file-input file-input-bordered file-input-primary w-full max-w-xs'
							onChange={handleFile2Change}
						/>
						<div className='flex gap-3'>
							<button
								type='button'
								className='btn btn-primary btn-outline font-bold'
								onClick={convertFile}
							>
								Convert
							</button>
							<button
								type='button'
								className='btn btn-primary btn-outline font-bold'
								onClick={downloadFile2}
							>
								Download
							</button>
						</div>
					</div>
				)}
			</div>
			<Lottie animationData={convert} loop={true} style={{ width: "500px", height: "auto" }} />
		</div>
	);
};

export default Converter;
