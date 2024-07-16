import { useCallback, useEffect, useState } from "react";
import { Autocomplete, InlineStack, Tag, BlockStack, Icon } from "@shopify/polaris";
import { PlusCircleIcon, SearchIcon } from "@shopify/polaris-icons";
import { useFetcher } from "@remix-run/react";

export default function SelectProductTags({ productTags, setProductTags }) {
	const fetcher = useFetcher();
	const [allTags, setAllTags] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [searchTags, setSearchTags] = useState(allTags);

	const changeSearchText = useCallback(function (text) {
		setSearchText(text);
		setSearchTags(allTags.filter(function (item) {
			return item.toLowerCase().includes(text.toLowerCase());
		}));
	}, [allTags]);

	const addProductTag = useCallback(function (productTag) {
		fetcher.submit(
			{ name: "productTagCreate", data: { tag: searchText } },
			{ method: "POST", encType: "application/json" }
		)
	}, [fetcher, searchText]);

	const removeProductTag = useCallback(function (productTag) {
		setProductTags(productTags.filter(function (item) {
			return item !== productTag;
		}));
	}, [productTags, setProductTags]);

	useEffect(function () {
		fetcher.submit(
			{ name: "productTags", data: { first: 20 }},
			{ method: "POST", encType: "application/json" }
		);
	}, []);

	useEffect(function () {
		if(fetcher.data?.ok && fetcher.data.name === "productTags") {
			setAllTags(fetcher.data.productTags);
			setSearchTags(fetcher.data.productTags)
		}
	}, [fetcher])

	return (
		<BlockStack gap="300">
			<Autocomplete
				allowMultiple
				actionBefore={{
					content: "Add",
					icon: PlusCircleIcon,
					onAction: addProductTag,
				}}
				textField={
					<Autocomplete.TextField
						value={searchText}
						onChange={changeSearchText}
						prefix={<Icon source={SearchIcon} />}
					/>
				}
				options={searchTags.map(function (item) {
					return { label: item, value: item }
				})}
				selected={productTags}
				onSelect={setProductTags}
				listTitle="Suggested Product Tags"
			/>
			<InlineStack gap="200">
				{productTags.map(function (item) {
					return (
						<Tag onRemove={() => removeProductTag(item)} key={item}>
							<div style={{ padding: "4px 8px" }}>{item}</div>
						</Tag>
					);
				})}
			</InlineStack>
		</BlockStack>
	);
}
