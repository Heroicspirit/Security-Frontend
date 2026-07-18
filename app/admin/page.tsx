"use client";

import { useRouter } from "next/navigation";
import { Package, Users, ShoppingCart, Plus } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();

  const quickActions = [
    {
      title: "Add Product",
      description: "Create a new product with images",
      icon: Plus,
      action: () => router.push("/admin/products"),
      color: "bg-blue-500"
    },
    {
      title: "Manage Products",
      description: "View and edit existing products",
      icon: Package,
      action: () => router.push("/admin/products/list"),
      color: "bg-green-500"
    },
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      icon: Users,
      action: () => router.push("/admin/users"),
      color: "bg-purple-500"
    },
    {
      title: "View Orders",
      description: "Manage customer orders",
      icon: ShoppingCart,
      action: () => router.push("/admin/orders"),
      color: "bg-orange-500"
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left"
          >
            <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
            <p className="text-sm text-gray-600">{action.description}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}