// import { Search, ShoppingBag, User2, Heart } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { useState, useEffect, useRef } from "react";
// import "./Header.css";
// import Button from "../Button/Button";

// export default function Header() {
//   const navigate = useNavigate();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [user, setUser] = useState(null);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);

//   const fetchedRef = useRef(false);

//   const toggleProfileMenu = () => {
//     console.log("🔹 Toggling profile menu (current state):", showProfileMenu);
//     if (!user) {
//       console.log("❌ Cannot open profile menu: no user logged in");
//       return;
//     }
//     setShowProfileMenu((prev) => !prev);
//   };

//   const handleSignUpclick = () => {
//     console.log("🔹 Navigating to LoginPage");
//     navigate("/LoginPage");
//   };

//   const handleSearchClick = () => {
//     console.log("🔹 Search clicked. Query:", searchQuery);
//   };

//   const handleSearchChange = (e) => {
//     console.log("🔹 Search input changed:", e.target.value);
//     setSearchQuery(e.target.value);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       console.log("🔹 Enter pressed in search input");
//       handleSearchClick();
//     }
//   };

//   // ============================
//   // FETCH USER USING JWT
//   // ============================
//   useEffect(() => {
//     if (fetchedRef.current) return;
//     fetchedRef.current = true;

//     const token = localStorage.getItem("token");
//     console.log("🔹 Token from localStorage:", token);

//     const fetchUser = async () => {
//       if (!token) {
//         console.log("❌ No token, skipping fetchUser");
//         return;
//       }

//       try {
//         const res = await fetch("http://localhost:5000/api/auth/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         console.log("🔹 Fetch response status:", res.status);

//         if (!res.ok) {
//           if (res.status === 401 || res.status === 403) {
//             console.warn("⚠️ JWT invalid or expired");
//             localStorage.removeItem("token");
//             setUser(null);
//             console.log("❌ User logged out (invalid token)");
//           }
//           return;
//         }

//         const data = await res.json();
//         console.log("🔹 Fetched user data:", data);

//         if (!data) {
//           console.warn("⚠️ No user data returned from backend");
//           setUser(null);
//           return;
//         }

//         setUser(data);
//         console.log("✅ User authenticated:", data.username || "Unknown");
//         console.log("✅ Logged in user ID:", data._id);
//       } catch (err) {
//         console.error("❌ Error fetching user:", err);
//         setUser(null);
//       }
//     };

//     fetchUser();
//   }, []);

//   // ============================
//   // NAVIGATION
//   // ============================
//   const goToProfile = () => {
//     console.log("🔹 Navigating to profile page");
//     navigate("/profile");
//     setShowProfileMenu(false);
//   };
  
//   const goToOrderHistory = () => {
//     console.log("🔹 Navigating to order history page");
//     navigate("/orders");
//     setShowProfileMenu(false);
//   }

//   const logoutUser = () => {
//     console.log("🔹 Logging out user");
//     localStorage.removeItem("token");
//     setUser(null);
//     setShowProfileMenu(false);
//     navigate("/LoginPage");
//   };

//   // ============================
//   // Render (UI still here but mostly for reference)
//   // ============================
//   return (
//     <>
//       <div className="HeaderContainer">
//         <div className="HeaderContainer1">
//           <h1 className="Logo">MENDHO</h1>

//           {/* SEARCH BAR */}
//           <div className="HeaderButtonContainer">
//             <div className="search-container">
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 onKeyPress={handleKeyPress}
//                 className="search-input"
//               />
//               <button onClick={handleSearchClick} className="search-button">
//                 <Search size={20} />
//               </button>
//             </div>
//           </div>

//           {/* PROFILE & BUTTON SECTION */}
//           <div className="HeaderProfileContainer">
//             <button className="icon-btn" onClick={toggleProfileMenu}>
//               <User2 size={22} />
//             </button>

//             <button className="icon-btn" onClick={() => navigate("/wishlist")}>
//               <Heart size={22} /> 
//             </button>

//             <button className="icon-btn-cart" onClick={()=> navigate("/checkout")}>
//               <ShoppingBag size={22} />
//               <span className="cart-badge">0</span>
//             </button>

//             {user ? (
//               <Button text="Discuss With Us" onClick={() => { console.log("🔹 Navigating to forum"); navigate("/forum"); }} />
//             ) : (
//               <Button text="Get Started" onClick={handleSignUpclick} />
//             )}
//           </div>
//         </div>

//         <div className="HeaderContainer2">
//           <nav className="Nav-Bar">
//             <ul>
//               <li><Link to="/">NEW ARRIVAL</Link></li>
//               <li><Link to="/pots">LARGE PLANT</Link></li>
//               <li><Link to="/pots">INDOOR PLANT</Link></li>
//               <li><Link to="/pots">OUTDOOR PLANT</Link></li>
//               <li><Link to="/pots">SALES</Link></li>
//               <li><Link to="/forum">FORUM</Link></li>
//               <li><Link to="/blog">BLOG</Link></li>
//               <li><Link to="/contact">CONTACT</Link></li>
//             </ul>
//           </nav>
//         </div>
//       </div>

