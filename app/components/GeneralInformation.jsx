import { useCallback } from "react";
import { Card, Text, TextField, BlockStack, Select } from "@shopify/polaris";

export default function GeneralInformation({ generalInformation, setGeneralInformation }) {
	const changeName = useCallback(function (name) {
		setGeneralInformation({ ...generalInformation, name });
	}, [generalInformation, setGeneralInformation]);

	const changePriority = useCallback(function (priority) {
		setGeneralInformation({ ...generalInformation, priority });
	}, [generalInformation, setGeneralInformation]);

	const changeStatus = useCallback(function (status) {
		setGeneralInformation({ ...generalInformation, status: Number(status) });
	}, [generalInformation, setGeneralInformation]);

	return (
		<Card>
			<BlockStack gap="500">
				<Text as="h1" variant="headingMd">
					General Information
				</Text>
				<TextField
					type="text"
					label="Name"
					value={generalInformation.name}
					onChange={changeName}
				/>
				<TextField
					type="number"
					label="Priority"
					value={generalInformation.priority}
					onChange={changePriority}
					min="0"
					max="99"
					helpText="Please enter an integer from 0 to 99. 0 is the highest priority"
				/>
				<Select
					label="Status"
					options={[
						{ label: "Enable", value: 1 },
						{ label: "Disable", value: 0 },
					]}
					value={generalInformation.status}
					onChange={changeStatus}
				/>
			</BlockStack>
		</Card>
	);
}
