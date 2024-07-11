import {
	BlockStack,
	TextField,
	Card,
	Button,
	InlineStack,
	ResourceList,
	ResourceItem,
	Avatar,
	Modal,
	Filters,
	Text,
	Icon,
} from "@shopify/polaris";
import { SearchIcon, XIcon } from "@shopify/polaris-icons";
import { useCallback, useEffect, useState } from "react";

export default function SelectProducts({ productIds, setProductIds }) {
	const [allProducts, setAllProducts] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [inputText, setInputText] = useState("");
	const [searchProducts, setSearchProducts] = useState(allProducts);

	const changeInputText = useCallback(
		function (inputText) {
			setInputText(inputText);
			setSearchProducts(
				allProducts.filter(function (product) {
					return product.name
						.toLowerCase()
						.includes(inputText.trim().toLowerCase());
				}),
			);
		},
		[allProducts],
	);

	const removeProductId = useCallback(
		function (index) {
			const ids = [...productIds];
			ids.splice(index, 1);
			setProductIds(ids);
		},
		[productIds, setProductIds],
	);

	const selectProducts = useCallback(function () {
		setShowModal(false);
	}, []);

	useEffect(function () {
		const data = [
			{ id: 1, name: "Shirt", price: 300 },
			{ id: 2, name: "Phone", price: 400 },
			{ id: 3, name: "Phone Digital", price: 500 },
		];
		setAllProducts(data);
		setSearchProducts(data);
	}, []);

	return (
		<BlockStack gap="400">
			<TextField
				placeholder="Select products"
				onFocus={() => setShowModal(true)}
				prefix={<Icon source={SearchIcon} />}
			></TextField>
			<Modal
				open={showModal}
				title={<div className="modal-title">Select products</div>}
				onClose={() => setShowModal(false)}
				primaryAction={{
					content: "Select",
					onAction: selectProducts,
				}}
			>
				<ResourceList
					resourceName={{ singular: "product", plural: "products" }}
					items={searchProducts}
					selectedItems={productIds}
					onSelectionChange={setProductIds}
					promotedBulkActions={[
						{
							content: "Clear",
							onAction() {
								setProductIds([]);
							},
						},
					]}
					filterControl={
						<Filters
							queryValue={inputText}
							onQueryChange={changeInputText}
							filters={[]}
							queryPlaceholder="Enter product name"
						/>
					}
					renderItem={function (item) {
						return (
							<ResourceItem
								id={item.id}
								name={item.name}
								media={
									<Avatar
										customer
										size="md"
										name={item.name}
									/>
								}
								verticalAlignment="center"
								accessibilityLabel={`View details for ${item.name}`}
							>
								<Text>{item.name}</Text>
								<Text>{item.price}</Text>
							</ResourceItem>
						);
					}}
				/>
			</Modal>
			<BlockStack gap="300">
				{productIds.map(function (productId, index) {
					const item = allProducts.find(function (product) {
						return product.id === productId;
					});

					return (
						item && (
							<Card padding="100" key={productId}>
								<InlineStack align="space-between">
									<ResourceItem
										verticalAlignment="center"
										id={item.id}
										media={
											<Avatar
												customer
												size="md"
												name={item.name}
											/>
										}
										accessibilityLabel={`View details for ${item.name} product`}
									>
										<Text>{item.name}</Text>
										<Text>{item.price}</Text>
									</ResourceItem>
									<Button
										icon={XIcon}
										accessibilityLabel="Remove Collection"
										onClick={() => removeProductId(index)}
										variant="plain"
									></Button>
								</InlineStack>
							</Card>
						)
					);
				})}
			</BlockStack>
		</BlockStack>
	);
}
