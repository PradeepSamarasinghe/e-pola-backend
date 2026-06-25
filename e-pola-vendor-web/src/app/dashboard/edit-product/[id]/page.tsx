"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("vendorToken");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/v1/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
          
          // Only fetch product if categories loaded, or do it in parallel
          fetchProduct(data);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    const fetchProduct = async (loadedCategories: any[]) => {
      if (!id) return;
      try {
        const res = await fetch(`/api/v1/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setName(data.name);
          setPrice(data.price.toString());
          setDescription(data.description || "");
          
          // Extract category ID whether populated or not
          const catId = data.category && typeof data.category === 'object' ? data.category._id : data.category;
          
          if (catId) {
            setCategory(catId);
          } else if (loadedCategories.length > 0) {
            setCategory(loadedCategories[0]._id || loadedCategories[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
        setError("Failed to load product details");
      }
    };

    fetchCategories();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = localStorage.getItem("vendorToken");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      let uploadedUrls: string[] = [];

      // 1. Upload images to Supabase if selected
      if (files.length > 0) {
        for (const file of files) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("products")
            .upload(filePath, file);

          if (uploadError) {
            throw new Error("Failed to upload image: " + uploadError.message);
          }

          const { data } = supabase.storage.from("products").getPublicUrl(filePath);
          uploadedUrls.push(data.publicUrl);
        }
      }

      // 2. Submit to backend
      const payload: any = {
        name,
        price: Number(price),
        description,
        category,
      };

      if (uploadedUrls.length > 0) {
        payload.image_url = uploadedUrls[0];
        payload.images = uploadedUrls; // This will overwrite existing images. To append, we would need the old images first.
      }

      const res = await fetch(`/api/v1/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        router.push("/dashboard/products");
      } else {
        throw new Error(result.message || result.error || "Failed to create product");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <Link href="/dashboard/products" className="text-gray-600 hover:text-gray-900 font-medium">
            Cancel
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                placeholder="e.g. Fresh Bananas"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price (LKR)
              </label>
              <input
                type="number"
                id="price"
                required
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                placeholder="Brief description of the product..."
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm bg-white"
              >
                {categories.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                Product Images
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </div>
              {files.length > 0 && (
                <p className="mt-2 text-sm text-gray-500">{files.length} file(s) selected</p>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "Updating Product..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
