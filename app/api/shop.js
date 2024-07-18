import { authenticate } from "../shopify.server";

const graphqlFieldsString = `
currencyCode
`;

function convertToAppData(graphqlData) {
	return {
		currencyCode: graphqlData.currencyCode
	};
}

function convertToGraphqlData(appData) {
	return {
		currencyCode: appData.currencyCode
	};
}

export default {
	read: async function (request = {}, data = {}) {
		const { admin } = await authenticate.admin(request);

		const response = await admin.graphql(
			`query shop {
				shop {
					${graphqlFieldsString}
				}
			}`,
			{
				variables: {

				}
			}
		);
		const responseJson = await response.json();
		const rawShop = responseJson.data.shop;
		return rawShop ? convertToAppData(rawShop) : {};
	}
};
