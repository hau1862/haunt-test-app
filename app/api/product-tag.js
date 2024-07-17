import { authenticate } from "../shopify.server";

const graphqlFieldsString = `
edges {
	node
}
`;

function convertToAppData(graphqlData) {
	return graphqlData.node;
}

function convertToGraphqlData(appData) {
	return {
		node: appData
	}
}

export default {
	create: async function (request = {}, data = { tag: "" }) {
		const { admin } = await authenticate.admin(request);
		const getProductResponse = await admin.graphql(
			`query products($first: Int!, $query: String) {
				products(first: $first, query: $query) {
					nodes {
						id
					}
				}
			}`,
			{
				variables: {
					first: 1,
					query: "title:'Tags Add Product'"
				},
			},
		);
		const getProductResponseJson = await getProductResponse.json();
		const rawProduct = getProductResponseJson.data.products?.nodes[0];
		let id = "";
		if(rawProduct) {
			id = rawProduct.id;
		} else {
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
							title: "Tags Add Product",
							category: "gid://shopify/TaxonomyCategory/so"
						},
					},
				},
			);
			const createProductResponseJson = await createProductResponse.json();
			id = createProductResponseJson.data.productCreate.product?.id;
		}

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
					id,
					tags: [data.tag]
				},
			},
		);
		const responseJson = await response.json();

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
