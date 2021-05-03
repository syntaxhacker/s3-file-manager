import React, { useState } from "react";
import axios from "axios";

import {
	Box,
	Button,
	Stack,
	Center,
	Heading,
	HStack,
	useToast,
	Alert,
	AlertIcon,
	CloseButton,
	AlertDescription,
} from "@chakra-ui/react";
import { formatBytes } from "../helpers/helpers";

const FileUploader = (props) => {
	const { setTableBody } = props;
	const [files, setFiles] = useState([]);
	const [fetchingData, setFetchingData] = useState(false);
	const toast = useToast();

	let hiddenInput = null;

	const submitFile = async (e) => {
		e.preventDefault();
		try {
			if (!files.length) {
				throw new Error("Select a file first!");
			}
			const formData = new FormData();
			for (let i = 0; i < files.length; i++) {
				formData.append("files", files[i]);
			}

			toast({
				description: "Uploading ...",
				duration: 2000,
			});
			setFetchingData(true);
			const { status, data } = await axios.post(
				`/upload_files`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			const filesData = Object.values(files).map((i) => {
				return {
					name: i.name,
					size: i.size,
					type: i.type,
				};
			});
			if (status === 200) {
				const dbResponse = await axios.post("/db/add", {
					s3Response: data.uploadedFilesInfo,
					filesData,
				});

				if (dbResponse.status) {
					toast({
						description: "uploaded ",
						status: "success",
						duration: 3000,
					});
					setTableBody((prevBody) => [
						...prevBody,
						...dbResponse.data.data,
					]);
				}
			}
		} catch (error) {
			toast({
				description: error.response.data.message || error.message,
				status: "error",
				duration: 3000,
			});
		} finally {
			setFiles([]);
			setFetchingData(false);
		}
	};

	const removeFile = async (fileName) => {
		setFiles((prevFiles) =>
			Object.values(prevFiles).filter((i) => i.name !== fileName)
		);
		console.log(fileName, files);
	};
	return (
		<form onSubmit={submitFile}>
			<Heading>Upload Files here 👇</Heading>
			<HStack spacing="24px">
				<Box p={5} flex="1" textAlign="end">
					<Button
						mt={4}
						colorScheme="telegram"
						onClick={() => {
							hiddenInput.click();
						}}
					>
						{files.length ? `Selected ${files.length}` : "Select"}{" "}
						{files && files.length > 1 ? "Files" : "File"}
					</Button>

					<input
						hidden
						multiple
						type="file"
						ref={(el) => (hiddenInput = el)}
						onChange={(event) => {
							console.log(event.target.files);
							setFiles(event.target.files);
						}}
					/>
				</Box>
				<Box p={5} flex="1" textAlign="left">
					<Button
						mt={4}
						colorScheme="teal"
						isLoading={fetchingData}
						type="submit"
					>
						Upload
					</Button>
				</Box>
			</HStack>
			<Center>
				{files.length ? (
					<Stack spacing={3}>
						{Object.values(files).map((i) => {
							return (
								<Alert key={i.name} status="info">
									<HStack spacing="30px">
										<AlertIcon />
										{/* <AlertTitle>Success!</AlertTitle> */}
										<AlertDescription marginInlineStart="0 !important">
											{i.name} - {formatBytes(i.size)}
										</AlertDescription>
										<Box>
											<CloseButton
												onClick={() =>
													removeFile(i.name)
												}
												position="absolute"
												right="8px"
												top="8px"
											/>
										</Box>
									</HStack>
								</Alert>
							);
						})}
					</Stack>
				) : (
					""
				)}
			</Center>
		</form>
	);
};

export default FileUploader;
