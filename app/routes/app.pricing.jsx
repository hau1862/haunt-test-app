import { useCallback, useState } from "react";
import { Page, BlockStack } from "@shopify/polaris";
import GeneralInformation from "../components/GeneralInformation";
import ApplyProducts from "../components/ApplyProducts";
import CustomPrices from "../components/CustomPrices";

export default function TestPage() {
	const [generalFormation, setGeneralInformation] = useState({ name: "", priority: 0, status: 1 });
	const [applyProducts, setApplyProducts] = useState({ option: 0, productIds: [], collectionIds: [], productTags: [] });
	const [customPrices, setCustomPrices] = useState({ option: 0, amount: 0 });

	const saveRule = useCallback(function () {
		console.log("Hello");
	}, []);

	return <Page title="Custom Pricing Rule" primaryAction={{ content: "Save", onAction: saveRule }}>
		<BlockStack gap="500">
			<GeneralInformation 
				generalFormation={{...generalFormation}}
				setGeneralInformation={setGeneralInformation}
			/>
			<ApplyProducts
				applyProducts={{...applyProducts}}
				setApplyProducts={setApplyProducts}
			/>
			<CustomPrices
				customPrices={{...customPrices}}
				setCustomPrices={setCustomPrices}
			/>
		</BlockStack>
	</Page>;
}
