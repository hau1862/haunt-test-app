const utils = {
	key: "pricingRules",
	get: function () {
		return JSON.parse(localStorage.getItem(this.key)) || [];
	},
	set: function (data = []) {
		localStorage.setItem(this.key, JSON.stringify(data));
	}
}

export default {
	create: async function (request = {}, data = {}) {
		const pricingRules = utils.get();
		const newRule = { id: pricingRules.length, ...data }

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
		})

		return pricingRules[readIndex];
	},
	update: async function (request = {}, id = 0, data = {}) {
		const pricingRules = utils.get();
		const updateIndex = pricingRules.findIndex(function (item) {
			return item.id === id;
		});

		if(updateIndex >= 0) {
			pricingRules[updateIndex] = {...pricingRules[updateIndex], ...data};
			utils.set(pricingRules);
		}

		return pricingRules[updateIndex];
	},
	delete: async function (request = {}, id = 0) {
		const pricingRules = utils.get();
		const deleteIndex = pricingRules.findIndex(function (item) {
			return item.id === id;
		});
		
		if(deleteIndex >= 0) {
			utils.set(pricingRules.filter(function (item) {
				return item.id !== id;
			}));
		}

		return pricingRules[deleteIndex];
	}
}
