import { useCallback } from "react";
import { Card, Text, ChoiceList, BlockStack, TextField } from "@shopify/polaris";
import { samplePricingRule } from "../constants";

export default function CustomPrices({ customPrices = samplePricingRule.customPrices, setCustomPrices = function (data = samplePricingRule) { } }) {
	const changeOption = useCallback(function (option) {
		setCustomPrices({ ...customPrices, option, suffix: option === 2 ? customPrices.percent : " " + customPrices.currencyCode });
	}, [customPrices, setCustomPrices]);

	const changeAmount = useCallback(function (amount) {
		setCustomPrices({ ...customPrices, amount: customPrices.option === 2 ? Math.min(amount, customPrices.maxDecreasePercent) : amount });
	}, [customPrices, setCustomPrices]);

	return (
		<Card>
			<BlockStack gap="500">
				<Text
					as="h1"
					variant="headingMd"
					children="Custom Prices"
				/>
				<ChoiceList
					choices={[
						{ label: "Apply a price to selected products", value: 0 },
						{ label: "Decrease a fixed amount of the original prices of selected products", value: 1 },
						{ label: "Decrease the original prices of selected products by a percentage (%)", value: 2 },
					]}
					selected={[customPrices.option]}
					onChange={([option]) => changeOption(option)}
				/>
				<TextField
					type="number"
					label="Amount"
					value={customPrices.amount}
					onChange={(amount) => changeAmount(Number.parseInt(amount))}
					min="0"
					max={customPrices.option === 2 ? customPrices.maxDecreasePercent : undefined}
					suffix={customPrices.suffix}
				/>
			</BlockStack>
		</Card>
	);
}
