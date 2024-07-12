import { useCallback, useEffect, useState } from "react";
import {
	Autocomplete,
	BlockStack,
	ResourceItem,
	Avatar,
	Card,
	Button,
	InlineStack,
	Icon,
} from "@shopify/polaris";
import { SearchIcon, XIcon } from "@shopify/polaris-icons";
import { useFetcher } from "@remix-run/react";

export default function SelectCollectionIds({
	collectionIds,
	setCollectionIds,
}) {
	const fetcher = useFetcher();
	const [searchText, setSearchText] = useState("");
	const [searchCollections, setSearchCollections] = useState([]);
	console.log(fetcher);

	const removeCollectionId = useCallback(
		function (collectionId) {
			setCollectionIds(
				collectionIds.filter(function (item) {
					return item !== collectionId;
				}),
			);
		},
		[collectionIds, setCollectionIds],
	);

	useEffect(function () {
		fetcher.submit(
			{
				name: "collections",
				data: { first: 20, title: "" },
			},
			{
				method: "POST",
				encType: "application/json",
			},
		);
	}, []);

	useEffect(
		function () {
			if (fetcher.data?.ok) {
				setSearchCollections(fetcher.data.collections);
			}
		},
		[fetcher],
	);

	return (
		<BlockStack gap="400">
			<Autocomplete
				allowMultiple
				textField={
					<Autocomplete.TextField
						value={searchText}
						onChange={function (searchText) {
							setSearchText(searchText);
							fetcher.submit(
								{
									name: "collections",
									data: { first: 20, title: searchText },
								},
								{ method: "POST", encType: "application/json" },
							);
						}}
						prefix={<Icon source={SearchIcon} />}
						placeholder="Enter collection name"
					/>
				}
				options={searchCollections.map(function (item) {
					return { label: item.title, value: item.id };
				})}
				selected={collectionIds}
				onSelect={setCollectionIds}
				listTitle="Suggested Collections"
			/>
			<BlockStack gap="300">
				{collectionIds.map(function (collectionId) {
					const item = searchCollections.find(function (collection) {
						return collection.id === collectionId;
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
										{item.title}
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
												removeCollectionId(item.id)
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
