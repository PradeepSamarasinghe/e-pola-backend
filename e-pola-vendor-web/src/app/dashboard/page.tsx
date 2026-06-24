"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  image_url?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("vendorToken");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchProducts(token);
  }, []);

  const fetchProducts = async (token: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/products/vendor", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("vendorToken");
        router.push("/login");
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vendorToken");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Store Dashboard</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Your Products</h2>
            <Link
              href="/dashboard/add-product"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-medium"
            >
              Add New Product
            </Link>
          </div>

          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <p className="text-gray-500 mb-4">You haven't added any products yet.</p>
              <Link
                href="/dashboard/add-product"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Get started by adding one
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {products.map((product) => (
                  <li key={product._id} className="p-4 flex items-center">
                    <img
                      src={product.image_url || product.image || "https://via.placeholder.com/150"}
                      alt={product.name}
                      className="h-16 w-16 rounded-md object-cover mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                      <p className="text-gray-500">LKR {product.price}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
