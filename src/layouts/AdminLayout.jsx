import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FaTachometerAlt,
  FaShoppingBag,
  FaUsers,
  FaBirthdayCake,
  FaTags,
  FaTicketAlt,
  FaStar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/admin/orders", label: "Orders", icon: <FaShoppingBag /> },
  { to: "/admin/products", label: "Products", icon: <FaBirthdayCake /> },
  { to: "/admin/categories", label: "Categories", icon: <FaTags /> },
  { to: "/admin/users", label: "Users", icon: <FaUsers /> },
  { to: "/admin/coupons", label: "Coupons", icon: <FaTicketAlt /> },
  { to: "/admin/reviews", label: "Reviews", icon: <FaStar /> },
  { to: "/admin/settings", label: "Settings", icon: <FaCog /> },
];

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-cream">
      <aside className="w-64 bg-chocolate text-cream hidden md:flex flex-col">
        <div className="p-6 font-display text-xl font-bold text-blush border-b border-cream/10">
          Sweet Crumbs Admin
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? "bg-rose text-white" : "hover:bg-cream/10"
                }`
              }
            >
              {l.icon} {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-cream/10">
          <p className="text-sm text-cream/70 mb-2">Logged in as {user?.firstName}</p>
          <button
            onClick={() => {
              logout();
              navigate("/admin/login");
            }}
            className="flex items-center gap-2 text-sm text-rose hover:text-blush"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
