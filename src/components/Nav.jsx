import useAuthStore from "../store/authstore";

const Nav = () => {
  const { user, logout } = useAuthStore();
  return (
    <nav className="bg-red-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">MyApp</div>
        
        <div>
          {user.role}
        </div>
        <ul className="flex space-x-4">
          <li><a href="/" className="text-white hover:text-gray-400">Home</a></li>
          <li><a href="/about" className="text-white hover:text-gray-400">About</a></li>
          <li><a href="/contact" className="text-white hover:text-gray-400">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;