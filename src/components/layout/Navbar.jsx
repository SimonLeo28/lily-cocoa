import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaHeart } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";

const navLinkClass = ({ isActive }) =>
  `font-medium transition-colors hover:text-rose ${isActive ? "text-rose" : "text-chocolate"}`;

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 glass shadow-soft">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl font-bold text-rose">
          Sweet Crumbs 🍰
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/cakes" className={navLinkClass}>
            Browse Cakes
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/orders" className={navLinkClass}>
              My Orders
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin/dashboard" className={navLinkClass}>
              Admin Panel
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <Link to="/wishlist" className="relative text-chocolate hover:text-rose transition-colors">
              <FaHeart size={20} />
            </Link>
          )}
          <Link to="/cart" className="relative text-chocolate hover:text-rose transition-colors">
            <FaShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 text-chocolate hover:text-rose">
                <FaUser />
                <span className="font-medium">{user?.firstName}</span>
              </Link>
              <button onClick={logout} className="btn-secondary !px-4 !py-2 text-sm">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block btn-primary !px-5 !py-2 text-sm">
              Login
            </Link>
          )}

          <button className="md:hidden text-chocolate" onClick={() => setOpen(!open)}>
            {open ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-6 bg-white/95">
          <NavLink to="/" onClick={() => setOpen(false)} className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/cakes" onClick={() => setOpen(false)} className={navLinkClass}>
            Browse Cakes
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/orders" onClick={() => setOpen(false)} className={navLinkClass}>
              My Orders
            </NavLink>
          )}
          {isAuthenticated && (
            <NavLink to="/profile" onClick={() => setOpen(false)} className={navLinkClass}>
              Profile
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin/dashboard" onClick={() => setOpen(false)} className={navLinkClass}>
              Admin Panel
            </NavLink>
          )}
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                setOpen(false);
                navigate("/");
              }}
              className="btn-secondary"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="btn-primary text-center">
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
