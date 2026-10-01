import PropTypes from 'prop-types'
import { User } from './User.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { postLike, postLikeStatus } from '../api/likes.js'
import { getPostLikesCount } from '../api/likes.js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
export function Post({ _id, title, ingredientList, author: userId, image }) {

  const ingredientListStyles = {
    maxHeight: '22.5em',
    lineHeight: '1.5em',
    overflowY: 'auto'
  }
  const [token] = useAuth()
  const queryClient = useQueryClient()

  const { data: hasLike = false } = useQuery({
    queryKey: ['likeStatus', _id, token],
    queryFn: () => postLikeStatus(token, _id),
    enabled: Boolean(_id && token),
  })

  const { data: likesCount = 0 } = useQuery({
    queryKey: ['likesCount', _id],
    queryFn: () => getPostLikesCount(_id),
    enabled: Boolean(_id),
  })

  const likeMutation = useMutation({
    mutationFn: (nextHasLike) => postLike(token, _id, nextHasLike),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likeStatus', _id] })
      queryClient.invalidateQueries({ queryKey: ['likesCount', _id] })
    },
  })

  const handleLikeClick = (e) => {
    e.preventDefault()
    if (!token) return
    likeMutation.mutate(!hasLike)
  }
  return (
    <article>
      <h3>{title}</h3>
      <div style={ingredientListStyles}>{ingredientList}</div>
      <div><img src={image} style={{ width: '100%', maxWidth: '400px', height: '250px', objectFit: 'cover', borderRadius: '8px', }} /></div>
      {userId && (
        <em>
          <br />
          Written by <User id={userId} />
        </em>
      )}{' '}
      •{' '}
      {token ? (
        <button onClick={handleLikeClick} disabled={likeMutation.isPending}>
          {hasLike ? 'Unlike' : 'Like'} ({likesCount})
        </button>
      ) : (
        <span>Likes: {likesCount}</span>
      )}
    </article>
  )
}
Post.propTypes = {
  _id: PropTypes.string,
  title: PropTypes.string.isRequired,
  ingredientList: PropTypes.string,
  author: PropTypes.string,
  image: PropTypes.string,
}
