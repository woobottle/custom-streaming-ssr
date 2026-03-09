import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import z from "zod";

const Post = z.object({
	id: z.number(),
	title: z.string(),
	body: z.string(),
});

const Comment = z.object({
	id: z.number(),
	name: z.string(),
	email: z.string(),
	body: z.string(),
});

const PostDetailPage = () => {
	const { id } = useParams();

	const { data: post } = useSuspenseQuery({
		queryKey: ["post", id],
		queryFn: async () => {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			return await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
				.then((res) => res.json())
				.then((data) => Post.parse(data));
		},
	});

	const { data: comments } = useSuspenseQuery({
		queryKey: ["postComments", id],
		queryFn: async () => {
			return await fetch(
				`https://jsonplaceholder.typicode.com/comments?postId=${id}`,
			)
				.then((res) => res.json())
				.then((data) => z.array(Comment).parse(data));
		},
	});

	return (
		<div>
			<h1>{post?.title}</h1>
			<p>{post?.body}</p>
			<h2>Comments</h2>
			<ul>
				{comments.map((comment) => (
					<li key={comment.id}>{comment.name}</li>
				))}
			</ul>
		</div>
	);
};

export default PostDetailPage;
