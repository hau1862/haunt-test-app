import { useCallback, useEffect, useState } from "react";
import { Page, BlockStack } from "@shopify/polaris";
import { useLoaderData, useNavigate, useFetcher } from "@remix-run/react";
import { samplePricingRule } from "../constants";
import productApi from "../api/product";
import collectionApi from "../api/collection";
import productTagApi from "../api/product-tag";
import shopApi from "../api/shop";
import pricingRuleApi from "../api/pricing-rule";
import GeneralInformation from "../components/GeneralInformation";
import ApplyProducts from "../components/ApplyProducts";
import CustomPrices from "../components/CustomPrices";

export async function loader({ params }) {
	return { id: params.id };
}

export async function action({ request }) {
	const { name, data } = await request.json();

	switch (name) {
		case "products": {
			const products = await productApi.all(request, data);
			return { products, ok: true, name };
		}
		case "collections": {
			const collections = await collectionApi.all(request, data);
			return { collections, ok: true, name };
		}
		case "productTags": {
			const productTags = await productTagApi.all(request, data);
			return { productTags, ok: true, name };
		}
		case "productTagCreate": {
			const productTagCreate = await productTagApi.create(request, data);
			return { productTagCreate, ok: true, name };
		}
		case "shop": {
			const shop = await shopApi.read(request, data);
			return { shop, ok: true, name };
		}
		default: {
			return null;
		}
	}
}

export default function () {
	const homepageUrl = "/app/pricing-rules";
	const navigate = useNavigate();
	const fetcher = useFetcher();
	const { id } = useLoaderData();
	const [generalInformation, setGeneralInformation] = useState(samplePricingRule.generalInformation);
	const [applyProducts, setApplyProducts] = useState(samplePricingRule.applyProducts);
	const [customPrices, setCustomPrices] = useState(samplePricingRule.customPrices);

	const createPricingRule = useCallback(async function () {
		if (generalInformation.validateName().ok && generalInformation.validatePriority().ok && customPrices.validateAmount().ok) {
			const data = {
				generalInformation: generalInformation.getData(),
				applyProducts: applyProducts.getData(),
				customPrices: customPrices.getData()
			};
			const createdRule = await pricingRuleApi.create({}, data);

			navigate(homepageUrl, { state: { type: "created", name: createdRule.generalInformation.name } });
		} else {
			setGeneralInformation({ ...generalInformation, first: false });
		}
	}, [generalInformation, applyProducts, customPrices, navigate]);

	const updatePricingRule = useCallback(async function (id) {
		if (generalInformation.validateName().ok && generalInformation.validatePriority().ok && customPrices.validateAmount().ok) {
			const data = {
				generalInformation: generalInformation.getData(),
				applyProducts: applyProducts.getData(),
				customPrices: customPrices.getData()
			};
			const updatedRule = await pricingRuleApi.update({}, id, data);

			navigate(homepageUrl, { state: { type: "updated", name: updatedRule.generalInformation.name } });
		}
	}, [generalInformation, applyProducts, customPrices, navigate]);

	const fetchData = useCallback(async function () {
		const rule = await pricingRuleApi.read({}, Number.parseInt(id));

		setGeneralInformation({ ...generalInformation, ...rule.generalInformation });
		setApplyProducts({ ...applyProducts, ...rule.applyProducts });
		setCustomPrices({ ...customPrices, ...rule.customPrices });
	}, [generalInformation, applyProducts, customPrices, id]);

	useEffect(function () {
		id !== "new" && fetchData();
		fetcher.submit(
			{ name: "shop", data: {} },
			{ method: "POST", encType: "application/json" }
		);
	}, []);

	useEffect(function () {
		if (fetcher.data?.ok && fetcher.data.name === "shop") {
			const currencyCode = fetcher.data.shop.currencyCode;
			setCustomPrices({ ...customPrices, currencyCode, suffix: customPrices.option === 2 ? customPrices.percent : " " + currencyCode });
		}
	}, [fetcher]);

	return (
		<Page
			title={id === "new" ? "Create pricing rule" : "Edit pricing rule"}
			backAction={{ content: "Back to pricing rules", url: homepageUrl }}
			primaryAction={{ content: "Save", onAction: id === "new" ? createPricingRule : () => updatePricingRule(Number.parseInt(id)) }}
			secondaryActions={[{ content: "Discard", url: homepageUrl }]}
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
