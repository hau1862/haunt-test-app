import { authenticate } from "../shopify.server";

const graphqlFieldsString = `
id
discount {
	... on DiscountCodeBasic {
		title
	}
	... on DiscountCodeBxgy {
		title
	}
	... on DiscountCodeFreeShipping {
		title
	}
	... on DiscountAutomaticApp {
		title
	}
	... on DiscountAutomaticBasic {
		title
	}
	... on DiscountAutomaticBxgy {
		title
	}
	... on DiscountAutomaticFreeShipping {
		title
	}
}`;

function convertToAppData(graphqlData) {
	return {
		id: graphqlData.id,
		title: graphqlData.discount.title,
		option: 0,
		amount: 0,
	};
}

function convertToGraphqlData(appData) {
	return {};
}

export default {
	create: async function (request, data = { title: "" }) {
		const { admin } = await authenticate.admin(request);

		return 0;
	},
	all: async function (request, data = { first: 10, title: "" }) {
		const { admin } = await authenticate.admin(request);

		const response = await admin.graphql(
			`query discountNodes($first: Int!, $query: String) {
				discountNodes(first: $first) {
					nodes {
						${graphqlFieldsString}
					}
				}
			}`,
			{
				variables: {
					first: data.first,
				},
			},
		);

		return 0;
	},
};
