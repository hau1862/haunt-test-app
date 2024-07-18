const ruleStatus = ["Disable", "Enable"];
const applyOptions = ["All products", "Specific products", "Product collections", "Product tags"];
const priceOptions = ["Apply price", "Decrease amount", "Decrease percent"];

const samplePricingRule = {
	id: 0,
	generalInformation: {
		name: "",
		priority: 0,
		status: 1,
		first: true,
		minPriority: 0,
		maxPriority: 99,
		getData() {
			return {
				name: this.name.trim(),
				priority: this.priority,
				status: this.status
			};
		},
		validateName() {
			if (!this.name.trim()) {
				return { ok: false, message: "Pricing rule name is required" };
			} else {
				return { ok: true, message: "" };
			}
		},
		validatePriority() {
			if (this.priority < this.minPriority || this.priority > this.maxPriority) {
				return { ok: false, message: `Pricing rule priority must be greater than or equal to ${this.minPriority} and less than or equal to ${this.maxPriority}` };
			} else {
				return { ok: true, message: "" };
			}
		},
	},
	applyProducts: {
		option: 0,
		productIds: [],
		collectionIds: [],
		productTags: [],
		getData() {
			return {
				option: this.option,
				productIds: this.productIds,
				collectionIds: this.collectionIds,
				productTags: this.productTags
			};
		}
	},
	customPrices: {
		option: 0,
		amount: 0,
		minFixPrice: 0,
		maxFixPrice: undefined,
		minDecreaseAmount: 0,
		maxDecreaseAmount: undefined,
		minDecreasePercent: 0,
		maxDecreasePercent: 100,
		currencyCode: "$",
		percent: "%",
		suffix: " $",
		getData() {
			return {
				option: this.option,
				amount: this.amount,
				suffix: this.suffix
			};
		},
		validateAmount() {
			switch (this.option) {
				case 0: {
					if (this.amount < this.minFixPrice) {
						return { ok: false, message: `Pricing rule decrease amount must be greater than or equal to ${this.minFixPrice}` };
					} else {
						return { ok: true, message: "" };
					}
				}
				case 1: {
					if (this.amount < this.minDecreaseAmount) {
						return { ok: false, message: `Pricing rule decrease amount must be greater than or equal to ${this.minDeceaseAmount}` };
					} else {
						return { ok: true, message: "" };
					}
				}
				case 2: {
					if (this.amount < this.minDecreasePercent || this.amount > this.maxDecreasePercent) {
						return { ok: false, message: `Pricing rule decease percent mus be greater than or equal to ${this.minDecreasePercent} and less than or equal to ${this.maxDecreasePercent}` };
					} else {
						return { ok: true, message: "" };
					}
				}
				default: {
					return { ok: true, message: "" };
				}
			}
		}
	},

};

export { samplePricingRule, ruleStatus, applyOptions, priceOptions };
