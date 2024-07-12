import { useCallback } from "react";
import { Card, Text, ChoiceList, BlockStack, TextField } from "@shopify/polaris";

export default function CustomPrices({ customPrices, setCustomPrices }) {
	const changeOption = useCallback(function ([option]) {
		setCustomPrices({ ...customPrices, option });
	}, [customPrices, setCustomPrices]);

	const changeAmount = useCallback(function (amount) {
		setCustomPrices({ ...customPrices, amount });
	}, [customPrices, setCustomPrices]);

	return <Card>
		<BlockStack gap="500">
			<Text as="h1" variant="headingMd">Custom Price</Text>
			<ChoiceList 
				choices={[
					{ 
						label: "Apply a price to selected products",
						value: 0 
					},
					{ 
						label: "Decrease a fixed amount of the original prices of selected products",
						value: 1 
					},
					{ 
						label: "Decrease the original prices of selected products by a percentage (%)",
						value: 2 
					}
				]}
				selected={[customPrices.option]}
				onChange={changeOption}
			/>
			<TextField
				type="number"
				label="Amount"
				value={customPrices.amount}
				onChange={changeAmount}
				suffix={customPrices.option === 2 ? "%" : ""}
			/>
		</BlockStack>
	</Card>;
}
