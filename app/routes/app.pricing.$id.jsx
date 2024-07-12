import { useCallback, useState } from "react";
import { Page, BlockStack } from "@shopify/polaris";
import GeneralInformation from "../components/GeneralInformation";
import ApplyProducts from "../components/ApplyProducts";
import CustomPrices from "../components/CustomPrices";
import { collectionApi, productApi } from "../api";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request, context, params }) {
	if (params.id !== "new") {
		return { generalInformation: {}, applyProducts: {}, customPrices: {} };
	} else {
		return { generalInformation: {}, applyProducts: {}, customPrices: {} };
	}
}

export async function action({ request }) {
	const { name, data } = await request.json();

	switch (name) {
		case "products": {
			const products = await productApi.all(request, data);
			return { products, ok: true };
		}
		case "collections": {
			const collections = await collectionApi.all(request, data);
			return { collections, ok: true };
		}
		default: {
			return null;
		}
	}
}

export default function Pricing() {
	const pricingRuleData = useLoaderData();
	const [generalFormation, setGeneralInformation] = useState({
		name: "",
		priority: 0,
		status: 1,
		...pricingRuleData.generalFormation,
	});
	const [applyProducts, setApplyProducts] = useState({
		option: 0,
		productIds: [],
		collectionIds: [],
		productTags: [],
		...pricingRuleData.applyProducts,
	});
	const [customPrices, setCustomPrices] = useState({
		option: 0,
		amount: 0,
		...pricingRuleData.customPrices,
	});

	const saveRule = useCallback(function () {
		console.log("Save rules");
	}, []);

	return (
		<Page
			title="Custom Pricing Rule"
			primaryAction={{ content: "Save", onAction: saveRule }}
		>
			<BlockStack gap="500">
				<GeneralInformation
					generalFormation={{ ...generalFormation }}
					setGeneralInformation={setGeneralInformation}
				/>
				<ApplyProducts
					applyProducts={{ ...applyProducts }}
					setApplyProducts={setApplyProducts}
				/>
				<CustomPrices
					customPrices={{ ...customPrices }}
					setCustomPrices={setCustomPrices}
				/>
			</BlockStack>
		</Page>
	);
}
