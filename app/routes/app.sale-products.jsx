import { useCallback, useEffect, useState } from "react";
import { useFetcher, Link } from "@remix-run/react";
import { Page, BlockStack, TextField, Icon, Avatar, DataTable } from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import productApi from "../api/product";
import pricingRuleApi from "../api/pricing-rule";

export async function action({ request }) {
	const { name, data } = await request.json();

	switch (name) {
		case "products": {
			const products = await productApi.all(request, data);
			return { products, ok: true, name };
		}
		default: {
			return null;
		}
	}
}

export default function () {
	const fetcher = useFetcher();
	const [searchText, setSearchText] = useState("");
	const [searchProducts, setSearchProducts] = useState([]);
	const [enabledPricingRules, setEnabledPricingRules] = useState([]);

	const changeSearchText = useCallback(function (text) {
		setSearchText(text);

		fetcher.submit(
			{ name: "products", data: { first: 20, title: text } },
			{ method: "POST", encType: "application/json" }
		);
	}, [fetcher]);

	useEffect(function () {
		fetcher.submit(
			{ name: "products", data: { first: 20, title: "" } },
			{ method: "POST", encType: "application/json" }
		);
		(async function () {
			const rules = await pricingRuleApi.all();
			setEnabledPricingRules(rules.filter(function (rule) {
				return rule.generalInformation.status === 1;
			}));
		})();
	}, []);

	useEffect(function () {
		if (fetcher.data?.ok && fetcher.data.name === "products") {
			setSearchProducts(fetcher.data.products);
		}
	}, [fetcher]);

	return (
		<Page
			title="Sale Products"
			primaryAction={{ content: "View pricing rules", url: "/app/pricing-rules" }}
		>
			<BlockStack gap="200">
				<TextField
					type="text"
					value={searchText}
					onChange={changeSearchText}
					placeholder="Enter product name"
					prefix={<Icon source={SearchIcon} tone="base" />}
				/>
				<DataTable
					headings={["", "Product name", "Compare price", "Sale price"]}
					columnContentTypes={["text", "text", "text", "text"]}
					verticalAlign="center"
					rows={searchProducts.filter(function (product) {
						return enabledPricingRules.some(function (rule) {
							return pricingRuleApi.validateProduct(rule, product);
						});
					}).map(function (item) {
						return [
							<Avatar source={item.imageUrl} size="xl" key={item.id} />,
							// <a href={item.id.replace("gid://shopify/Product", "https://admin.shopify.com/store/store-training-hau-nt1/products")} key={item.id}>{item.title}</a>,
							// <Link to={item.id.replace("gid://shopify/Product", "https://admin.shopify.com/store/store-training-hau-nt1/products")} key={item.id}>{item.title}</Link>,
							item.title,
							item.priceAmount + " " + item.currencyCode,
							Math.min(enabledPricingRules.map(function (rule) {
								return pricingRuleApi.calculatePrice(rule, item);
							})) + " " + item.currencyCode
						];
					})}
				/>
			</BlockStack>
		</Page>
	);
}
