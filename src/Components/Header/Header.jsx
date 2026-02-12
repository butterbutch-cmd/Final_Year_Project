import { Search, ShoppingBag, User2, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./Header.css";
import Button from "../Button/Button";

export default function Header() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // 🔐 Prevent double fetch in React 18 StrictMode
  const fetchedRef = useRef(false);

  const toggleProfileMenu = () => {
    if (!user) return;
    setShowProfileMenu((prev) => !prev);
  };

  const handleSignUpclick = () => navigate("/LoginPage");

  const handleSearchClick = () => alert(`Searching for: ${searchQuery}`);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleKeyPress = (e) => e.key === "Enter" && handleSearchClick();

  // ============================
  // FETCH USER USING JWT (SAFE)
  // ============================
useEffect(() => {
  if (fetchedRef.current) return;
  fetchedRef.current = true;

  const token = localStorage.getItem("token");

  if (token) {
    console.log("✅ User is logged in (token found)");
  } else {
    console.log("❌ User is NOT logged in (no token)");
  }
  const fetchUser = async () => {
  if (!token) return;

  try {
    const res = await fetch("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        console.warn("⚠️ JWT invalid or expired");
        localStorage.removeItem("token");
        setUser(null);
        console.log("❌ User logged out (invalid token)");
      }
      return;
    }

    const data = await res.json();

    if (!data) {
      console.warn("⚠️ No user data returned from backend");
      setUser(null);
      return;
    }

    setUser(data);
    console.log("✅ User authenticated:", data.username || "Unknown");
  } catch (err) {
    console.error("Error fetching user:", err);
    setUser(null); // fallback
  }
};


  fetchUser();
}, []);


  // ============================
  // NAVIGATION
  // ============================
  const goToProfile = () => {
    navigate("/profile");
    setShowProfileMenu(false);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
    setShowProfileMenu(false);
    navigate("/LoginPage");
  };

  return (
    <>
      <div className="HeaderContainer">
        <div className="HeaderContainer1">
          <h1 className="Logo">MENDHO</h1>

          {/* SEARCH BAR */}
          <div className="HeaderButtonContainer">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                className="search-input"
              />
              <button onClick={handleSearchClick} className="search-button">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* PROFILE & BUTTON SECTION */}
          <div className="HeaderProfileContainer">
            <button className="icon-btn" onClick={toggleProfileMenu}>
              <User2 size={22} />
            </button>

            <button className="icon-btn">
              <Heart size={22} />
            </button>

            <button className="icon-btn-cart">
              <ShoppingBag size={22} />
              <span className="cart-badge">0</span>
            </button>

            {user ? (
              <Button text="Discuss With Us" onClick={() => navigate("/forum")} />
            ) : (
              <Button text="Get Started" onClick={handleSignUpclick} />
            )}
          </div>
        </div>

        {/* NAV BAR */}
        <div className="HeaderContainer2">
          <nav className="Nav-Bar">
            <ul>
              <li><Link to="/">NEW ARRIVAL</Link></li>
              <li><Link to="/pots">LARGE PLANT</Link></li>
              <li><Link to="/pots">INDOOR PLANT</Link></li>
              <li><Link to="/pots">OUTDOOR PLANT</Link></li>
              <li><Link to="/pots">SALES</Link></li>
              <li><Link to="/forum">FORUM</Link></li>
              <li><Link to="/blog">BLOG</Link></li>
              <li><Link to="/contact">CONTACT</Link></li>
            </ul>
          </nav>
        </div>
      </div>

      {/* PROFILE DROPDOWN */}
      {showProfileMenu && user && (
        <div className="profile-overlay">
          <div className="profile-card">
            <div className="profile-avatar"></div>
            <h3 className="profile-name">{user.username || "User"}</h3>

            <ul className="profile-menu-list">
              <li onClick={goToProfile}>Edit Profile</li>
              <li>Order History</li>
              <li onClick={logoutUser}>Logout</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
