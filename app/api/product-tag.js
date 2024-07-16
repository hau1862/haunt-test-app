import { authenticate } from "../shopify.server";

const graphqlFieldsString = `
edges {
	node
}
`;

function convertToAppData(graphqlData) {
	return graphqlData.node;
}

function convertToGraphqlData(appData) {}

export default {
	create: async function (request = {}, data = { tag: "" }) {
		const { admin } = await authenticate.admin(request);
		const createProductResponse = await admin.graphql(
			`mutation productCreate($input: ProductInput!) {
				productCreate(input: $input) {
					product {
						id
					}
				}	
			}`,
			{
				variables: {
					input: {
						title: "add tag"
					},
				},
			},
		);
		const createProductResponseJson = await createProductResponse.json();
		const rawProduct = createProductResponseJson.data.productCreate.product;
		const response = await admin.graphql(
			`mutation tagsAdd($id: ID!, $tags: [String!]!) {
				tagsAdd(id: $id, tags: $tags) {
					node {
						id
					}
				}
			}`,
			{
				variables: {
					id: rawProduct.id,
					tags: [data.tag]
				},
			},
		);
		const responseJson = await response.json();
		const deleteProductResponse = await admin.graphql(
			`mutation productDelete($input: ProductInput!) {
				productDelete(input: $input) {
					deletedProductId
				}	
			}`,
			{
				variables: {
					input: {
						id: rawProduct.id
					}
				},
			},
		)

		return responseJson.data.tagsAdd.node.id;
	},
	all: async function (request = {}, data = { first: 10 }) {
		const { admin } = await authenticate.admin(request);
		const response = await admin.graphql(
			`query productTags($first: Int!) {
				shop {
					productTags(first: $first) {
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
		const responseJson = await response.json();
		
		return responseJson.data.shop.productTags.edges.map(convertToAppData);
	},
};
