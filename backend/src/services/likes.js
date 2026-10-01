import { Like } from '../db/models/like.js'

export async function toLike({ postId, userId, hasLike }) {
  const likeValue = hasLike !== undefined ? Boolean(hasLike) : true
  return await Like.findOneAndUpdate(
    { post: postId, user: userId },
    { hasLike, likeValue },
    { new: true, upsert: true },
  )
}
export async function getLikeStatus({ postId, userId }) {
  if (!userId) return false
  const like = await Like.findOne({ post: postId, user: userId })
  return like ? like.hasLike : false
}
export async function getPostLikesCount(postId) {
  return await Like.countDocuments({ post: postId, hasLike: true })
}