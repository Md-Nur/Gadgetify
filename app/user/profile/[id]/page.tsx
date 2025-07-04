"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";
import { useUserAuth } from "@/app/context/userContext";
import { User } from "@/components/Member";

const Profile = ({ params }: { params: { id: string } }) => {
  const { userAuth } = useUserAuth();
  const [user, setUser] = useState<User | any>();
  const [error, setError] = useState<any>();
  useEffect(() => {
    fetch(`/api/users/${params.id}`)
      .then((res) => res.json())
      .then((jdata) => {
        if (jdata.statusCode >= 400) setError(jdata);
        return jdata.data;
      })
      .then((data) => setUser(data));
  }, [params.id, error]);
  if (!user)
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  if (error)
    return (
      <div className="text-center text-error text-5xl py-52">
        {error?.errors}
      </div>
    );
  return (
    <main className="hero py-16">
      <div className="hero-content flex-col lg:flex-row">
        <Image
          alt={user.fullname}
          src={user?.images}
          width={500}
          height={500}
          className="w-[85vw] h-[85vw] max-h-[500px] max-w-[500px] rounded-lg shadow-2xl object-cover"
        />
        <div>
          <h1 className="text-xl sm:text-5xl font-bold">{user.fullname}</h1>
          <p className="ml-3 mt-6">Roll No: {user?.rollNo}</p>
          <p className="ml-3 my-3">Session: {user?.session}</p>
          <p className="ml-3 my-3">Year: {user?.year}</p>
          <p className="ml-3 my-3">Phone: {user.phone}</p>
          <p className="ml-3 my-3">Email: {user.email}</p>
          <p className="ml-3 mb-6">Interest In: {user?.interests}</p>
          <div className="flex flex-wrap items-center justify-around gap-2">
            {userAuth?.id === user.id && (
              <Link href={`/user/update/${user.id}`} className="btn btn-info">
                Update User Info
              </Link>
            )}
            {userAuth.isAdmin && !user?.isAdmin && userAuth.id !== user.id && (
              <DeleteButton apiUrl={`/api/users/${user.id || params.id}`} />
            )}
            {userAuth?.isAdmin && (
              <Link
                href={`/admin/update-admin/${params?.id || user?.id}`}
                className="btn btn-warning"
              >
                Update Admin Info
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
