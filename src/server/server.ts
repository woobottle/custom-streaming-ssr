import fs from "node:fs";
import path from "node:path";
import middie from "@fastify/middie";
import Fastify from "fastify";
import sirv from "sirv";
import { createServer as createViteServer } from "vite";

const isDev = process.env.NODE_ENV === "development";

async function createServer() {
	const fastify = Fastify({
		logger: true,
	});
	await fastify.register(middie);

	// biome-ignore lint/suspicious/noExplicitAny: vite dev server type
	let vite: any;
	if (isDev) {
		vite = await createViteServer({
			server: { middlewareMode: true },
			appType: "custom",
		});

		fastify.use(vite.middlewares);
	} else {
		// https://github.com/bluwy/create-vite-extra/blob/master/template-ssr-react/server.js
		fastify.use(
			sirv(path.resolve("dist/client"), {
				extensions: [""],
			}),
		);
	}

	fastify.get("*", async (request, reply) => {
		const url = request.originalUrl;

		if (isDev) {
			try {
				const template = fs.readFileSync(path.resolve("index.html"), "utf-8");

				const { render } = await vite.ssrLoadModule(
					"/src/server/entry-server.tsx",
				);
				const html = await vite.transformIndexHtml(url, template);
				const stream = await render(url, html);

				reply.header("Content-type", "text/html");
				return reply.send(stream);
				// biome-ignore lint/suspicious/noExplicitAny: need stack property
			} catch (e: any) {
				vite.ssrFixStacktrace(e);
				console.log(e.stack);
				reply.status(500);
			}
		} else {
			try {
				const template = fs.readFileSync(
					path.resolve("dist/client/index.html"),
					"utf-8",
				);
				// @ts-expect-error -- 빌드된 서버 번들
				const { render } = await import("../../dist/server/entry-server.js");
				const stream = await render(url, template);

				reply.header("Content-type", "text/html");
				return reply.send(stream);
				// biome-ignore lint/suspicious/noExplicitAny: need stack property
			} catch (e: any) {
				console.log(e.stack);
				reply.status(500);
			}
		}
	});

	fastify.listen({ port: 3000 });
}

export { createServer };
