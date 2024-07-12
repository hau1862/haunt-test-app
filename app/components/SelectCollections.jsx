import { useCallback, useEffect, useState } from "react";
import { Autocomplete, BlockStack, ResourceItem, Avatar, Card, Button, InlineStack, Icon } from "@shopify/polaris";
import { SearchIcon, XIcon } from "@shopify/polaris-icons";

export default function SelectCollections({ collectionIds, setCollectionIds }) {
	const [allCollections, setAllCollections] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [searchCollections, setSearchCollections] = useState(allCollections);

	const changeInputValue = useCallback(function (searchText) {
		setSearchText(searchText);
		setSearchCollections(allCollections.filter(function (item) {
			return item.title.toLowerCase().includes(searchText.toLowerCase());
		}));
	}, [allCollections]);

	const removeCollectionId = useCallback(function (collectionId) {
		setCollectionIds(collectionIds.filter(function(item) {
			return item !== collectionId;
		}));
	}, [collectionIds, setCollectionIds]);

	useEffect(function () {
		const data = [
			{ id: 1, title: "Vintage" },
			{ id: 2, title: "Cotton" },
			{ id: 3, title: "Summer" },
		];
		setAllCollections(data);
		setSearchCollections(data);
	}, []);

	return <BlockStack gap="400">
		<Autocomplete
			allowMultiple
			textField={<Autocomplete.TextField value={searchText} onChange={changeInputValue} prefix={<Icon source={SearchIcon} />} />}
			options={searchCollections.map((item) => ({ label: item.title, value: item.id }))}
			selected={collectionIds}
			onSelect={setCollectionIds}
			listTitle="Suggested Collections"
		/>
		<BlockStack gap="300">
			{collectionIds.map(function (collectionId) {
				const item = allCollections.find(function (collection) {
					return collection.id === collectionId;
				});

				return item && <Card padding="100" key={item.id}>
					<InlineStack align="space-between">
						<ResourceItem verticalAlignment="center" id={item.id} media={<Avatar customer size="xl" />}>{item.title}</ResourceItem>
						<Button icon={XIcon} onClick={() => removeCollectionId(item.id) } variant="plain"></Button>
					</InlineStack>
				</Card>;
			})}
		</BlockStack>
	</BlockStack>;
}
