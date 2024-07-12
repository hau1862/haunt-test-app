import { useCallback, useEffect, useState } from "react";
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
	Icon,
} from "@shopify/polaris";
import { SearchIcon, XIcon } from "@shopify/polaris-icons";
import { useFetcher } from "@remix-run/react";

export default function SelectProductIds({ productIds, setProductIds }) {
	const fetcher = useFetcher();
	const [searchText, setSearchText] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [searchProducts, setSearchProducts] = useState([]);
	const [currentProductIds, setCurrentProductIds] = useState([]);

	const removeProductId = useCallback(
		function (productId) {
			setProductIds(
				productIds.filter(function (item) {
					return item !== productId;
				}),
			);
		},
		[productIds, setProductIds],
	);

	useEffect(function () {
		fetcher.submit(
			{ name: "products", data: { first: 20, title: "" } },
			{ method: "POST", encType: "application/json" },
		);
	}, []);

	useEffect(
		function () {
			if (fetcher.data?.ok) {
				setSearchProducts(fetcher.data.products);
			}
		},
		[fetcher],
	);

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
						setProductIds(currentProductIds);
						setShowModal(false);
					},
				}}
			>
				<ResourceList
					resourceName={{ singular: "product", plural: "products" }}
					items={searchProducts}
					selectedItems={currentProductIds}
					onSelectionChange={setCurrentProductIds}
					promotedBulkActions={[
						{ content: "Clear", onAction: () => setProductIds([]) },
					]}
					filterControl={
						<Filters
							queryValue={searchText}
							onQueryChange={function (searchText) {
								setSearchText(searchText);
								fetcher.submit(
									{
										name: "products",
										data: { first: 20, title: searchText },
									},
									{
										method: "POST",
										encType: "application/json",
									},
								);
							}}
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
									<Avatar source={item.imageUrl} size="xl" />
								}
								verticalAlignment="center"
							>
								{item.title} <br />
								{item.priceAmount + " " + item.currencyCode}
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
						item && (
							<Card padding="100" key={item.id}>
								<InlineStack align="space-between">
									<ResourceItem
										verticalAlignment="center"
										id={item.id}
										media={
											<Avatar
												source={item.imageUrl}
												size="xl"
											/>
										}
									>
										{item.title} <br />
										{item.priceAmount +
											" " +
											item.currencyCode}
									</ResourceItem>
									<div
										style={{
											padding: "0px 12px",
											display: "flex",
											alignItems: "center",
										}}
									>
										<Button
											icon={XIcon}
											onClick={() =>
												removeProductId(item.id)
											}
											variant="plain"
										></Button>
									</div>
								</InlineStack>
							</Card>
						)
					);
				})}
			</BlockStack>
		</BlockStack>
	);
}
