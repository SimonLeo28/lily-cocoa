import React from "react";

const FAQS = [
  { q: "How do I place an order?", a: "Browse our cake catalog, select your cake, choose weight and flavour, then add to cart and checkout." },
  { q: "What payment methods do you accept?", a: "We currently accept Cash on Delivery (COD) only." },
  { q: "Can I cancel my order?", a: "Orders can be cancelled within 30 minutes of placement by contacting our support team." },
  { q: "How do I track my order?", a: "Go to My Orders from your dashboard to see real-time status updates." },
  { q: "Do you deliver on weekends?", a: "Yes! We deliver 7 days a week including public holidays." },
];

const SupportPage = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
    <h1 className="font-display text-4xl font-bold text-chocolate mb-3">Support & FAQs</h1>
    <p className="text-chocolate/60 mb-8">Need help? We're here for you 24/7.</p>

    <div className="card p-6 mb-8">
      <h2 className="font-semibold text-chocolate text-lg mb-4">Contact Us</h2>
      <div className="space-y-3 text-sm text-chocolate/70">
        <p>📧 <strong>Email:</strong> support@sweetcrumbs.com</p>
        <p>📞 <strong>Phone:</strong> +91 98765 43210</p>
        <p>⏰ <strong>Hours:</strong> 9 AM – 9 PM, All days</p>
        <p>📍 <strong>Location:</strong> Bengaluru, Karnataka, India</p>
      </div>
    </div>

    <h2 className="font-semibold text-chocolate text-xl mb-4">Frequently Asked Questions</h2>
    <div className="space-y-4">
      {FAQS.map((f, i) => (
        <div key={i} className="card p-5">
          <h3 className="font-semibold text-chocolate mb-2">{f.q}</h3>
          <p className="text-chocolate/65 text-sm">{f.a}</p>
        </div>
      ))}
    </div>
  </div>
);

export default SupportPage;
