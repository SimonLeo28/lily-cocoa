import React from "react";
import toast from "react-hot-toast";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const faqs = [
  { q: "How do I track my order?", a: "Visit 'My Orders' to see real-time status updates for every order." },
  { q: "Can I cancel an order?", a: "Orders can be cancelled before they're marked 'Accepted'. Contact support for help." },
  { q: "What if I'm not home for delivery?", a: "Our delivery partner will attempt redelivery; contact support to reschedule." },
];

const Support = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Your message has been sent! We'll get back to you soon.");
    e.target.reset();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Support</h1>

      <div className="grid md:grid-cols-2 gap-10 mb-12">
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <div className="space-y-3 text-sm text-chocolate/70">
            <p className="flex items-center gap-3"><FaPhoneAlt className="text-rose" /> +91 98765 43210</p>
            <p className="flex items-center gap-3"><FaEnvelope className="text-rose" /> support@sweetcrumbs.com</p>
            <p className="flex items-center gap-3"><FaMapMarkerAlt className="text-rose" /> 123 Bakery Lane, Bengaluru, India</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <h2 className="text-xl font-bold mb-2">Send a Message</h2>
          <input required placeholder="Your Name" className="w-full px-4 py-3 rounded-xl border border-blush focus:outline-none" />
          <input required type="email" placeholder="Your Email" className="w-full px-4 py-3 rounded-xl border border-blush focus:outline-none" />
          <textarea required placeholder="Your Message" rows={3} className="w-full px-4 py-3 rounded-xl border border-blush focus:outline-none" />
          <button className="btn-primary w-full">Send Message</button>
        </form>
      </div>

      <h2 className="text-2xl font-bold mb-6">FAQs</h2>
      <div className="space-y-3">
        {faqs.map((f) => (
          <div key={f.q} className="card p-4">
            <p className="font-medium">{f.q}</p>
            <p className="text-sm text-chocolate/60 mt-1">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Support;
