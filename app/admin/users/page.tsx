"use client";
import Link from "next/link";
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
                toast.error(result.message || "Failed to fetch users");
            }
        } catch (error) {
            toast.error("An error occurred while fetching users");
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
                        ? "User demoted from admin successfully"
                        : "User promoted to admin successfully"
                );
                fetchUsers();
            } else {
                toast.error(result.message || "Failed to update user role");
            }
        } catch (error) {
            toast.error("An error occurred while updating user role");
        } finally {
            setUpdating(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    const adminCount = users.filter((u) => u.isAdmin).length;
    const customerCount = users.length - adminCount;

    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
            <div className="flex justify-between items-center mb-8">
                <div className="flex flex-col gap-2">
                    <Link href="/admin" className="btn btn-sm btn-ghost w-fit gap-2 pl-0 hover:bg-transparent">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold">User Management</h1>
                </div>
            </div>

            {/* Statistics */}
            <div className="stats shadow mb-8 w-full">
                <div className="stat">
                    <div className="stat-figure text-primary">
                        <FaUser className="w-8 h-8" />
                    </div>
                    <div className="stat-title">Total Users</div>
                    <div className="stat-value text-primary">{users.length}</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <FaUserShield className="w-8 h-8" />
                    </div>
                    <div className="stat-title">Admins</div>
                    <div className="stat-value text-secondary">{adminCount}</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-accent">
                        <FaUser className="w-8 h-8" />
                    </div>
                    <div className="stat-title">Customers</div>
                    <div className="stat-value text-accent">{customerCount}</div>
                </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto bg-base-200 rounded-lg">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <div className="flex items-center gap-2">
                                        {user.isAdmin && <FaCrown className="text-warning" />}
                                        <span className="font-medium">{user.name}</span>
                                    </div>
                                </td>
                                <td>{user.email || "N/A"}</td>
                                <td>{user.phone}</td>
                                <td>
                                    {user.isAdmin ? (
                                        <span className="badge badge-warning gap-2">
                                            <FaUserShield /> Admin
                                        </span>
                                    ) : (
                                        <span className="badge badge-ghost gap-2">
                                            <FaUser /> Customer
                                        </span>
                                    )}
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className={`btn btn-sm ${user.isAdmin ? "btn-error" : "btn-success"
                                            }`}
                                        onClick={() => toggleAdminStatus(user.id, user.isAdmin)}
                                        disabled={updating === user.id || (user.isAdmin && adminCount === 1)}
                                    >
                                        {updating === user.id ? (
                                            <span className="loading loading-spinner loading-xs"></span>
                                        ) : user.isAdmin ? (
                                            "Demote"
                                        ) : (
                                            "Promote to Admin"
                                        )}
                                    </button>
                                    {user.isAdmin && adminCount === 1 && (
                                        <p className="text-xs text-error mt-1">Last admin</p>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {users.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-base-content/70">No users found</p>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
