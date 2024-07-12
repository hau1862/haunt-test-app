import { authenticate } from "../shopify.server";

const graphqlFieldsString = `
id
title
featuredMedia {
	preview {
		image {
			url
		}
	}
}
priceRangeV2 {
	maxVariantPrice {
		amount
		currencyCode
	}
}
`;

function convertToAppData(graphqlData) {
	return {
		id: graphqlData.id,
		title: graphqlData.title,
		price: graphqlData.priceRangeV2?.maxVariantPrice,
		imageUrl: graphqlData.featuredMedia.preview?.image.url,
	};
}

function convertToGraphqlData(appData) {
	return {
		id: appData.id,
		title: appData.title,
		featuredMedia: {
			preview: {
				image: {
					url: appData.imageUrl,
				},
			},
		},
		priceRangeV2: {
			maxVAriantPrice: appData.price,
		},
	};
}

export default {
	create: async function (request = {}, data = { title: "" }) {
		const { admin } = await authenticate.admin(request);

		const response = await admin.graphql(
			`mutation productCreate($input: ProductInput!) {
				productCreate(input: $input) {
					product {
						${graphqlFieldsString}
					}
				}	
			}`,
			{
				variables: {
					input: convertToGraphqlData(data),
				},
			},
		);

		const responseJson = await response.json();
		const rawProduct = responseJson.data.productCreate.product;

		return rawProduct ? convertToAppData(rawProduct) : {};
	},
	all: async function (request = {}, data = { title: "" }) {
		const { admin } = await authenticate.admin(request);

		const response = await admin.graphql(
			`query products($query: String) {
				products(query: $query) {
					nodes {
						${graphqlFieldsString}
					}
				}
			}`,
			{
				variables: {
					query: `title: "%${data.title}%"`,
				},
			},
		);

		const responseJson = await response.json();

		return responseJson.data.product.nodes.map(convertToAppData);
	},
	read: async function (request = {}, data = { id: "" }) {
		const { admin } = await authenticate.admin(request);

		const response = await admin.graphql(
			`query product($id: String) {
				product(id: $id) {
					${graphqlFieldsString}
				}
			}`,
			{
				variables: {
					id: data.id,
				},
			},
		);

		const responseJson = await response.json();
		const rawProduct = responseJson.data.product;

		return rawProduct ? convertToAppData(rawProduct) : {};
	},
};
