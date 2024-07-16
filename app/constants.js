const ruleStatus = ["Disable", "Enable"];
const applyOptions = ["All products", "Specific products", "Product collections", "Product tags"];
const priceOptions = ["Apply price", "Decrease amount", "Decrease percent"]

const samplePricingRule = {
	id: 0,
	generalInformation: {
		name: "",
		priority: 0,
		status: 1,
	},
	applyProducts: {
		option: 0,
		productIds: [],
		collectionIds: [],
		productTags: [],
	},
	customPrices: {
		option: 0,
		amount: 0,
		suffix: "$"
	}
}

export { samplePricingRule, ruleStatus, applyOptions, priceOptions }
