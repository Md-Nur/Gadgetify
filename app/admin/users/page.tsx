"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaUserShield, FaUser, FaCrown } from "react-icons/fa";

interface User {
    id: string;
    name: string;
    email: string | null;
    phone: string;
    isAdmin: boolean;
    createdAt: string;
}

const AdminUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/admin/users");
            const result = await response.json();

            if (result.success) {
                setUsers(result.data);
            } else {
                toast.error(result.message || "ব্যবহারকারী তথ্য আনতে ব্যর্থ হয়েছে");
            }
        } catch (error) {
            toast.error("ব্যবহারকারী তথ্য আনার সময় একটি ভুল হয়েছে");
        } finally {
            setLoading(false);
        }
    };

    const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
        setUpdating(userId);
        try {
            const response = await fetch(`/api/admin/users/${userId}/promote`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isAdmin: !currentStatus }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success(
                    currentStatus
                        ? "অ্যাডমিন থেকে সফলভাবে সরানো হয়েছে"
                        : "সফলভাবে অ্যাডমিন করা হয়েছে"
                );
                fetchUsers();
            } else {
                toast.error(result.message || "রোল পরিবর্তন করতে ব্যর্থ হয়েছে");
            }
        } catch (error) {
            toast.error("রোল পরিবর্তনের সময় একটি ভুল হয়েছে");
        } finally {
            setUpdating(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    const adminCount = users.filter((u) => u.isAdmin).length;
    const customerCount = users.length - adminCount;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">ব্যবহারকারী ব্যবস্থাপনা</h1>
                    <p className="text-base-content/60 mt-1">আপনার দোকানের সব ব্যবহারকারী এবং অ্যাডমিনদের তালিকা।</p>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card bg-base-200 shadow-sm border border-base-300">
                    <div className="card-body py-4 px-6 flex-row items-center gap-4">
                        <div className="bg-primary/10 text-primary p-3 rounded-xl">
                            <FaUser className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-base-content/60">মোট ব্যবহারকারী</p>
                            <h3 className="text-2xl font-bold">{users.length}</h3>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-200 shadow-sm border border-base-300">
                    <div className="card-body py-4 px-6 flex-row items-center gap-4">
                        <div className="bg-secondary/10 text-secondary p-3 rounded-xl">
                            <FaUserShield className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-base-content/60">অ্যাডমিন</p>
                            <h3 className="text-2xl font-bold">{adminCount}</h3>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-200 shadow-sm border border-base-300">
                    <div className="card-body py-4 px-6 flex-row items-center gap-4">
                        <div className="bg-accent/10 text-accent p-3 rounded-xl">
                            <FaUser className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-base-content/60">ক্রেতা</p>
                            <h3 className="text-2xl font-bold">{customerCount}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto bg-base-100 rounded-3xl shadow-sm border border-base-300">
                <table className="table table-zebra w-full">
                    <thead className="bg-base-200/50">
                        <tr>
                            <th className="py-5 pl-6">নাম</th>
                            <th className="py-5">ইমেইল</th>
                            <th className="py-5">ফোন</th>
                            <th className="py-5 text-center">রোল</th>
                            <th className="py-5 hidden lg:table-cell">যুক্ত হয়েছেন</th>
                            <th className="py-5 text-right pr-6">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-base-200/30 transition-colors group">
                                <td className="pl-6">
                                    <div className="flex items-center gap-3">
                                        <div className="avatar placeholder">
                                            <div className="bg-base-300 text-base-content rounded-xl w-10">
                                                <span>{user.name.charAt(0)}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold">{user.name}</span>
                                                {user.isAdmin && <FaCrown className="text-warning text-xs" />}
                                            </div>
                                            <span className="text-xs text-base-content/50 lg:hidden font-mono">{user.phone}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>{user.email || "-"}</td>
                                <td>{user.phone}</td>
                                <td className="text-center">
                                    {user.isAdmin ? (
                                        <span className="badge badge-warning badge-sm sm:badge-md gap-2 font-bold py-3 px-4">
                                            <FaUserShield className="text-[10px]" /> অ্যাডমিন
                                        </span>
                                    ) : (
                                        <span className="badge badge-ghost badge-sm sm:badge-md gap-2 font-bold py-3 px-4">
                                            <FaUser className="text-[10px]" /> ক্রেতা
                                        </span>
                                    )}
                                </td>
                                <td className="hidden lg:table-cell opacity-50 text-sm">
                                    {new Date(user.createdAt).toLocaleDateString("bn-BD")}
                                </td>
                                <td className="text-right pr-6">
                                    <button
                                        className={`btn btn-sm rounded-xl px-4 h-10 min-h-0 ${user.isAdmin ? "btn-error btn-outline" : "btn-primary"
                                            }`}
                                        onClick={() => toggleAdminStatus(user.id, user.isAdmin)}
                                        disabled={updating === user.id || (user.isAdmin && adminCount === 1)}
                                    >
                                        {updating === user.id ? (
                                            <span className="loading loading-spinner loading-xs"></span>
                                        ) : user.isAdmin ? (
                                            "সরিয়ে দিন"
                                        ) : (
                                            "অ্যাডমিন করুন"
                                        )}
                                    </button>
                                    {user.isAdmin && adminCount === 1 && (
                                        <p className="text-[10px] text-error mt-1 font-bold">শেষ অ্যাডমিন</p>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {users.length === 0 && (
                <div className="text-center py-20 bg-base-200 rounded-3xl border-2 border-dashed border-base-300">
                    <p className="text-base-content/60 font-medium">কোন ব্যবহারকারী পাওয়া যায়নি</p>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
