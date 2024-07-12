import { useCallback, useEffect, useState } from "react";
import {
	Autocomplete,
	InlineStack,
	Tag,
	BlockStack,
	Icon,
} from "@shopify/polaris";
import { PlusCircleIcon, SearchIcon } from "@shopify/polaris-icons";
import { useFetcher } from "@remix-run/react";

export default function SelectProductTags({ productTags, setProductTags }) {
	const fetcher = useFetcher();
	const [allTags, setAllTags] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [searchTags, setSearchTags] = useState(allTags);
	console.log(fetcher);

	const changeInputValue = useCallback(
		function (inputValue) {
			setInputValue(inputValue);
			setSearchTags(
				allTags.filter(function (item) {
					return item
						.toLowerCase()
						.includes(inputValue.toLowerCase());
				}),
			);
		},
		[allTags],
	);

	const addProductTag = useCallback(
		function (productTag) {
			setProductTags(productTags.concat(productTag));
		},
		[productTags, setProductTags],
	);

	const removeProductTag = useCallback(
		function (productTag) {
			setProductTags(
				productTags.filter(function (item) {
					return item !== productTag;
				}),
			);
		},
		[productTags, setProductTags],
	);

	useEffect(function () {
		fetcher.submit({}, { method: "POST" });
	}, []);

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
						value={inputValue}
						onChange={changeInputValue}
						prefix={<Icon source={SearchIcon} />}
					/>
				}
				options={searchTags.map((item) => ({
					label: item,
					value: item,
				}))}
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
