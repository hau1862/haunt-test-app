import { authenticate } from "../shopify.server";

const graphqlFieldsString = `
id
title
image {
	url
}
`;

function convertToAppData(graphqlData) {
	return {
		id: graphqlData.id,
		title: graphqlData.title,
		imageUrl: graphqlData.image?.url,
	};
}

function convertToGraphqlData(appData) {
	return {
		id: appData.id,
		title: appData.title,
		image: {
			url: appData.imageUrl,
		},
	};
}

export default {
	create: async function (request = {}, data = { title: "" }) {
		const { admin } = await authenticate.admin(request);

		const response = await admin.graphql(
			`mutation collectionCreate($input: CollectionInput!) {
				collectionCreate(input: $input) {
					collection {
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
		const rawCollection = responseJson.data.collectionCreate.collection;

		return rawCollection ? convertToAppData(rawCollection) : {};
	},
	all: async function (request = {}, data = { first: 10 }) {
		const { admin } = await authenticate.admin(request);

		const response = await admin.graphql(
			`query collections($first: Number!) {
				collections(first: $first) {
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

		const responseJson = await response.json();

		return responseJson.data.collections.nodes.map(convertToAppData);
	},
};
