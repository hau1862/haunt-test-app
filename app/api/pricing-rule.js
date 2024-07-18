const utils = {
	key: "pricingRules",
	get: function () {
		return JSON.parse(localStorage.getItem(this.key)) || [];
	},
	set: function (data = []) {
		localStorage.setItem(this.key, JSON.stringify(data));
	}
};

export default {
	create: async function (request = {}, data = {}) {
		const pricingRules = utils.get();
		const newRule = { id: pricingRules[0] ? pricingRules[0].id + 1 : pricingRules.length, ...data };

		utils.set(pricingRules.concat(newRule));

		return newRule;
	},
	all: async function (request = {}) {
		return utils.get();
	},
	read: async function (request = {}, id = 0) {
		const pricingRules = utils.get();
		const readIndex = pricingRules.findIndex(function (item) {
			return item.id === id;
		});

		return pricingRules[readIndex];
	},
	update: async function (request = {}, id = 0, data = {}) {
		const pricingRules = utils.get();
		const updateIndex = pricingRules.findIndex(function (item) {
			return item.id === id;
		});

		if (updateIndex >= 0) {
			pricingRules[updateIndex] = { ...pricingRules[updateIndex], ...data };
			utils.set(pricingRules);
		}

		return pricingRules[updateIndex];
	},
	delete: async function (request = {}, id = 0) {
		const pricingRules = utils.get();
		const deleteIndex = pricingRules.findIndex(function (item) {
			return item.id === id;
		});

		if (deleteIndex >= 0) {
			utils.set(pricingRules.filter(function (item) {
				return item.id !== id;
			}));
		}

		return pricingRules[deleteIndex];
	},
	validateProduct(rule, product) {
		switch (rule.applyProducts.option) {
			case 0: {
				return true;
			}
			case 1: {
				return rule.applyProducts.productIds.includes(product.id);
			}
			case 2: {
				return rule.applyProducts.collectionIds.some(function (item) {
					return product.collectionIds.includes(item);
				});
			}
			case 3: {
				return rule.applyProducts.productTags.some(function (item) {
					return product.productTags.includes(item);
				});
			}
			default: {
				return false;
			}
		}
	},
	calculatePrice(rule, product) {
		switch (rule.customPrices.option) {
			case 0: {
				return Math.min(product.priceAmount, rule.customPrices.amount);
			}
			case 1: {
				return Math.max(product.priceAmount - rule.customPrices.amount, 0);
			}
			case 2: {
				return Number.parseInt(product.priceAmount * (1 - rule.customPrices.amount / 100));
			}
			default: {
				return product.priceAmount;
			}
		}
	}
};
