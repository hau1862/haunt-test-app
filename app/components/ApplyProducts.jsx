import { useCallback } from "react";
import { BlockStack, Card, ChoiceList, Text } from "@shopify/polaris";
import SelectProductIds from "./SelectProductIds";
import SelectCollectionIds from "./SelectCollectionIds";
import SelectProductTags from "./SelectProductTags";

export default function ApplyProducts({ applyProducts, setApplyProducts }) {
	const changeOption = useCallback(function ([option]) {
		setApplyProducts({ ...applyProducts, option });
	}, [applyProducts, setApplyProducts]);

	const changeProductIds = useCallback(function (productIds) {
		setApplyProducts({ ...applyProducts, productIds });
	}, [applyProducts, setApplyProducts]);

	const changeCollectionIds = useCallback(function (collectionIds) {
		setApplyProducts({ ...applyProducts, collectionIds });
	}, [applyProducts, setApplyProducts]);

	const changeProductTags = useCallback(function (productTags) {
		setApplyProducts({ ...applyProducts, productTags });
	}, [applyProducts, setApplyProducts]);

	return (
		<Card>
			<BlockStack gap="500">
				<Text as="h1" variant="headingMd">
					Apply To Products
				</Text>
				<ChoiceList
					choices={[
						{
							label: "All products",
							value: 0,
						},
						{
							label: "Specific products",
							value: 1,
							renderChildren(isSelected) {
								return (
									isSelected && <SelectProductIds
										productIds={[...applyProducts.productIds]}
										setProductIds={changeProductIds}
									/>
								);
							},
						},
						{
							label: "Product collections",
							value: 2,
							renderChildren(isSelected) {
								return (
									isSelected && <SelectCollectionIds
										collectionIds={[...applyProducts.collectionIds]}
										setCollectionIds={changeCollectionIds}
									/>
								);
							},
						},
						{
							label: "Product tags",
							value: 3,
							renderChildren(isSelected) {
								return (
									isSelected && <SelectProductTags
										productTags={[...applyProducts.productTags]}
										setProductTags={changeProductTags}
									/>
								);
							},
						},
					]}
					selected={[applyProducts.option]}
					onChange={changeOption}
				/>
			</BlockStack>
		</Card>
	);
}
