import { Card, Text, TextField, BlockStack, Select } from "@shopify/polaris";
import { useCallback, useMemo } from "react";

export default function GeneralInformation({
	generalFormation,
	setGeneralInformation,
}) {
	const changeName = useCallback(
		function (name) {
			setGeneralInformation({
				...generalFormation,
				name,
			});
		},
		[generalFormation, setGeneralInformation],
	);

	const changePriority = useCallback(
		function (priority) {
			setGeneralInformation({
				...generalFormation,
				priority,
			});
		},
		[generalFormation, setGeneralInformation],
	);

	const changeStatus = useCallback(
		function (status) {
			setGeneralInformation({
				...generalFormation,
				status: Number(status),
			});
		},
		[generalFormation, setGeneralInformation],
	);

	const statusOptions = useMemo(function () {
		return [
			{ label: "Enable", value: 1 },
			{ label: "Disable", value: 0 },
		];
	}, []);

	return (
		<Card>
			<BlockStack gap="500">
				<Text as="h1" variant="headingMd">
					General Information
				</Text>
				<TextField
					type="text"
					label="Name"
					value={generalFormation.name}
					onChange={changeName}
				></TextField>
				<TextField
					type="number"
					label="Priority"
					min="0"
					max="99"
					helpText="Please enter an integer from 0 to 99. 0 is the highest priority"
					value={generalFormation.priority}
					onChange={changePriority}
				></TextField>
				<Select
					label="Status"
					options={statusOptions}
					value={generalFormation.status}
					onChange={changeStatus}
				></Select>
			</BlockStack>
		</Card>
	);
}
