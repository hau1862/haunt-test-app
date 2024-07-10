import { authenticate } from "../shopify.server";

export default {
	create: async function (request = {}, data = { title: "" }) {
		const { admin } = await authenticate.admin(request);

		const response = await admin.graphql(
			`mutation productCreate($input: ProductInput!) {
				productCreate(input: $input) {
					product {
						id
						title
						status
						variants(first: 10) {
							nodes {
								id
								price
								createdAt
							}
						}
					}
				}	
			}`,
			{
				variables: {
					input: data,
				},
			},
		);

		return await response.json();
	},
	read: async function (request = {}, data = { id: "" }) {
		return 0;
	},
	all: async function (request = {}, data = { id: "" }) {
		return 0;
	},
	update: async function (request = {}, data = { id: "" }) {
		return 0;
	},
	delete: async function (request = {}, data = { id: "" }) {
		return 0;
	},
};
