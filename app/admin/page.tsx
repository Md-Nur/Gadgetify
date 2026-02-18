import Link from "next/link";
import React from "react";
import { FaBox, FaClipboardList, FaUsers } from "react-icons/fa";

const Admin = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Products Management */}
        <Link href="/admin/add-product" className="card bg-base-200 hover:bg-base-300 transition-colors">
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="bg-primary text-primary-content p-4 rounded-lg">
                <FaBox className="w-8 h-8" />
              </div>
              <div>
                <h2 className="card-title">Product Management</h2>
                <p className="text-base-content/70">Add, edit, or remove products</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Orders Management */}
        <Link href="/admin/orders" className="card bg-base-200 hover:bg-base-300 transition-colors">
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="bg-secondary text-secondary-content p-4 rounded-lg">
                <FaClipboardList className="w-8 h-8" />
              </div>
              <div>
                <h2 className="card-title">Orders Management</h2>
                <p className="text-base-content/70">View and manage customer orders</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Users Management */}
        <Link href="/admin/users" className="card bg-base-200 hover:bg-base-300 transition-colors">
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="bg-accent text-accent-content p-4 rounded-lg">
                <FaUsers className="w-8 h-8" />
              </div>
              <div>
                <h2 className="card-title">Users Management</h2>
                <p className="text-base-content/70">Manage users and admin roles</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Admin;