import { Autocomplete, InlineStack, Tag, BlockStack } from "@shopify/polaris";
import { PlusCircleIcon } from "@shopify/polaris-icons";
import { useCallback, useEffect, useState } from "react";

export default function SelectProductTags({ productTags, setProductTags }) {
	const [allTags, setAllTags] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [searchTags, setSearchTags] = useState(allTags);

	const changeInputValue = useCallback(
		function (inputValue) {
			setInputValue(inputValue);
			setSearchTags(
				allTags.filter(function (tag) {
					return tag.includes(inputValue.trim());
				}),
			);
		},
		[allTags],
	);

	const addProductTag = useCallback(function () {
		console.log("Add Tag");
	}, []);

	const removeProductTag = useCallback(
		function (index) {
			const selectedTags = [...productTags];
			selectedTags.splice(index, 1);
			setProductTags(selectedTags);
		},
		[productTags, setProductTags],
	);

	useEffect(function () {
		const data = ["Vintage", "Cotton", "Summer", "Winter"];
		setAllTags(data);
		setSearchTags(data);
	}, []);

	return (
		<BlockStack gap="300">
			<Autocomplete
				allowMultiple
				actionBefore={{
					accessibilityLabel: "Add new tag",
					content: "Add",
					icon: PlusCircleIcon,
					badge: { tone: "new", content: "New!" },
					onAction: addProductTag,
				}}
				textField={
					<Autocomplete.TextField
						placeholder="Vintage, cotton, summer"
						value={inputValue}
						onChange={changeInputValue}
					/>
				}
				options={searchTags.map(function (tags) {
					return { label: tags, value: tags };
				})}
				selected={productTags}
				onSelect={setProductTags}
				listTitle="Suggested Product Tags"
			/>
			<InlineStack gap="200">
				{productTags.map(function (productTag, index) {
					return (
						<Tag
							onRemove={() => removeProductTag(index)}
							key={productTag + index}
						>
							<div style={{ padding: "4px 8px" }}>
								{productTag}
							</div>
						</Tag>
					);
				})}
			</InlineStack>
		</BlockStack>
	);
}