//       {showProfileMenu && user && (
//         <div className="profile-overlay">
//           <div className="profile-card">
//             <div className="profile-avatar"></div>
//             <h3 className="profile-name">{user.username || "User"}</h3>

//             <ul className="profile-menu-list">
//               <li onClick={goToProfile}>Edit Profile</li>
//               <li onClick={goToOrderHistory}>Order History</li>
//               <li onClick={logoutUser}>Logout</li>
//             </ul>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

import { Search, ShoppingBag, User2, Heart, X, Menu, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

// Add to your index.html <head>:
// <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'DM Sans', sans-serif" };

const NAV_LINKS = [
  { label: "New Arrival", to: "/" },
  { label: "Large Plants", to: "/pots" },
  { label: "Indoor",       to: "/pots" },
  { label: "Outdoor",      to: "/pots" },
  { label: "Sale",         to: "/pots", sale: true },
  { label: "Blog",         to: "/blog" },
  { label: "Contact",      to: "/contact" },
];

const ActionBtn = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center w-[38px] h-[38px] rounded-full bg-transparent border-none cursor-pointer text-[#2c2c2c] hover:bg-[#2d4a2d]/10 hover:text-[#2d4a2d] transition-all duration-200 hover:scale-105"
  >
    {children}
  </button>
);

export default function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery]     = useState("");
  const [user, setUser]                   = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchOpen, setSearchOpen]       = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fetchedRef = useRef(false);
  const searchRef  = useRef(null);
  const [cartCount, setCartCount] =useState(0);
  const [notificationCount, setNotificationCount]= useState(1);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(()=>{
    const fetchCart = async ()=>{
      const token = localStorage.getItem("token");
      if(!token) return;

      try{
        const res = await fetch("http://localhost:5000/api/user/cart",{
          headers:{ Authorization: `Bearer ${token}`},
        });
        const data= await res.json();
        if(res.ok){
          setCartCount(data.cart.length);///array legth 
        }
      }catch (err){
        console.error("Cart fetch error", err);
      }
    };

    fetchCart();
    ///liisten for car update
    window.addEventListener("cartUpdate",fetchCart);
    return()=> window.removeEventListener("cartUpdated", fetchCart);
  },[]);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    const token = localStorage.getItem("token");
    if (!token) return;
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) { localStorage.removeItem("token"); return; }
        setUser(await res.json());
      } catch { setUser(null); }
    })();
  }, []);

  const handleSearch = () => {
    if (!searchOpen) { setSearchOpen(true); return; }
    navigate(`/search?q=${searchQuery}`);
  };

  const goToProfile      = () => { navigate("/profile");  setShowProfileMenu(false); };
  const goToOrderHistory = () => { navigate("/orders");   setShowProfileMenu(false); };
  const logoutUser       = () => {
    localStorage.removeItem("token");
    setUser(null);
    setShowProfileMenu(false);
    navigate("/LoginPage");
  };

  return (
    <>
      {/* ── Announcement bar ── */}
      <div className="bg-[#1a3320] text-center py-2 px-4">
        <p className="text-[#f7f4ee]/75 text-[11px] tracking-widest m-0" style={sans}>
          Free shipping on orders over Rs. 2,500 &nbsp;·&nbsp; New arrivals every week
        </p>
      </div>

      {/* ── Main header ── */}
      <header
        className={`sticky top-0 z-50 bg-[#fdfcf8] border-b border-[#2d4a2d]/10 transition-shadow duration-300 ${
          scrolled ? "shadow-[0_4px_24px_rgba(26,51,32,0.08)]" : ""
        }`}
      >
        <div className="flex items-center justify-between px-12 h-[68px] gap-6 max-lg:px-6 max-md:px-4">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => navigate("/")}>
            <span className="text-[#7a9e7e] text-xs animate-spin" style={{ animationDuration: "9s" }}>✦</span>
            <h1 className="text-2xl font-semibold tracking-[0.18em] text-[#1a3320] m-0 leading-none" style={serif}>
              MENDHO
            </h1>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-7 list-none m-0 p-0">
              {NAV_LINKS.map(({ label, to, sale }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className={`relative text-[12px] tracking-[0.1em] uppercase no-underline pb-0.5
                      after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:transition-all after:duration-300
                      hover:after:w-full
                      ${sale
                        ? "text-[#c4704a] after:bg-[#c4704a] hover:text-[#c4704a]"
                        : "text-[#2c2c2c] after:bg-[#2d4a2d] hover:text-[#2d4a2d]"
                      }`}
                    style={{ ...sans, fontWeight: 400 }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">

            {/* Expanding search */}
            <div className={`flex items-center overflow-hidden border-b transition-all duration-300 ${
              searchOpen ? "w-[180px] border-[#2d4a2d]" : "w-[38px] border-transparent"
            }`}>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search plants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                onBlur={() => !searchQuery && setSearchOpen(false)}
                className={`bg-transparent border-none outline-none text-[13px] text-[#2c2c2c] placeholder-[#8c8880] transition-all duration-300 ${
                  searchOpen ? "flex-1 px-2" : "w-0 p-0"
                }`}
                style={sans}
              />
              <ActionBtn onClick={handleSearch}><Search size={17} /></ActionBtn>
            </div>

            <ActionBtn onClick={() => user && setShowProfileMenu((p) => !p)}>
              <User2 size={17} />
            </ActionBtn>

            <ActionBtn onClick={() => navigate("/wishlist")}>
              <Heart size={17} />
            </ActionBtn>

            <ActionBtn onClick={()=>navigate("/notification")}>
              <Bell size={17}/>
              <div className="relative">

              {notificationCount>0 && (
                <span
                  className="absolute -top-3.5 -right-1.5 bg-[#c4704a] text-white text-[9px] w-[14px] h-[14px] rounded-full flex items-center justify-center"
                >
                  {notificationCount}
                </span>
              )}
              </div>
            </ActionBtn>

            {/* Cart */}
            <button
              onClick={() => navigate("/checkout")}
              className="relative flex items-center justify-center w-[38px] h-[38px] rounded-full bg-transparent border-none cursor-pointer text-[#2c2c2c] hover:bg-[#2d4a2d]/10 hover:text-[#2d4a2d] transition-all duration-200"
            >
              <ShoppingBag size={17} />
              <span className="absolute top-[5px] right-[5px] bg-[#c4704a] text-white text-[9px] w-[14px] h-[14px] rounded-full flex items-center justify-center" style={sans}>
                {cartCount}
              </span>
            </button>

            {/* CTA */}
            <button
              onClick={() => navigate(user ? "/forum" : "/LoginPage")}
              className="hidden sm:block ml-2 px-5 py-[9px] bg-[#1a3320] text-[#f7f4ee] border-none text-[11px] font-medium tracking-[0.12em] uppercase cursor-pointer rounded-sm hover:bg-[#2d4a2d] hover:-translate-y-px transition-all duration-200 whitespace-nowrap"
              style={sans}
            >
              {user ? "Forum" : "Get Started"}
            </button>

            {/* Mobile hamburger */}
            <ActionBtn onClick={() => setMobileMenuOpen(true)}>
              <Menu size={20} className="lg:hidden" />
            </ActionBtn>
          </div>
        </div>
      </header>

      {/* ── Profile dropdown ── */}
      {showProfileMenu && user && (
        <div
          className="fixed inset-0 z-[200] bg-[#1a3320]/15 backdrop-blur-sm flex justify-end items-start"
          style={{ paddingTop: "78px", paddingRight: "48px" }}
          onClick={() => setShowProfileMenu(false)}
        >
          <div
            className="bg-[#fdfcf8] border border-[#2d4a2d]/10 rounded-lg shadow-[0_8px_40px_rgba(26,51,32,0.14)] min-w-[220px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-[#f7f4ee] border-b border-[#2d4a2d]/10">
              <div
                className="w-10 h-10 rounded-full bg-[#2d4a2d] text-[#f7f4ee] flex items-center justify-center text-xl font-semibold flex-shrink-0"
                style={serif}
              >
                {(user.username || "U")[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-[#1a3320] m-0" style={sans}>{user.username || "User"}</p>
                <p className="text-[11px] text-[#8c8880] mt-0.5 mb-0" style={sans}>{user.email || ""}</p>
              </div>
            </div>
            {/* Menu items */}
            <ul className="list-none p-2 m-0">
              {[
                { label: "Edit Profile",   fn: goToProfile },
                { label: "Order History",  fn: goToOrderHistory },
              ].map(({ label, fn }) => (
                <li
                  key={label}
                  onClick={fn}
                  className="px-5 py-3 text-[13px] text-[#2c2c2c] cursor-pointer tracking-[0.03em] hover:bg-[#f7f4ee] hover:text-[#2d4a2d] transition-colors duration-150 rounded"
                  style={sans}
                >
                  {label}
                </li>
              ))}
              <li
                onClick={logoutUser}
                className="px-5 py-3 text-[13px] text-[#c4704a] cursor-pointer tracking-[0.03em] border-t border-[#2d4a2d]/10 mt-1 hover:bg-[#f7f4ee] transition-colors duration-150 rounded"
                style={sans}
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ── Mobile menu ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[300] bg-[#1a3320]/40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute top-0 right-0 w-[280px] h-full bg-[#fdfcf8] px-7 py-8 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="self-end bg-transparent border-none cursor-pointer text-[#2c2c2c] mb-6"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={22} />
            </button>
            <h2 className="text-[28px] font-semibold tracking-[0.18em] text-[#1a3320] mb-8" style={serif}>
              MENDHO
            </h2>
            <ul className="list-none p-0 m-0">
              {NAV_LINKS.map(({ label, to, sale }) => (
                <li key={label} className="py-3.5 border-b border-[#2d4a2d]/10" onClick={() => setMobileMenuOpen(false)}>
                  <Link
                    to={to}
                    className={`text-[14px] tracking-[0.1em] uppercase no-underline font-light ${
                      sale ? "text-[#c4704a]" : "text-[#2c2c2c]"
                    }`}
                    style={sans}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}