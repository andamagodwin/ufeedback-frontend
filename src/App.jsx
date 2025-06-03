import Nav from './components/Nav';
import Sidebar from './components/Sidebar';
import { Outlet } from 'react-router'; // make sure you're using 'react-router-dom'
import useAuthStore from './store/authstore';

function App() {
  const { user, logout } = useAuthStore();


  // Check if user is logged in, if not redirect to login

  if (!user) {
    window.location.href = '/login'; // Redirect to login page
    return null; // Prevent rendering the rest of the app
  }
  return (
    <div className="flex h-screen flex-col">
      {/* Top Navigation Bar */}
      <Nav />

      {/* Main Body: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
