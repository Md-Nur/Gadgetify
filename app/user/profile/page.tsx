"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((jData) => {
        if (jData.statusCode >= 400) router.push("/user/login");
        else router.push(`/user/profile/${jData.data.id}`);
      });
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <span className="loading loading-infinity loading-lg"></span>
    </div>
  );
};

export default Page;
