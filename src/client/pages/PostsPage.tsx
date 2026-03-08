import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import z from 'zod';

const Post = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string()
})
type Post = z.infer<typeof Post>

const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([])
  
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => res.json()) 
      .then((data) => z.array(Post).safeParse(data))
      .then((res) => { if (res.success) setPosts(res.data) })
  }, [])

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
  )
  
}

export default PostsPage;