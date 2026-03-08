import { useParams } from "react-router-dom"
import { useState } from "react"
import { useEffect } from "react"
import z from 'zod'

const Post = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string()
})
type Post = z.infer<typeof Post>


const Comment = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  body: z.string()
})
type Comment = z.infer<typeof Comment>

const PostDetailPage = () => {
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    Promise.all([
      fetch(`https://jsonplaceholder.typicode.com/posts/${id}`),
      fetch(`https://jsonplaceholder.typicode.com/comments?postId=${id}`)
    ]).then(async ([postRes, commentsRes]) => {
      const postData = await postRes.json()
      const commentsData = await commentsRes.json()
      const post = Post.safeParse(postData)
      const comments = Comment.array().safeParse(commentsData)
      if (post.success) setPost(post.data)
      if (comments.success) setComments(comments.data)
    })
    
  }, [id])

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
  )
}

export default PostDetailPage