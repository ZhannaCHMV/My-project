import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import { useAuth } from '../contexts/AuthContext.jsx'

import { createPost } from '../api/posts.js'
import { useSocket } from '../contexts/SocketIOContext.jsx'
export function CreatePost() {
  const [title, setTitle] = useState('')

  const [ingredientList, setIngredientList] = useState('')

  const [image, setImage] = useState('')

  const [token] = useAuth() // REMOVE author

  const queryClient = useQueryClient()
  const {socket} = useSocket()
  const createPostMutation = useMutation({
    mutationFn: () => createPost(token, { title, ingredientList, image }, socket?.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']),
        setTitle('')
      setIngredientList('')
      setImage('')
    }
  })
  const handleSubmit = (e) => {
    e.preventDefault()
    createPostMutation.mutate()
  }

  if (!token) return <div>Please log in to create new recipes.</div>

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='create-title'>Title: </label>
        <input
          type='text'
          name='create-title'
          id='create-title'
          value={title}
          style={{ width: '400px' }}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-inredientList'>Ingredient list </label>
        <textarea
          rows={15}
          style={{ width: '400px' }}
          value={ingredientList}
          onChange={(e) => setIngredientList(e.target.value)}
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-image'>Image </label>
        <textarea
          value={image}
          style={{ width: '400px' }}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>
      <br />
      <br />
      <input
        type='submit'
        value={createPostMutation.isPending ? 'Creating...' : 'Create'}
        disabled={!title || createPostMutation.isPending}
      />
      {createPostMutation.isSuccess ? (
        <>
          <br />
          Recipe created successfully!
        </>
      ) : null}
    </form>
  )
}
