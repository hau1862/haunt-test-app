import { authenticate } from "../shopify.server";

export default {
	create: async function (request, data = { tag: "" }) {
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

		return await response.json();
	},
	all: async function (request, data = { first: 10 }) {
		const { admin } = await authenticate.admin(request);

		const response = await admin.graphql(
			`query productTagReadAll($first: first!) {
				productTag(first: $first) {
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

		return await response.json();
	},
};
