import { useCallback, useEffect, useState } from "react";
import { Page, Button, Icon, DataTable, TextField, BlockStack } from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useLocation, useNavigate } from "@remix-run/react";
import { ruleStatus, applyOptions, priceOptions } from "../constants";
import pricingRuleApi from "../api/pricing-rule";

export default function () {
	const shopify = useAppBridge();
	const navigate = useNavigate();
	const { state } = useLocation();
	const [searchText, setSearchText] = useState("");
	const [searchPricingRules, setSearchPricingRules] = useState([]);

	const changeSearchText = useCallback(async function (text) {
		const rules = await pricingRuleApi.all({});

		setSearchText(text);
		setSearchPricingRules(rules.filter(function (item) {
			return item.generalInformation.name.toLowerCase().includes(text.toLowerCase());
		}));
	}, []);

	const deletePricingRule = useCallback(async function (id) {
		const deletedRule = await pricingRuleApi.delete({}, id);
		const rules = await pricingRuleApi.all({});

		setSearchPricingRules(rules);
		navigate("#", { state: { name: deletedRule.generalInformation.name, type: "deleted" } })
	}, [navigate]);

	useEffect(function () {
		const fetchData = async function () {
			const rules = await pricingRuleApi.all({});

			setSearchPricingRules(rules);
		}
		
		fetchData();
	}, []);

	useEffect(function () {
		if (state && state.name) {
			const message = `Pricing rule ${state.name} has been ${state.type}`;

			shopify.toast.show(message);
		}
	}, [shopify.toast, state]);

	return (
		<Page
			title="Pricing Rules"
			primaryAction={{ content: "Create pricing rule", url: "/app/pricing-rule/new" }}
		>
			<BlockStack gap="200">
				<TextField
					type="text"
					value={searchText}
					onChange={changeSearchText}
					placeholder="Enter pricing rule name"
					prefix={<Icon source={SearchIcon} tone="base" />}
				/>
				<DataTable 
					columnContentTypes={["text", "text", "text", "text", "numeric", "numeric"]}
					headings={["Name", "Apply Products", "Custom Price" ,"Status", "", ""]}
					verticalAlign="center"
					rows={searchPricingRules.map(function(item) {
						return [
							item.generalInformation.name,
							applyOptions[item.applyProducts.option],
							priceOptions[item.customPrices.option] + " - " + item.customPrices.amount + item.customPrices.suffix,
							ruleStatus[item.generalInformation.status],
							<Button
								size="large"
								variant="primary"
								url={"/app/pricing-rule/" + item.id}
								key={item.id}
								children="Edit"
							/>,
							<Button
								size="large"
								variant="primary"
								tone="critical"
								onClick={() => deletePricingRule(item.id)}
								key={item.id}
								children="Delete"
							/>
						]
					})}
				/>
			</BlockStack>
		</Page>
	);
}
