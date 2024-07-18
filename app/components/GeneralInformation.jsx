import { useCallback } from "react";
import { Card, Text, TextField, BlockStack, Select } from "@shopify/polaris";
import { samplePricingRule } from "../constants";

export default function GeneralInformation({ generalInformation = samplePricingRule.generalInformation, setGeneralInformation = function (data = samplePricingRule.generalInformation) { } }) {
	const changeName = useCallback(function (name = "") {
		if (generalInformation.first) {
			setGeneralInformation({ ...generalInformation, name, first: false });
		} else {
			setGeneralInformation({ ...generalInformation, name });
		}
	}, [generalInformation, setGeneralInformation]);

	const changePriority = useCallback(function (priority = 0) {
		setGeneralInformation({ ...generalInformation, priority: Math.min(priority, generalInformation.maxPriority) });
	}, [generalInformation, setGeneralInformation]);

	const changeStatus = useCallback(function (status = 0) {
		setGeneralInformation({ ...generalInformation, status });
	}, [generalInformation, setGeneralInformation]);

	return (
		<Card>
			<BlockStack gap="500">
				<Text
					as="h1"
					variant="headingMd"
					children="General Information"
				/>
				<TextField
					type="text"
					label="Name"
					value={generalInformation.name}
					onChange={changeName}
					error={generalInformation.validateName().ok || generalInformation.first ? "" : generalInformation.validateName().message}
				/>
				<TextField
					type="number"
					label="Priority"
					value={generalInformation.priority}
					onChange={(priority) => changePriority(Number.parseInt(priority))}
					min={generalInformation.minPriority}
					max={generalInformation.maxPriority}
					helpText="Please enter an integer from 0 to 99. 0 is the highest priority"
					error={generalInformation.validatePriority().message}
				/>
				<Select
					label="Status"
					options={[
						{ label: "Enable", value: 1 },
						{ label: "Disable", value: 0 },
					]}
					value={generalInformation.status}
					onChange={(status) => changeStatus(Number.parseInt(status))}
				/>
			</BlockStack>
		</Card>
	);
}
