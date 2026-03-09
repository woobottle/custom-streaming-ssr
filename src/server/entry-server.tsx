//`StaticRouter`(from `react-router-dom`)로 `App`을 감싸고 `location={url}`을 전달
//`ReactDOMServer.renderToString()`으로 HTML 문자열을 반환

import { PassThrough, Readable } from "node:stream";
import {
	dehydrate,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "../client/App";

export async function render(url: string, template: string): Promise<Readable> {
	const queryClient = new QueryClient();
	if (url === "/posts") {
		await queryClient.prefetchQuery({
			queryKey: ["posts"],
			queryFn: async () => {
				const response = await fetch(
					"https://jsonplaceholder.typicode.com/posts",
				);
				return response.json();
			},
		});
	}

	const [head, footer] = template.split("<!-- separator -->");

	async function* asyncGenerator() {
		yield head;
		const passThrough = new PassThrough();
		let timeout: NodeJS.Timeout;
		const { pipe, abort } = renderToPipeableStream(
			<QueryClientProvider client={queryClient}>
				<StaticRouter location={url}>
					<App />
				</StaticRouter>
			</QueryClientProvider>,
			{
				onShellReady() {
					// 시작 시 timeout으로 abort 예약
					timeout = setTimeout(() => {
						abort();
					}, 3000);
					pipe(passThrough);
				},
				onError(err) {
					console.error(err);
				},
				onAllReady() {
					// 완료 시 clear
					clearTimeout(timeout);
				},
			},
		);

		for await (const chunk of passThrough) {
			yield chunk;
		}

		const stateScript = `<script>window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydrate(queryClient))}</script>`;
		const replacedFooter = footer.replace(
			"<!-- INITIAL_STATE -->",
			stateScript,
		);

		yield replacedFooter;
		queryClient.clear();
	}

	return Readable.from(asyncGenerator());
}
