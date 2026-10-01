import { Post } from "../db/models/post.js";
import { User } from "../db/models/user.js";

export async function createPost(userId, { title, ingredientList, image }) {
    const post = new Post({ title, author: userId, ingredientList, image });
    return await post.save();
}

async function listPosts(
    query = {},
    { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
    const sortDirection =
        sortOrder === 'ascending' || sortOrder === 1 || sortOrder === 'asc' ? 1 : -1

    if (sortBy === 'likesCount' || sortBy === 'likes') {
        return await Post.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'post',
                    as: 'likesData',
                },
            },
            {
                $addFields: {
                    likesCount: {
                        $size: {
                            $filter: {
                                input: '$likesData',
                                as: 'like',
                                cond: { $eq: ['$$like.hasLike', true] },
                            },
                        },
                    },
                },
            },

            { $sort: { likesCount: sortDirection, createdAt: -1 } },
            { $project: { likesData: 0 } },
        ])
    }

    return await Post.find(query).sort({ [sortBy]: sortDirection })
}
export async function listAllPosts(options) {
    return await listPosts({}, options);
}
export async function listPostsByAuthor(authorUsername, options) {
    const user = await User.findOne({ username: authorUsername });
    if (!user) return [];
    return await listPosts({ author: user._id }, options);
}
export async function listPostsByTag(tags, options) {
    return await listPosts({ tags }, options);
}

export async function getPostById(postId) {
    return await Post.findById(postId);
}
export async function updatePost(userId, postId, { title, ingredientList, image }) {
    return await Post.findOneAndUpdate(
        { _id: postId, author: userId },
        { $set: { title, ingredientList, image } },
        { new: true },
    );
}
export async function deletePost(userId, postId) {
    return await Post.deleteOne({ _id: postId, author: userId });
}