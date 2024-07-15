import { useCallback, useEffect, useState } from "react";
import {
	Page,
	ResourceList,
	ResourceItem,
	Filters,
	Avatar,
	Button,
	ButtonGroup,
	Text,
} from "@shopify/polaris";
import { useLocation } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";

export default function () {
	const shopify = useAppBridge();
	const { state } = useLocation();
	const [allPricingRules, setAllPricingRules] = useState(
		JSON.parse(localStorage.getItem("pricingRules") || "[]") || [],
	);
	const [searchText, setSearchText] = useState("");
	const [searchPricingRules, setSearchPricingRules] =
		useState(allPricingRules);

	const changeSearchText = useCallback(
		function (text) {
			setSearchText(text);
			setSearchPricingRules(
				allPricingRules.filter(function (item) {
					return item.generalInformation.name
						.toLowerCase()
						.includes(text.toLowerCase());
				}),
			);
		},
		[allPricingRules],
	);

	const deletePricingRule = useCallback(
		function (rule) {
			const pricingRules = allPricingRules.filter(function (item) {
				return item.id !== rule.id;
			});

			localStorage.setItem("pricingRules", JSON.stringify(pricingRules));
			setAllPricingRules(pricingRules);
			setSearchPricingRules(pricingRules);
			shopify.toast.show(
				`Pricing rule ${rule.generalInformation.name} has been deleted`,
			);
		},
		[allPricingRules, shopify.toast],
	);

	useEffect(
		function () {
			if (state && state.name) {
				const message = `Pricing rule ${state.name} has been ${state.type === "new" ? "created" : "modified"}`;
				shopify.toast.show(message);
			}
		},
		[shopify, state],
	);

	return (
		<Page
			title="Pricing Rules"
			primaryAction={{
				content: "Create pricing rule",
				url: "/app/pricing-rule/new",
			}}
		>
			<ResourceList
				resourceName={{
					singular: "pricing rule",
					plural: "pricing rules",
				}}
				filterControl={
					<Filters
						queryValue={searchText}
						onQueryChange={changeSearchText}
						filters={[]}
						queryPlaceholder="Enter rule name"
					/>
				}
				items={searchPricingRules}
				renderItem={function (item) {
					return (
						<ResourceItem
							id={item.id}
							media={<Avatar customer size="xl" />}
							verticalAlignment="center"
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<Text as="span" variant="bodyMd">
									{item.generalInformation.name}
								</Text>
								<ButtonGroup>
									<Button
										size="large"
										variant="primary"
										url={"/app/pricing-rule/" + item.id}
									>
										Edit
									</Button>
									<Button
										size="large"
										variant="primary"
										tone="critical"
										onClick={() => deletePricingRule(item)}
									>
										Delete
									</Button>
								</ButtonGroup>
							</div>
						</ResourceItem>
					);
				}}
			/>
		</Page>
	);
}
