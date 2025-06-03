import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import Home from './dashboard/Home.jsx'
import Login from './auth/Login.jsx'
import Feedback from './dashboard/Feedback.jsx'
import Feedbacks from './Feedbacks.jsx'
import Add from './dashboard/Add.jsx'


import { createBrowserRouter, RouterProvider } from 'react-router'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/feedback',
        element: <Feedback />
      },
      {
        path: '/add',
        element: <Add />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/feedbacks/:id',
    element: <Feedbacks />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
