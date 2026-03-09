import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import "./index.css";
import {
	type DehydratedState,
	HydrationBoundary,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";

declare global {
	interface Window {
		__REACT_QUERY_STATE__: DehydratedState;
	}
}

const queryClient = new QueryClient();
const state = window.__REACT_QUERY_STATE__;

hydrateRoot(
	// biome-ignore lint/style/noNonNullAssertion: root element always exists
	document.getElementById("root")!,
	<StrictMode>
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<HydrationBoundary state={state}>
					<App />
				</HydrationBoundary>
			</QueryClientProvider>
		</BrowserRouter>
	</StrictMode>,
);
