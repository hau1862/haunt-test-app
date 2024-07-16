import { useCallback, useEffect, useState } from "react";
import { BlockStack, TextField, Card, Button, InlineStack, ResourceList, ResourceItem, Avatar, Modal, Filters, Icon } from "@shopify/polaris";
import { SearchIcon, XIcon } from "@shopify/polaris-icons";
import { useFetcher } from "@remix-run/react";

export default function SelectProductIds({ productIds, setProductIds }) {
	const fetcher = useFetcher();
	const [showModal, setShowModal] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [searchProducts, setSearchProducts] = useState([]);
	const [selectedProductIds, setSelectedProductIds] = useState([]);
	
	const changeSearchText = useCallback(function (searchText) {
		setSearchText(searchText);
		fetcher.submit(
			{ name: "products", data: { first: 20, title: searchText } },
			{ method: "POST", encType: "application/json" },
		);
	}, [fetcher])

	const removeProductId = useCallback(function (productId) {
		setProductIds(productIds.filter(function (item) {
			return item !== productId;
		}));
	}, [productIds, setProductIds]);

	useEffect(function () {
		fetcher.submit(
			{ name: "products", data: { first: 20, title: "" } },
			{ method: "POST", encType: "application/json" },
		);
	}, []);

	useEffect(function () {
		if (fetcher.data?.ok) {
			setSearchProducts(fetcher.data.products);
		}
	}, [fetcher]);

	return (
		<BlockStack gap="400">
			<TextField
				placeholder="Select products"
				onFocus={function () {
					setShowModal(true);
					fetcher.submit(
						{ name: "products", data: { first: 20, title: "" } },
						{ method: "POST", encType: "application/json" },
					);
				}}
				prefix={<Icon source={SearchIcon} />}
			/>
			<Modal
				open={showModal}
				title={<div className="modal-title">Select products</div>}
				onClose={() => setShowModal(false)}
				primaryAction={{
					content: "Select",
					onAction: function () {
						setProductIds(selectedProductIds);
						setShowModal(false);
					},
				}}
			>
				<ResourceList
					resourceName={{ singular: "product", plural: "products" }}
					items={searchProducts}
					selectedItems={selectedProductIds}
					onSelectionChange={setSelectedProductIds}
					promotedBulkActions={[
						{ content: "Clear", onAction: () => setSelectedProductIds([]) },
					]}
					filterControl={
						<Filters
							queryValue={searchText}
							onQueryChange={changeSearchText}
							filters={[]}
							queryPlaceholder="Enter product name"
						/>
					}
					renderItem={function (item) {
						return (
							<ResourceItem id={item.id} media={<Avatar source={item.imageUrl} size="xl" />} verticalAlignment="center">
								{item.title} <br /> {item.priceAmount + " " + item.currencyCode}
							</ResourceItem>
						);
					}}
				/>
			</Modal>
			<BlockStack gap="200">
				{productIds.map(function (productId) {
					const item = searchProducts.find(function (product) {
						return product.id === productId;
					});

					return (
						item && <Card padding="100" key={item.id}>
							<InlineStack align="space-between">
								<ResourceItem verticalAlignment="center"  size="xl" media={<Avatar source={item.imageUrl} />}>
									{item.title} <br /> {item.priceAmount + " " + item.currencyCode}
								</ResourceItem>
								<div className="item-remove-button">
									<Button variant="plain" icon={XIcon} onClick={() => removeProductId(item.id)} />
								</div>
							</InlineStack>
						</Card>
					);
				})}
			</BlockStack>
		</BlockStack>
	);
}
