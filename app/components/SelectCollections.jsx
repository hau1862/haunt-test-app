import {
	Autocomplete,
	BlockStack,
	ResourceItem,
	Avatar,
	Card,
	Button,
	InlineStack,
} from "@shopify/polaris";
import { XIcon } from "@shopify/polaris-icons";
import { useCallback, useEffect, useState } from "react";

export default function SelectCollections({ collectionIds, setCollectionIds }) {
	const [allCollections, setAllCollections] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [searchCollections, setSearchCollections] = useState(allCollections);

	const changeInputValue = useCallback(
		function (inputValue) {
			setInputValue(inputValue);
			setSearchCollections(
				allCollections.filter(function (collection) {
					return collection.title.includes(inputValue.trim());
				}),
			);
		},
		[allCollections],
	);

	const removeCollectionId = useCallback(
		function (index) {
			const ids = [...collectionIds];
			ids.splice(index, 1);
			setCollectionIds(ids);
		},
		[collectionIds, setCollectionIds],
	);

	useEffect(function () {
		const data = [
			{ id: 1, title: "Vintage" },
			{ id: 2, title: "Cotton" },
			{ id: 3, title: "Summer" },
		];
		setAllCollections(data);
		setSearchCollections(data);
	}, []);

	return (
		<BlockStack gap="400">
			<Autocomplete
				allowMultiple
				textField={
					<Autocomplete.TextField
						placeholder="Vintage, cotton, summer"
						value={inputValue}
						onChange={changeInputValue}
					/>
				}
				options={searchCollections.map(function (collection) {
					return { label: collection.title, value: collection.id };
				})}
				selected={collectionIds}
				onSelect={setCollectionIds}
				listTitle="Suggested Collections"
			/>
			<BlockStack gap="300">
				{collectionIds.map(function (collectionId, index) {
					const item = allCollections.find(function (collection) {
						return collection.id === collectionId;
					});

					return (
						item && (
							<Card padding="100" key={collectionId}>
								<InlineStack align="space-between">
									<ResourceItem
										verticalAlignment="center"
										id={item.id}
										media={
											<Avatar
												customer
												size="md"
												name={item.title}
											/>
										}
										accessibilityLabel={`View details for ${item.title} collection`}
									>
										{item.title}
									</ResourceItem>
									<Button
										icon={XIcon}
										accessibilityLabel="Remove Collection"
										onClick={() =>
											removeCollectionId(index)
										}
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
