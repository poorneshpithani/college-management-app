import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { getPublicNews } from "../api/public.js";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const data = await getPublicNews();
      setNews(data);
    } catch (error) {
      console.error("❌ Failed to load news:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
        {/* Logo + Title */}
  <div className="flex items-center space-x-3">
    <img
      src="/images/logo.jpg"  
      alt="SIET Logo"
      className="h-10 w-10 object-contain"
    />
    <h1 className="text-xl font-bold">SIET Portal</h1>
  </div>
        <div className="space-x-6 flex items-center">
          <Link to="/" className="hover:underline">
            Home
          </Link>

          {!user && (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <Link to="/admin" className="hover:underline">
              Admin Dashboard
            </Link>
          )}
          {user?.role === "teacher" && (
            <Link to="/teacher" className="hover:underline">
              Teacher Dashboard
            </Link>
          )}
          {user?.role === "student" && (
            <Link to="/student" className="hover:underline">
              Student Dashboard
            </Link>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
{/* <header
  className="flex flex-col items-center justify-center text-center py-20 min-h-[70vh] text-white bg-cover bg-center"
  style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
>
  <h2 className="text-4xl md:text-5xl font-extrabold mb-36">
    Welcome to SIET <br className="pb-4"/>
    Diploma Portal
  </h2>
  <p className="max-w-2xl text-lg text-gray-200">
    Your gateway to academic excellence. Access all your educational resources, results, and administrative services in one unified platform.
  </p>
</header> */}

<header
  className="relative flex flex-col items-center justify-center text-center min-h-[70vh] text-white bg-cover bg-center"
  style={{ backgroundImage: "url('/images/20251003_141918.png')" }}
>
  {/* 🖤 Black overlay */}
  <div className="absolute inset-0 bg-black/60"></div>

  {/* Content (z-10 keeps it above the overlay) */}
  <div className="relative z-10 px-4">
    <h2 className="text-4xl md:text-5xl font-extrabold mb-8">
      Welcome to SIET <br />
      Diploma Portal
    </h2>
    <p className="max-w-2xl text-lg text-gray-200 mx-auto">
      Your gateway to academic excellence. Access all your educational resources,
      results, and administrative services in one unified platform.
    </p>
  </div>
</header>



      {/* News Section */}
      <section className="flex-grow p-6 max-w-4xl mx-auto w-full">
        <div className="text-center">
 <h3 className="text-2xl font-semibold mb-4 text-gray-800">
         Latest Notices & Announcements
        </h3>
        <p className="text-center max-w-2xl text-lg text-gray-500 pb-4">
    Stay updated with important information and announcements
  </p>
        </div>
       
        {news.length === 0 ? (
          <p className="text-gray-500">No news yet.</p>
        ) : (
          <ul className="space-y-4">
            {news.map((n) => (
              <li key={n._id} className="bg-white shadow p-4 rounded-lg">
                <h4 className="font-bold text-gray-900">{n.title}</h4>
                <p className="text-gray-700">{n.message}</p>
                <span className="text-sm text-gray-500">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-200 text-center p-4 text-gray-600">
        © {new Date().getFullYear()} Srinivasa Institute of Engineering and Technology - Diploma. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
