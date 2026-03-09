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

  const fetchedRef = useRef(false);

  const toggleProfileMenu = () => {
    console.log("🔹 Toggling profile menu (current state):", showProfileMenu);
    if (!user) {
      console.log("❌ Cannot open profile menu: no user logged in");
      return;
    }
    setShowProfileMenu((prev) => !prev);
  };

  const handleSignUpclick = () => {
    console.log("🔹 Navigating to LoginPage");
    navigate("/LoginPage");
  };

  const handleSearchClick = () => {
    console.log("🔹 Search clicked. Query:", searchQuery);
  };

  const handleSearchChange = (e) => {
    console.log("🔹 Search input changed:", e.target.value);
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      console.log("🔹 Enter pressed in search input");
      handleSearchClick();
    }
  };

  // ============================
  // FETCH USER USING JWT
  // ============================
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const token = localStorage.getItem("token");
    console.log("🔹 Token from localStorage:", token);

    const fetchUser = async () => {
      if (!token) {
        console.log("❌ No token, skipping fetchUser");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("🔹 Fetch response status:", res.status);

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
        console.log("🔹 Fetched user data:", data);

        if (!data) {
          console.warn("⚠️ No user data returned from backend");
          setUser(null);
          return;
        }

        setUser(data);
        console.log("✅ User authenticated:", data.username || "Unknown");
        console.log("✅ Logged in user ID:", data._id);
      } catch (err) {
        console.error("❌ Error fetching user:", err);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // ============================
  // NAVIGATION
  // ============================
  const goToProfile = () => {
    console.log("🔹 Navigating to profile page");
    navigate("/profile");
    setShowProfileMenu(false);
  };
  
  const goToOrderHistory = () => {
    console.log("🔹 Navigating to order history page");
    navigate("/orders");
    setShowProfileMenu(false);
  }

  const logoutUser = () => {
    console.log("🔹 Logging out user");
    localStorage.removeItem("token");
    setUser(null);
    setShowProfileMenu(false);
    navigate("/LoginPage");
  };

  // ============================
  // Render (UI still here but mostly for reference)
  // ============================
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

            <button className="icon-btn" onClick={() => navigate("/wishlist")}>
              <Heart size={22} /> 
            </button>

            <button className="icon-btn-cart" onClick={()=> navigate("/checkout")}>
              <ShoppingBag size={22} />
              <span className="cart-badge">0</span>
            </button>

            {user ? (
              <Button text="Discuss With Us" onClick={() => { console.log("🔹 Navigating to forum"); navigate("/forum"); }} />
            ) : (
              <Button text="Get Started" onClick={handleSignUpclick} />
            )}
          </div>
        </div>

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

      {showProfileMenu && user && (
        <div className="profile-overlay">
          <div className="profile-card">
            <div className="profile-avatar"></div>
            <h3 className="profile-name">{user.username || "User"}</h3>

            <ul className="profile-menu-list">
              <li onClick={goToProfile}>Edit Profile</li>
              <li onClick={goToOrderHistory}>Order History</li>
              <li onClick={logoutUser}>Logout</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
