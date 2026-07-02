import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="text-center max-w-lg"
      >
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-8xl mb-6"
        >
          🎉
        </motion.div>
        <h1 className="font-display text-4xl font-bold text-chocolate mb-3">Order Placed!</h1>
        {order && (
          <div className="bg-blush/40 rounded-2xl px-6 py-3 inline-block mb-4">
            <p className="text-sm text-chocolate/60">Order ID</p>
            <p className="font-bold text-rose text-xl">{order.orderId}</p>
          </div>
        )}
        <p className="text-chocolate/65 leading-relaxed mb-8">
          Thank you for your order! Our bakers are excited to start crafting your cake. You will receive
          updates as your order progresses.
        </p>

        {order?.deliveryDate && (
          <p className="text-sm text-chocolate/60 mb-6">
            Expected delivery:{" "}
            <strong className="text-chocolate">{new Date(order.deliveryDate).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</strong>
            {" "}during{" "}
            <strong className="text-chocolate">{order.preferredTimeSlot}</strong>
          </p>
        )}

        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/orders" className="btn-primary">Track Order</Link>
          <Link to="/cakes" className="btn-secondary">Order More</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
