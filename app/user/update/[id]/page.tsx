"use client";
import Forms from "@/components/Form";
import { useEffect, useState } from "react";
import { User } from "@/components/Member";
import { useUserAuth } from "@/app/context/userContext";
import { useRouter } from "next/navigation";

const UpdateUser = ({ params }: { params: { id: string } }) => {
  const { userAuth } = useUserAuth();
  const router = useRouter();
  const Props: any = {
    headingName: "Update User Infromation",
    method: "PUT",
    apiUrl: `/api/users/${params.id}`,
    submitName: "Update User",
  };
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<any>(null);
  useEffect(() => {
    if (userAuth.id !== Number(params.id))
      router.push(`/user/profile/${userAuth.id}`);
    fetch(`/api/users/${params.id}`)
      .then((res) => res.json())
      .then((jdata) => {
        if (jdata.statusCode >= 400) setError(jdata);
        return jdata.data;
      })
      .then((data) => setUser(data));
    //   .catch((err) => setError(err));
  }, [params.id, userAuth, router]);

  if (error)
    return (
      <div className="text-center text-error text-5xl py-52">
        {error?.errors}
      </div>
    );

  if (!user)
    return (
      <div className="h-screen flex justify-center items-center">
        <span className=" loading loading-infinity loading-lg"></span>
      </div>
    );

  return (
    <Forms {...Props}>
      <input
        type="text"
        placeholder="Full Name"
        name="fullname"
        className="input input-bordered w-full"
        value={user?.fullname}
        onChange={(e) => setUser({ ...user, fullname: e.target.value })}
      />
      <input
        type="number"
        placeholder="Roll No"
        name="rollNo"
        className="input input-bordered w-full"
        value={user?.rollNo}
        onChange={(e) => setUser({ ...user, rollNo: Number(e.target.value) })}
      />
      <input
        type="text"
        placeholder="Session"
        name="session"
        className="input input-bordered w-full"
        value={user?.session}
        onChange={(e) => setUser({ ...user, session: e.target.value })}
      />
      <label
        htmlFor="year"
        className="flex flex-wrap items-center justify-between w-full px-1 md:px-4 py-1 border rounded"
      >
        Year:
        <select
          name="year"
          id="year"
          className="select select-bordered w-full max-w-sm"
        >
          <option selected>{user.year}</option>
          <option>1st Year</option>
          <option>2nd Year</option>
          <option>3rd Year</option>
          <option>4th Year</option>
          <option>MSc Engg</option>
        </select>
      </label>
      <input
        type="tel"
        className="input input-bordered w-full"
        name="phone"
        placeholder="Phone Number"
        value={user?.phone}
        onChange={(e) => setUser({ ...user, phone: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        name="email"
        className="input input-bordered w-full"
        value={user?.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <input
        type="text"
        placeholder="Interests"
        name="interests"
        className="input input-bordered w-full"
        value={user?.interests}
        onChange={(e) => setUser({ ...user, interests: e.target.value })}
      />
      <input
        type="password"
        className="input input-bordered w-full"
        name="password"
        placeholder="Password (If you don't want to change password then remain this field blank"
      />

      <label
        htmlFor="img"
        className="flex items-center justify-between w-full px-1 md:px-4 py-1 border rounded"
      >
        <span className="hidden md:inline text-xs">
          Images: (If you don&apos;t want to update image remain this field
          blank){" "}
        </span>
        <input
          type="file"
          name="images"
          className="file-input w-full mx-5 rounded max-h-10 file-input-success"
          accept="image/png, image/jpeg"
          id="img"
        />
      </label>
    </Forms>
  );
};

export default UpdateUser;
