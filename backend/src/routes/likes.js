import { toLike, getLikeStatus, getPostLikesCount } from '../services/likes.js'
import { getPostById } from '../services/posts.js'
import { requireAuth } from '../middleware/jwt.js'
export function likeRoutes(app) {
  app.post('/api/v1/likes/:postId', requireAuth, async (req, res) => {
    try {
      const { hasLike } = req.body
      const userId = req.auth.sub
      const { postId } = req.params
      const post = await getPostById(postId)
      if (post === null) return res.status(400).end()
      const like = await toLike({ postId, userId, hasLike })
      return res.json({ like })
    } catch (err) {
      console.error('error liking action', err)
      return res.status(500).end()
    }
  })
  app.get('/api/v1/likes/status/:postId', requireAuth, async (req, res) => {
    try {
      const { postId } = req.params
      const userId = req.auth.sub
      const post = await getPostById(postId)
      if (post === null) return res.status(400).end()
      const hasLike = await getLikeStatus({ postId, userId })
      return res.json(hasLike)
    } catch (err) {
      console.error('error getting a like status', err)
      return res.status(500).end()
    }
  })
  app.get('/api/v1/likes/count/:postId', async (req, res) => {
    try {
      const { postId } = req.params
      const post = await getPostById(postId)
      if (post === null) return res.status(400).end()
      const count = await getPostLikesCount(post._id)
      return res.json(count)
    } catch (err) {
      console.error('error getting a count', err)
      return res.status(500).end()
    }
  })
}