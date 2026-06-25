"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("vendorToken");
    if (!token) {
      router.push("/login");
      return;
    }

    const checkStore = async () => {
      try {
        const res = await fetch("/api/v1/stores/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.status === 404) {
          if (pathname !== "/dashboard/apply") {
            router.push("/dashboard/apply");
          } else {
            setLoading(false);
          }
          return;
        }

        const data = await res.json();
        if (res.ok && data.store) {
          setStatus(data.store.status);
          if (data.store.status === 'pending' && pathname === "/dashboard/apply") {
             router.push("/dashboard"); // redirect away from apply if already pending
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkStore();
  }, [pathname, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading your store details...</div>;
  }

  if (pathname === "/dashboard/apply") {
    return <>{children}</>;
  }

  if (status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center space-y-6 p-8 bg-white rounded-xl shadow-md">
          <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto text-3xl">⏳</div>
          <h2 className="text-2xl font-bold text-gray-900">Application Pending</h2>
          <p className="text-gray-600">Your store application is currently under review by our admin team. We will notify you once it has been approved.</p>
        </div>
      </div>
    );
  }
  
  if (status === 'suspended' || status === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center space-y-6 p-8 bg-white rounded-xl shadow-md">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-3xl">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900">Application {status === 'rejected' ? 'Rejected' : 'Suspended'}</h2>
          <p className="text-gray-600">Unfortunately, your store account is currently {status}. Please contact support for more information.</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-xl font-bold text-green-700 mr-8">E-pola Vendor</h1>
              <div className="flex space-x-4">
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === "/dashboard" ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/products"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === "/dashboard/products" ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Products
                </Link>
                <Link
                  href="/dashboard/orders"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === "/dashboard/orders" ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Orders
                </Link>
              </div>
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
      <main>
        {children}
      </main>
    </div>
  );
}
