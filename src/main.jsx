import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/poppins/600.css"; // For weight 600
import "@fontsource/poppins/700.css"; // Optional

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import Home from './dashboard/Home.jsx'
import Login from './auth/Login.jsx'
import Feedback from './dashboard/Feedback.jsx'
import Analytics from './dashboard/Analytics.jsx'
import Reports from "./dashboard/Reports.jsx";
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
      },
      {
        path: '/analytics',
        element: <Analytics />
      },
      {
        path: '/reports',
        element: <Reports />
      },
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
