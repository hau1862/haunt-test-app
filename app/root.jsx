import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

export default function App() {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<link rel="preconnect" href="https://cdn.shopify.com/" />
				<link rel="stylesheet" type="text/css" href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css" />
				<Meta />
				<Links />
			</head>
			<body>
				<style>
					{`
						.Polaris-Modal-Dialog__Modal .Polaris-Text--root.Polaris-Text--break:has(.modal-title) {
							width: 100%;
						}

						.rule-item {
							display: flex;
							justify-content: space-between;
							align-items: center;
						}

						.item-remove-button {
							padding: 0px 12px;
							display: flex;
							align-items: center;
						}

						.modal-title {
							font-size: 22px;
							text-align: center;
						}
					`}
				</style>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}
