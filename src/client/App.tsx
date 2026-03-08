import './App.css'
import { Route, Routes } from 'react-router-dom'
import UsersPage from './pages/UsersPage'
import PostsPage from './pages/PostsPage'
import PostDetailPage from './pages/PostDetailPage'
import HomePage from './pages/HomePage'

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/posts" element={<PostsPage />} />
      <Route path="/posts/:id" element={<PostDetailPage />} />
      <Route path="/users" element={<UsersPage />} />
    </Routes>
  )
}

export default App
