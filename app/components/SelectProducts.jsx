import { useCallback, useEffect, useState } from "react";
import { BlockStack, TextField, Card, Button, InlineStack, ResourceList, ResourceItem, Avatar, Modal, Filters, Icon } from "@shopify/polaris";
import { SearchIcon, XIcon } from "@shopify/polaris-icons";

export default function SelectProducts({ productIds, setProductIds }) {
	const [allProducts, setAllProducts] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [searchProducts, setSearchProducts] = useState(allProducts);

	const changeInputText = useCallback(function (searchText) {
		setSearchText(searchText);
		setSearchProducts(allProducts.filter(function (product) {
			return product.name.toLowerCase().includes(searchText.toLowerCase());
		}));
	}, [allProducts]);

	const removeProductId = useCallback(function (productId) {
		setProductIds(productIds.filter(function (item) {
			return item !== productId
		}));
	}, [productIds, setProductIds]);

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
			/>
			<Modal
				open={showModal}
				title={<div className="modal-title">Select products</div>}
				onClose={() => setShowModal(false)}
				primaryAction={{ content: "Select", onAction: () => setShowModal(false) }}
			>
				<ResourceList
					resourceName={{ singular: "product", plural: "products" }}
					items={searchProducts}
					selectedItems={productIds}
					onSelectionChange={setProductIds}
					promotedBulkActions={[{ content: "Clear", onAction: () => setProductIds([]) }]}
					filterControl={<Filters queryValue={searchText} onQueryChange={changeInputText} filters={[]} queryPlaceholder="Enter product name" />}
					renderItem={function (item) {
						return <ResourceItem id={item.id} name={item.name} media={<Avatar customer size="xl" />} verticalAlignment="center">
							{item.name} <br /> {item.price}
						</ResourceItem>;
					}}
				/>
			</Modal>
			<BlockStack gap="300">
				{productIds.map(function (productId) {
					const item = allProducts.find(function (product) {
						return product.id === productId;
					});

					return item && <Card padding="100" key={item.id}>
						<InlineStack align="space-between">
							<ResourceItem verticalAlignment="center" id={item.id} media={<Avatar customer size="xl" />}>
								{item.name} <br /> {item.price}
							</ResourceItem>
							<Button icon={XIcon} onClick={() => removeProductId(item.id)} variant="plain"></Button>
						</InlineStack>
					</Card>;
				})}
			</BlockStack>
		</BlockStack>
	);
}
