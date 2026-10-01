import { PostList } from '../components/PostList.jsx'
import { CreatePost } from '../components/CreatePost.jsx'
import { PostFilter } from '../components/PostFilter.jsx'
import { PostSorting } from '../components/PostSorting.jsx'
import { Header } from '../components/Header.jsx'
import { useQuery } from '@tanstack/react-query'
import { getPosts } from '../api/posts.js'
import { useState, useEffect } from 'react'
import { useSocket } from '../contexts/SocketIOContext.jsx'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export function Blog() {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')
  const postsQuery = useQuery({
    queryKey: ['posts', { author, sortBy, sortOrder }],
    queryFn: () => getPosts({ author, sortBy, sortOrder }),
  })
  const posts = postsQuery.data ?? []
  const { socket } = useSocket()
  useEffect(() => {
    if (!socket) return

    const handleNewRecipe = (recipe) => {
      console.log('Received recipe payload:', recipe)

      const title = recipe?.title || 'New Recipe'
      const id = recipe?.id || recipe?._id

      toast.info(
        <div style={{ color: '#222' }}>
          New recipe was added: <strong>{title}</strong>
          <div style={{ marginTop: '8px' }}>

            <Link

              to={`/posts/${id}`}
              style={{
                color: '#cc0063',
                display: 'inline-block',
              }}
            >
              Go to see the new recipe →
            </Link>
          </div>
        </div>,
        {
          position: 'top-right',
          autoClose: 30000,
        },
      )
    }

    socket.on('recipe:added', handleNewRecipe)
    return () => {
      socket.off('recipe:added', handleNewRecipe)
    }
  }, [socket])
  return (
    <div style={{ padding: 8 }}>
      <Header />
      <br />
      <hr />
      <CreatePost />
      <hr />
      Filter by:
      <PostFilter
        field='author'
        value={author}
        onChange={(value) => setAuthor(value)}
      />
      <br />
      <PostSorting
        fields={['createdAt', 'updatedAt', 'likesCount']}
        value={sortBy}
        onChange={(value) => setSortBy(value)}
        orderValue={sortOrder}
        onOrderChange={(orderValue) => setSortOrder(orderValue)}
      />
      <hr />
      <PostList posts={posts} />
      <ToastContainer />
    </div>
  )
}
