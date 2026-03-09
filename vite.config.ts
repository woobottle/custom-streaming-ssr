import react from "@vitejs/plugin-react";
import { type ConfigEnv, defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }: ConfigEnv) => {
	return {
		plugins: [
			react({
				babel: {
					plugins: [["babel-plugin-react-compiler"]],
				},
			}),
		],
		server: {
			port: 3000,
			ssr: isSsrBuild,
		},
		build: {
			outDir: isSsrBuild ? "dist/server" : "dist/client",
		},
	};
});
