import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { Td, Tr } from "@chakra-ui/table";
import React, { useState } from "react";
import { formatBytes } from "../helpers/helpers";
function TableRow(props) {
	const { data, setTableBody } = props;
	const toast = useToast();
	const [deletingData, setdeletingData] = useState(false);
	const { id, hash, name, size, s3_url, created_on } = data;

	const deleteObject = async (Key) => {
		setdeletingData(true);
		try {
			const res = await axios.delete(`/${Key}`);
			if (res.status == 200) {
				const dbRes = await axios.delete(`/db/${Key}`);
				if (dbRes.status == 200) {
					const fileName = dbRes.data[0].name;
					setTableBody((prevBody) =>
						prevBody.filter((i) => i.name !== fileName)
					);
					toast({
						description: `${fileName} Deleted SucessFully`,
						status: "success",
						duration: 2000,
					});
				}
			}
		} catch (error) {
			toast({
				description: error.message,
				status: "error",
				duration: 3000,
			});
		} finally {
			setdeletingData(false);
		}
	};

	return (
		<Tr key={id}>
			<Td>{id}</Td>
			<Td>{name}</Td>
			<Td>{formatBytes(size)}</Td>
			<Td>{s3_url}</Td>
			<Td>{new Date(Date.now(created_on)).toString().slice(4, 15)}</Td>
			<Td>
				<Button
					colorScheme="red"
					variant="outline"
					isLoading={deletingData}
					onClick={() => deleteObject(hash)}
				>
					Delete
				</Button>
			</Td>
		</Tr>
	);
}

export default TableRow;
