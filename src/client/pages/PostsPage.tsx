import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import z from "zod";

const Post = z.object({
	id: z.number(),
	title: z.string(),
	body: z.string(),
});
const PostsPage = () => {
	const { data: posts } = useSuspenseQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			await new Promise((resolve) => setTimeout(resolve, 3000));
			return await fetch("https://jsonplaceholder.typicode.com/posts")
				.then((res) => res.json())
				.then((data) => z.array(Post).parse(data));
		},
	});

	return (
		<div>
			<div>test for initial render</div>
			<ul>
				{posts.map((post) => (
					<li key={post.id}>
						<Link to={`/posts/${post.id}`}>{post.title}</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default PostsPage;
