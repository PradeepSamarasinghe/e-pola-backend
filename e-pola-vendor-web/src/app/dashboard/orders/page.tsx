"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface OrderItem {
  productId: { _id: string; name: string; image_url: string };
  quantity: number;
  priceAtPurchase: number;
}

interface Order {
  _id: string;
  userId: { _id: string; name: string; phoneNumber: string };
  items: OrderItem[];
  totalValue: number;
  fulfillmentStatus: string;
  createdAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("vendorToken");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchOrders(token);
  }, []);

  const fetchOrders = async (token: string) => {
    try {
      const res = await fetch("/api/v1/orders/vendor", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    const token = localStorage.getItem("vendorToken");
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/v1/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, fulfillmentStatus: newStatus } : o));
      } else {
        alert("Failed to update order status");
      }
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-indigo-100 text-indigo-800';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Live Orders</h2>
        </div>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <p className="text-gray-500">You don't have any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
                <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-500 font-mono">#{order._id.slice(-8)}</span>
                    <h3 className="text-lg font-medium text-gray-900">{order.userId?.name || 'Customer'}</h3>
                    <p className="text-sm text-gray-500">{order.userId?.phoneNumber || 'No phone'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">LKR {order.totalValue}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize mt-1 ${getStatusColor(order.fulfillmentStatus)}`}>
                      {order.fulfillmentStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="px-6 py-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Order Items</h4>
                  <ul className="divide-y divide-gray-100">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="py-2 flex justify-between text-sm">
                        <span className="text-gray-900">{item.quantity}x {item.productId?.name || 'Unknown Item'}</span>
                        <span className="text-gray-500">LKR {item.priceAtPurchase * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 border-t border-gray-100">
                  {order.fulfillmentStatus === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(order._id, 'cancelled')}
                        disabled={updating === order._id}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => updateStatus(order._id, 'confirmed')}
                        disabled={updating === order._id}
                        className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Accept Order
                      </button>
                    </>
                  )}
                  {order.fulfillmentStatus === 'confirmed' && (
                    <button
                      onClick={() => updateStatus(order._id, 'preparing')}
                      disabled={updating === order._id}
                      className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Mark as Preparing
                    </button>
                  )}
                  {order.fulfillmentStatus === 'preparing' && (
                    <button
                      onClick={() => updateStatus(order._id, 'out_for_delivery')}
                      disabled={updating === order._id}
                      className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                    >
                      Ready / Out for Delivery
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
