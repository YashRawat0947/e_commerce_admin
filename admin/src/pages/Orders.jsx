import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

// ✅ single axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
});

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await api.post("/api/order/list", {}, {
        headers: { token }
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {

    try {
      const response = await api.post("/api/order/status", {
        orderId,
        status: event.target.value
      }, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success("Order status updated");
        fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3>Order Page</h3>

      <div>
        {orders.map((order, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-300 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
          >

            <img className="w-12" src={assets.parcel_icon} alt="" />

            <div>
              {order.items.map((item, idx) => (
                <p key={idx}>
                  {item.name} x {item.quantity} {item.size}
                </p>
              ))}

              <p className="mt-3 font-medium">
                {order.address.firstName} {order.address.lastName}
              </p>

              <p>{order.address.street}</p>
              <p>
                {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
              </p>

              <p>{order.address.phone}</p>
            </div>

            <div>
              <p>Items: {order.items.length}</p>
              <p>Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>

            <p>${order.amount}</p>

            <select
              value={order.status}
              onChange={(e) => statusHandler(e, order._id)}
              className="p-2 font-semibold"
            >
              <option>Order Placed</option>
              <option>Packing</option>
              <option>Shipped</option>
              <option>Out for delivery</option>
              <option>Delivered</option>
            </select>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;