export const getPosts = async (queryParams) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts?` +
      new URLSearchParams(queryParams),
  )
  return await res.json()
}
export const createPost = async (token, post, socketId) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
  if (socketId) {
    headers['x-socket-id'] = socketId
  }
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
    method: 'POST',
    headers,
    body: JSON.stringify(post),
  })
  return await res.json()
}
export const getPostById = async (postId) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`)
  return await res.json()
}
