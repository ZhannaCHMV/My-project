import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

export function Post() {
  const { id } = useParams()

  const postQuery = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`)
      if (!res.ok) {
        throw new Error('Failed to load recipe')
      }
      return res.json()
    },
  })

  if (postQuery.isLoading)
    return <div style={{ padding: 16 }}>Loading recipe...</div>
  if (postQuery.isError)
    return <div style={{ padding: 16 }}>Error loading recipe.</div>

  const post = postQuery.data

  return (
    <div style={{ padding: 16, maxWidth: 800 }}>
      <Link to='/'>← Back to recipes</Link>
      <hr />
      <h1>{post.title}</h1>
      <h3>Ingredients:</h3>
      <p style={{ whiteSpace: 'pre-line' }}>{post.ingredientList}</p>
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'cover' }}
        />
      )}
    </div>
  )
}