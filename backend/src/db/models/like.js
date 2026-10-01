import mongoose, { Schema } from 'mongoose'
const likeSchema = new Schema(
    {
        post: { type: Schema.Types.ObjectId, ref: 'post', required: true},
        user: { type: Schema.Types.ObjectId, ref: 'user', required: true},
        hasLike: { type: Boolean, required: true},
    },
    { timestamps: true },
)
export const Like = mongoose.model('like', likeSchema )