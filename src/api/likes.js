export const postLike = (token, _id, like) =>
  fetch(`${import.meta.env.VITE_BACKEND_URL}/likes/${_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ hasLike: like }),
  }).then((res) => res.json())
export const postLikeStatus = (token, _id) =>
  fetch(`${import.meta.env.VITE_BACKEND_URL}/likes/status/${_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json())
export const getPostLikesCount = (_id) =>
  fetch(`${import.meta.env.VITE_BACKEND_URL}/likes/count/${_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json())