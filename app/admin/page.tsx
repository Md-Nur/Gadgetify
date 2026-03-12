import Link from "next/link";
import React from "react";
import { FaBox, FaClipboardList, FaUsers, FaMoneyBillWave } from "react-icons/fa";
import { prisma } from "@/lib/prisma";

const Admin = async () => {
  // Fetch stats from DB
  const [productCount, orderCount, userCount, orders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.findMany({
      select: { totalAmount: true },
    }),
  ]);

  const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  const stats = [
    {
      label: "মোট পণ্য",
      value: productCount,
      icon: <FaBox className="w-6 h-6" />,
      color: "bg-primary",
    },
    {
      label: "মোট অর্ডার",
      value: orderCount,
      icon: <FaClipboardList className="w-6 h-6" />,
      color: "bg-secondary",
    },
    {
      label: "মোট ব্যবহারকারী",
      value: userCount,
      icon: <FaUsers className="w-6 h-6" />,
      color: "bg-accent",
    },
    {
      label: "মোট বিক্রি",
      value: `৳${totalSales.toLocaleString()}`,
      icon: <FaMoneyBillWave className="w-6 h-6" />,
      color: "bg-success",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold">অ্যাডমিন ড্যাশবোর্ড</h1>
        <p className="text-base-content/60 mt-2">আপনার দোকানের বর্তমান অবস্থা দেখুন।</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="card bg-base-200 shadow-sm border border-base-300">
            <div className="card-body p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-base-content/60">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={`${stat.color} text-white p-3 rounded-xl shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-2xl font-bold mt-12 mb-6">দ্রুত অ্যাকশন</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Products Management */}
        <Link href="/admin/add-product" className="card bg-base-200 hover:bg-base-300 transition-all hover:-translate-y-1 shadow-sm hover:shadow-md border border-base-300">
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary p-4 rounded-xl">
                <FaBox className="w-8 h-8" />
              </div>
              <div>
                <h2 className="card-title">পণ্য ব্যবস্থাপনা</h2>
                <p className="text-base-content/70 text-sm">পণ্য যোগ করুন, সম্পাদনা করুন বা সরিয়ে ফেলুন</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Orders Management */}
        <Link href="/admin/orders" className="card bg-base-200 hover:bg-base-300 transition-all hover:-translate-y-1 shadow-sm hover:shadow-md border border-base-300">
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="bg-secondary/10 text-secondary p-4 rounded-xl">
                <FaClipboardList className="w-8 h-8" />
              </div>
              <div>
                <h2 className="card-title">অর্ডার ব্যবস্থাপনা</h2>
                <p className="text-base-content/70 text-sm">গ্রাহকের অর্ডার দেখুন এবং পরিচালনা করুন</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Users Management */}
        <Link href="/admin/users" className="card bg-base-200 hover:bg-base-300 transition-all hover:-translate-y-1 shadow-sm hover:shadow-md border border-base-300">
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="bg-accent/10 text-accent p-4 rounded-xl">
                <FaUsers className="w-8 h-8" />
              </div>
              <div>
                <h2 className="card-title">ব্যবহারকারী ব্যবস্থাপনা</h2>
                <p className="text-base-content/70 text-sm">ব্যবহারকারী এবং অ্যাডমিন রোল পরিচালনা করুন</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Admin;