import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-chocolate text-cream mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-display text-2xl font-bold text-blush mb-3">Sweet Crumbs 🍰</h3>
          <p className="text-cream/70 text-sm">
            Handmade with love. Premium homemade cakes baked fresh and delivered to your door.
          </p>
          <div className="flex gap-4 mt-4 text-lg">
            <FaInstagram className="hover:text-rose cursor-pointer" />
            <FaFacebook className="hover:text-rose cursor-pointer" />
            <FaTwitter className="hover:text-rose cursor-pointer" />
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-blush">Quick Links</h4>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link to="/" className="hover:text-rose">Home</Link></li>
            <li><Link to="/cakes" className="hover:text-rose">Browse Cakes</Link></li>
            <li><Link to="/cart" className="hover:text-rose">Cart</Link></li>
            <li><Link to="/orders" className="hover:text-rose">My Orders</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-blush">Support</h4>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link to="/support" className="hover:text-rose">Contact Us</Link></li>
            <li><Link to="/support" className="hover:text-rose">FAQs</Link></li>
            <li><Link to="/support" className="hover:text-rose">Shipping Info</Link></li>
            <li><Link to="/support" className="hover:text-rose">Returns</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-blush">Newsletter</h4>
          <p className="text-sm text-cream/70 mb-3">Get sweet offers straight to your inbox.</p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex"
          >
            <input
              type="email"
              placeholder="Your email"
              className="px-3 py-2 rounded-l-full text-chocolate text-sm w-full outline-none"
            />
            <button className="bg-rose px-4 rounded-r-full text-sm font-medium">Join</button>
          </form>
        </div>
      </div>
      <div className="text-center text-xs text-cream/50 py-4 border-t border-cream/10">
        © {new Date().getFullYear()} Sweet Crumbs Bakery. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
