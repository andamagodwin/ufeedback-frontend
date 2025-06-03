import useAuthStore from "../store/authstore";

const Home = () => {
   const {user, logout} = useAuthStore();


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome  {user.email || 'User'} </h1>
      <p className="text-lg text-gray-700">This is your home page.</p>
    </div>
  );
}

export default Home;