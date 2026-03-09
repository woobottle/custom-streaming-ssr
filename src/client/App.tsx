import "./App.css";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PostDetailPage from "./pages/PostDetailPage";
import PostsPage from "./pages/PostsPage";
import UsersPage from "./pages/UsersPage";

function PostFallback() {
	return <>post hihi</>;
}

function PostDetailFallback() {
	return <>post detail hihi</>;
}

function App() {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route
				path="/posts"
				element={
					<Suspense fallback={<PostFallback />}>
						<PostsPage />
					</Suspense>
				}
			/>
			<Route
				path="/posts/:id"
				element={
					<Suspense fallback={<PostDetailFallback />}>
						<PostDetailPage />
					</Suspense>
				}
			/>
			<Route path="/users" element={<UsersPage />} />
		</Routes>
	);
}

export default App;
