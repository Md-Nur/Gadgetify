"use client";
import { useState } from "react";
import Forms from "@/app/components/Forms";

interface User {
    id: string;
    name: string | null;
    phone: string;
    address: string;
}

const UpdateUserForm = ({ id, initialUser }: { id: string, initialUser: User }) => {
    const Props: any = {
        headingName: "Update User Information",
        method: "PUT",
        apiUrl: `/api/users/${id}`,
        submitName: "Update User",
    };
    const [user, setUser] = useState<User>(initialUser);

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title text-2xl font-bold mb-6 justify-center">Update Profile</h2>
                <Forms {...Props}>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Full Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Type your name"
                            name="name"
                            className="input input-bordered w-full focus:input-primary"
                            value={user?.name || ""}
                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                        />
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Phone Number</span>
                        </label>
                        <input
                            type="tel"
                            className="input input-bordered w-full focus:input-primary"
                            name="phone"
                            placeholder="Type your phone number"
                            value={user?.phone}
                            onChange={(e) => setUser({ ...user, phone: e.target.value })}
                        />
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Address</span>
                        </label>
                        <textarea
                            placeholder="Type your full address"
                            name="address"
                            className="textarea textarea-bordered w-full focus:textarea-primary h-24"
                            value={user?.address}
                            onChange={(e) => setUser({ ...user, address: e.target.value })}
                        />
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">New Password</span>
                        </label>
                        <input
                            type="password"
                            className="input input-bordered w-full focus:input-primary"
                            name="password"
                            placeholder="Leave blank to keep current password"
                        />
                    </div>
                </Forms>
            </div>
        </div>
    );
};

export default UpdateUserForm;
