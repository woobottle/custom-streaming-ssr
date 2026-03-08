import { useEffect, useState } from "react"
import z from 'zod';

const User = z.object({
  id: z.number(),
  name: z.string()
})
type User = z.infer<typeof User>

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((data) => z.array(User).safeParse(data))
      .then((res) => { if (res.success) setUsers(res.data) })
  }, [])

  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default UsersPage