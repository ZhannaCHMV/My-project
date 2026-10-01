import jwt from 'jsonwebtoken'
import { getUserInfoById } from './services/users.js'
export function handleSocket(io) {
    io.use((socket, next) => {
        if (!socket.handshake.auth?.token) {
            return next(new Error('Authentication failed: no token provided'))
        }
        jwt.verify(
            socket.handshake.auth.token,
            process.env.JWT_SECRET,
            async (err, decodedToken) => {
                if (err) {
                    return next(new Error('Authentication failed: invalid token'))
                }
                socket.auth = decodedToken
                socket.user = await getUserInfoById(socket.auth.sub)
                return next()
            },
        )
    })
}
export function notifyAboutNewRecipe(io, recipe, senderSocketId = null) {
    if (!io) return
    const payload = {
        
        id: recipe._id,
        title: recipe.title,
    }
    if (senderSocketId) {
        io.except(senderSocketId).emit('recipe:added', payload)
    } else {
        io.emit('recipe:added', payload)
    }
}