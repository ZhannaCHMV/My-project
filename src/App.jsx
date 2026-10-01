import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Blog } from './pages/Blog.jsx'
import { Signup } from './pages/Signup.jsx'
import { Login } from './pages/Login.jsx'
import { Post } from './pages/Post.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SocketIOContextProvider } from './contexts/SocketIOContext.jsx'
const queryClient = new QueryClient()
const router = createBrowserRouter([
  {
    path: '/',
    element: <Blog />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/posts/:id',
    element: <Post />,
  },
])

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <SocketIOContextProvider>
          <RouterProvider router={router} />
        </SocketIOContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  )
}
