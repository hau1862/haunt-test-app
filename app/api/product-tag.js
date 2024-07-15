import { authenticate } from "../shopify.server";

export default {
	create: async function (request = {}, data = { tag: "" }) {
		const { admin } = await authenticate.admin(request);

		const response = await admin.graphql(
			`mutation productTagCreate($input: ProductTag!) {
				productTagCreate(node: $input) {
					productTag {
						edges {
							node
						}
					}
				}
			}`,
			{
				variables: {
					input: data.tag,
				},
			},
		);

		const responseJson = await response.json();

		return responseJson.data.productTagCreate.productTag.edges.map(
			function (item) {
				return item.node;
			},
		);
	},
	all: async function (request = {}, data = { first: 10 }) {
		const { storefront } = await authenticate.public.appProxy(request);

		const response = await storefront.graphql(
			`query productTags($first: Int!) {
				productTags(first: $first) {
					edges {
						node
					}
				}
			}`,
			{
				variables: {
					first: data.first,
				},
			},
		);

		const responseJson = await response.json();

		// return responseJson.data.productTag.edges.map(function (item) {
		// 	return item.node;
		// });
		return responseJson;
	},
};
