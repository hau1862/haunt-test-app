import { useEffect, useState } from "react";
import { Page, BlockStack } from "@shopify/polaris";
import GeneralInformation from "../components/GeneralInformation";
import ApplyProducts from "../components/ApplyProducts";
import CustomPrices from "../components/CustomPrices";
import { collectionApi, productApi } from "../api";
import { useLoaderData, useNavigate } from "@remix-run/react";

export async function loader({ params, ...args }) {
	return { id: params.id, params, args };
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

export default function () {
	const navigate = useNavigate();
	const homepageUrl = "/app/pricing-rules";
	const { id } = useLoaderData();
	const [generalInformation, setGeneralInformation] = useState({
		name: "",
		priority: 0,
		status: 1,
	});
	const [applyProducts, setApplyProducts] = useState({
		option: 0,
		productIds: [],
		collectionIds: [],
		productTags: [],
	});
	const [customPrices, setCustomPrices] = useState({ option: 0, amount: 0 });

	const savePricingRule = function () {
		const pricingRules =
			JSON.parse(localStorage.getItem("pricingRules") || "[]") || [];

		pricingRules.push({
			id: pricingRules.length,
			generalInformation,
			applyProducts,
			customPrices,
		});
		localStorage.setItem("pricingRules", JSON.stringify(pricingRules));
		navigate(homepageUrl, {
			state: { type: "new", name: generalInformation.name },
		});
	};

	useEffect(function () {
		if (id !== "new") {
			const pricingRules =
				JSON.parse(localStorage.getItem("pricingRules") || "[]") || [];
			let pricingRule = {
				generalInformation: {},
				applyProducts: {},
				customPrices: {},
			};
			pricingRule =
				pricingRules.find((rule) => rule.id === id) || pricingRule;

			setGeneralInformation({
				...generalInformation,
				...pricingRule.generalInformation,
			});
			setApplyProducts({
				...applyProducts,
				...pricingRule.applyProducts,
			});
			setCustomPrices({
				...customPrices,
				...pricingRule.customPrices,
			});
		}
	}, []);

	return (
		<Page
			title={id === "new" ? "Create pricing rule" : "Edit pricing rule"}
			backAction={{
				content: "Back to pricing rules",
				url: homepageUrl,
			}}
			primaryAction={{
				content: "Save",
				onAction: savePricingRule,
			}}
			secondaryActions={{
				content: "Discard",
				url: homepageUrl,
			}}
		>
			<BlockStack gap="500">
				<GeneralInformation
					generalInformation={{ ...generalInformation }}
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
